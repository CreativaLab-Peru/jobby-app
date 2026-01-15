import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { CvSectionType, JobStatus, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import {getPromptToEvaluateCv} from "@/features/cv/prompts/get-prompt-to-evaluate-cv";
import {queryGemini} from "@/features/cv/queries/query-gemini";

type EvaluateCvResponse = {
  overallScore: number;
  summary: string;
  sectionScores: Array<{
    sectionType: CvSectionType;
    score: number;
    details: Record<string, number>;
  }>;
  recommendations: Array<{
    sectionType: CvSectionType;
    text: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
  }>;
};

/**
 * Builds CV data from sections when extractedJson is not available (manual CVs)
 */
function buildCvDataFromSections(sections: any[]): Record<string, any> {
  const cvData: Record<string, any> = {};
  
  for (const section of sections) {
    const sectionType = section.sectionType?.toLowerCase() || "";
    const content = section.contentJson;
    
    if (!content) continue;
    
    switch (section.sectionType) {
      case CvSectionType.SUMMARY:
        cvData.summary = content.text || content;
        break;
      case CvSectionType.EXPERIENCE:
        cvData.experience = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.EDUCATION:
        cvData.education = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.SKILLS:
        cvData.skills = content;
        break;
      case CvSectionType.PROJECTS:
        cvData.projects = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.CERTIFICATIONS:
        cvData.certifications = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.LANGUAGES:
        cvData.languages = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.CONTACT:
        cvData.contact = content;
        break;
      case CvSectionType.ACHIEVEMENTS:
        cvData.achievements = Array.isArray(content) ? content : [content];
        break;
      case CvSectionType.VOLUNTEERING:
        cvData.volunteering = Array.isArray(content) ? content : [content];
        break;
    }
  }
  
  return cvData;
}

/**
 * Refunds the analysis token when evaluation fails
 */
async function refundAnalysisToken(userId: string): Promise<void> {
  try {
    const userPayment = await prisma.userPayment.findFirst({
      where: { 
        userId,
        uploadCvsUsed: { gt: 0 }
      },
      orderBy: { updatedAt: "desc" },
    });

    if (userPayment && userPayment.uploadCvsUsed > 0) {
      await prisma.userPayment.update({
        where: { id: userPayment.id },
        data: { uploadCvsUsed: userPayment.uploadCvsUsed - 1 },
      });
    }
  } catch (error) {
    console.error("Failed to refund analysis token:", error);
  }
}

export const evaluateCv = inngest.createFunction(
  { id: "evaluate-cv" },
  { event: "cv/ready-for-evaluation" },
  async ({ event }) => {
    const { cvId, userId } = event.data;

    // Fetch CV with sections for manual CVs support
    const cv = await prisma.cv.findUnique({ 
      where: { id: cvId },
      include: { sections: true }
    });
    
    // Build CV data from extractedJson OR sections
    let cvDataForEvaluation: any;
    
    if (cv?.extractedJson) {
      // Uploaded CV with extracted data
      cvDataForEvaluation = cv.extractedJson;
    } else if (cv?.sections && cv.sections.length > 0) {
      // Manual CV - build data from sections
      cvDataForEvaluation = buildCvDataFromSections(cv.sections);
    } else {
      // Refund token and fail
      await refundAnalysisToken(userId);
      throw new Error("CV data not available - no extractedJson or sections found");
    }

    // ✅ Create evaluation record
    const evaluation = await prisma.cvEvaluation.create({
      data: { cvId, status: JobStatus.IN_PROGRESS },
    });

    // ✅ Log: Evaluation started
    await logsService.createLog({
      userId,
      action: LogAction.EVALUATION,
      level: LogLevel.INFO,
      entity: "CV_EVALUATION",
      entityId: evaluation.id,
      message: "Started evaluating CV",
      metadata: { cvId },
    });

    try {
      // ✅ Generate prompt using the appropriate CV data
      const promptToEvaluateCv = getPromptToEvaluateCv(cvDataForEvaluation);

      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.INFO,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "Prompt generated for CV evaluation",
        metadata: { promptLength: promptToEvaluateCv.length },
      });

      // ✅ Query Gemini
      const result = await queryGemini<EvaluateCvResponse>({
        prompt: promptToEvaluateCv,
        type: "JSON",
      });

      // ✅ Handle model failure
      if (!result.success) {
        await logsService.createLog({
          userId,
          action: LogAction.EVALUATION,
          level: LogLevel.ERROR,
          entity: "CV_EVALUATION",
          entityId: evaluation.id,
          message: "Gemini evaluation failed",
          metadata: {
            cvId,
            errorMessage: result.message,
            rawResponse: result,
          },
        });

        throw new Error(result.message ?? "Evaluation failed");
      }

      // ✅ Log: Successful Gemini result received
      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.INFO,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "Gemini returned successful evaluation response",
        metadata: {
          overallScore: result.data.overallScore,
          sections: result.data.sectionScores.length,
          recommendations: result.data.recommendations.length,
        },
      });

      // ✅ Save everything inside a transaction
      await prisma.$transaction(async (tx) => {
        await tx.cvEvaluation.update({
          where: { id: evaluation.id },
          data: {
            status: JobStatus.SUCCEEDED,
            overallScore: result.data.overallScore,
            summary: result.data.summary,
          },
        });

        for (const score of result.data.sectionScores) {
          await tx.evaluationScore.create({
            data: {
              evaluationId: evaluation.id,
              sectionType: score.sectionType,
              score: score.score,
              detailsJson: score.details,
            },
          });
        }

        for (const rec of result.data.recommendations) {
          await tx.recommendation.create({
            data: {
              evaluationId: evaluation.id,
              sectionType: rec.sectionType,
              text: rec.text,
              severity: rec.severity,
            },
          });
        }
      });

      // ✅ Log: Evaluation completed successfully
      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.INFO,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "CV evaluation completed successfully",
        metadata: {
          cvId,
          overallScore: result.data.overallScore,
        },
      });

    } catch (error: any) {
      // ✅ Update evaluation record
      await prisma.cvEvaluation.update({
        where: { id: evaluation.id },
        data: { status: JobStatus.FAILED },
      });

      // ✅ Refund the analysis token since evaluation failed
      await refundAnalysisToken(userId);

      // ✅ Log failure
      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.ERROR,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "CV evaluation failed - token refunded",
        metadata: {
          cvId,
          error: error?.message,
          stack: error?.stack,
        },
      });

      throw error;
    }
  }
);
