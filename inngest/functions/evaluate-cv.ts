import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {CreditBalanceType, CvSectionType, JobStatus, LogAction, LogLevel, RouteStatus} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {getPromptToEvaluateCv} from "@/features/cv/prompts/get-prompt-to-evaluate-cv";
import {queryGemini} from "@/features/cv/queries/query-gemini";
import {consumeCredits} from "@/features/credits/actions/consume-credits";
import type {EvaluateCvSectionsPayload} from "@/features/cv/helpers/types";

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
  improvedTexts: Array<{
    sectionType: string;
    originalSnippet: string;
    improvedText: string;
    changeReason: string;
  }>;
  suggestedAdditions: Array<{
    sectionType: string;
    title: string;
    suggestedText: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
    reason: string;
  }>;
};

type CvSectionInput = {
  sectionType?: CvSectionType | string;
  contentJson?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  return isRecord(value) ? [value] : [];
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (isRecord(item) && typeof item.name === "string") return item.name;
      return "";
    })
    .filter(Boolean);
};

/**
 * Normalizes CV sections to the mapped structure used by CV forms.
 */
function buildMappedSectionsPayload(sections: CvSectionInput[]): EvaluateCvSectionsPayload {
  const payload: EvaluateCvSectionsPayload = {};
  const personal: Record<string, unknown> = {};
  const skills: Record<string, unknown> = {};

  for (const section of sections) {
    const content = section.contentJson;
    if (!content) continue;

    switch (section.sectionType) {
      case CvSectionType.SUMMARY: {
        if (typeof content === "string") {
          personal.summary = content;
        } else if (isRecord(content) && typeof content.text === "string") {
          personal.summary = content.text;
        }
        break;
      }
      case CvSectionType.CONTACT: {
        if (isRecord(content)) {
          Object.assign(personal, content);
        }
        break;
      }
      case CvSectionType.EXPERIENCE:
        payload.experience = {items: toRecordArray(content)};
        break;
      case CvSectionType.EDUCATION:
        payload.education = {items: toRecordArray(content)};
        break;
      case CvSectionType.PROJECTS:
        payload.projects = {items: toRecordArray(content)};
        break;
      case CvSectionType.ACHIEVEMENTS:
        payload.achievements = {items: toRecordArray(content)};
        break;
      case CvSectionType.CERTIFICATIONS:
        payload.certifications = {items: toRecordArray(content)};
        break;
      case CvSectionType.VOLUNTEERING:
        payload.volunteering = {items: toRecordArray(content)};
        break;
      case CvSectionType.SKILLS: {
        if (isRecord(content)) {
          skills.technical = toStringArray(content.technical);
          skills.soft = toStringArray(content.soft);
          skills.languages = toStringArray(content.languages);
        } else {
          skills.technical = toStringArray(content);
        }
        break;
      }
      case CvSectionType.LANGUAGES: {
        const currentLanguages = Array.isArray(skills.languages)
          ? (skills.languages as string[])
          : [];
        const languageValues = toStringArray(content);
        skills.languages = Array.from(new Set([...currentLanguages, ...languageValues]));
        break;
      }
      default:
        break;
    }
  }

  if (Object.keys(personal).length > 0) {
    payload.personal = personal;
  }

  if (Object.keys(skills).length > 0) {
    payload.skills = skills;
  }

  return payload;
}

function buildMappedSectionsFromLegacyExtractedJson(raw: Record<string, unknown>): EvaluateCvSectionsPayload {
  const mappedSections: CvSectionInput[] = [];

  if (raw.summary !== undefined) {
    mappedSections.push({
      sectionType: CvSectionType.SUMMARY,
      contentJson: raw.summary,
    });
  }

  if (raw.contact !== undefined) {
    mappedSections.push({
      sectionType: CvSectionType.CONTACT,
      contentJson: raw.contact,
    });
  }

  if (raw.experience !== undefined) mappedSections.push({sectionType: CvSectionType.EXPERIENCE, contentJson: raw.experience});
  if (raw.education !== undefined) mappedSections.push({sectionType: CvSectionType.EDUCATION, contentJson: raw.education});
  if (raw.projects !== undefined) mappedSections.push({sectionType: CvSectionType.PROJECTS, contentJson: raw.projects});
  if (raw.achievements !== undefined) mappedSections.push({sectionType: CvSectionType.ACHIEVEMENTS, contentJson: raw.achievements});
  if (raw.certifications !== undefined) mappedSections.push({sectionType: CvSectionType.CERTIFICATIONS, contentJson: raw.certifications});
  if (raw.volunteering !== undefined) mappedSections.push({sectionType: CvSectionType.VOLUNTEERING, contentJson: raw.volunteering});
  if (raw.skills !== undefined) mappedSections.push({sectionType: CvSectionType.SKILLS, contentJson: raw.skills});
  if (raw.languages !== undefined) mappedSections.push({sectionType: CvSectionType.LANGUAGES, contentJson: raw.languages});

  return buildMappedSectionsPayload(mappedSections);
}

