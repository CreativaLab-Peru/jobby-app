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

export const evaluateCv = inngest.createFunction(
  { id: "evaluate-cv" },
  { event: "cv/ready-for-evaluation" },
  async ({ event }) => {
    const { cvId, userId } = event.data;

    const cv = await prisma.cv.findUnique({ where: { id: cvId } });
    if (!cv?.extractedJson) throw new Error("CV data not extracted");

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
      // ✅ Generate prompt
      const promptToEvaluateCv = getPromptToEvaluateCv(cv.extractedJson);

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

      // ✅ Log failure
      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.ERROR,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "CV evaluation failed",
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