function buildCvPayloadForEvaluation(cv: {sections?: CvSectionInput[]; extractedJson?: unknown}): EvaluateCvSectionsPayload {
  if (Array.isArray(cv.sections) && cv.sections.length > 0) {
    return buildMappedSectionsPayload(cv.sections);
  }

  if (isRecord(cv.extractedJson)) {
    const extractedSections = cv.extractedJson.sections;

    if (Array.isArray(extractedSections)) {
      return buildMappedSectionsPayload(extractedSections as CvSectionInput[]);
    }

    return buildMappedSectionsFromLegacyExtractedJson(cv.extractedJson);
  }

  return {};
}

/**
 * Refunds the analysis token when evaluation fails
 */
async function refundAnalysisToken(userId: string): Promise<void> {
  try {
    const userPayment = await prisma.userPayment.findFirst({
      where: {
        userId,
        uploadCvsUsed: {gt: 0}
      },
      orderBy: {updatedAt: "desc"},
    });

    if (userPayment && userPayment.uploadCvsUsed > 0) {
      await prisma.userPayment.update({
        where: {id: userPayment.id},
        data: {uploadCvsUsed: userPayment.uploadCvsUsed - 1},
      });
    }
  } catch (error) {
    console.error("Failed to refund analysis token:", error);
  }
}

export const evaluateCv = inngest.createFunction(
  {id: "evaluate-cv"},
  {event: "cv/ready-for-evaluation"},
  async ({event}) => {
    const {cvId, userId, evaluationId} = event.data;

    // ✅ Create and mark job as IN_PROGRESS
    const job = await prisma.queueJob.upsert({
      where: { jobId: event.id },
      update: {
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      create: {
        jobId: event.id,
        type: "EVALUATE_CV",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        cvId,
        startedAt: new Date(),
      },
    });

    // ✅ Log: job started
    await logsService.createLog({
      userId,
      action: LogAction.EVALUATION,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "Started evaluate-cv job",
      metadata: { cvId, evaluationId },
    });

    // Fetch CV with sections for manual CVs support
    const cv = await prisma.cv.findUnique({
      where: {id: cvId},
      include: {sections: true}
    });

    // Build payload only with mapped sections used by CV forms.
    const mappedSectionsForEvaluation = buildCvPayloadForEvaluation({
      sections: cv?.sections,
      extractedJson: cv?.extractedJson,
    });

    if (Object.keys(mappedSectionsForEvaluation).length === 0) {
      // Refund token and fail
      await refundAnalysisToken(userId);
      throw new Error("CV data not available - no mapped sections found for evaluation");
    }
    let evaluation: any = null;

    // ✅ Create evaluation record
    if (evaluationId) {
      evaluation = await prisma.cvEvaluation.findUnique({
        where: {id: evaluationId},
      });

      if (!evaluation) {
        await refundAnalysisToken(userId);
        throw new Error("Evaluation record not found for provided evaluationId");
      }
    } else {
      evaluation = await prisma.cvEvaluation.create({
        data: {cvId, status: JobStatus.IN_PROGRESS},
      });
    }

    // ✅ Log: Evaluation started
    await logsService.createLog({
      userId,
      action: LogAction.EVALUATION,
      level: LogLevel.INFO,
      entity: "CV_EVALUATION",
      entityId: evaluation.id,
      message: "Started evaluating CV",
      metadata: {cvId},
    });

    try {
      // ✅ Generate prompt using the appropriate CV data
      const promptToEvaluateCv = getPromptToEvaluateCv(
        mappedSectionsForEvaluation,
        cv?.cvType ?? null,
        cv?.opportunityType ?? null,
      );

      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.INFO,
        entity: "CV_EVALUATION",
        entityId: evaluation.id,
        message: "Prompt generated for CV evaluation",
        metadata: {promptLength: promptToEvaluateCv.length},
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
          where: {id: evaluation.id},
          data: {
            status: JobStatus.SUCCEEDED,
            overallScore: result.data.overallScore,
            summary: result.data.summary,
            improvementsJson: {
              improvedTexts: result.data.improvedTexts || [],
              suggestedAdditions: result.data.suggestedAdditions || [],
            },
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

      await consumeCredits({
        userId,
        type: CreditBalanceType.AI_ACTIONS,
        amount: 1,
        description: `Evaluación para CV ${cvId}`,
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

      // ✅ Mark job as SUCCEEDED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });

      // ✅ Advance route status to ANALYSIS_DONE
      const route = await prisma.route.findFirst({
        where: { cvId, userId },
      });
      if (route && (
        route.status === RouteStatus.CV_CREATED ||
        route.status === RouteStatus.ANALYSIS_PENDING
      )) {
        await prisma.route.update({
          where: { id: route.id },
          data: { status: RouteStatus.ANALYSIS_DONE },
        });
      }

    } catch (error: any) {
      // ✅ Update evaluation record
      await prisma.cvEvaluation.update({
        where: {id: evaluation.id},
        data: {status: JobStatus.FAILED},
      });

      // ✅ Mark job as FAILED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: error?.message ?? "Unknown error",
          finishedAt: new Date(),
        },
      });

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
