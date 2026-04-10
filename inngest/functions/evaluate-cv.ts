import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { CreditBalanceType, JobStatus, RouteStatus } from "@prisma/client";
import { getPromptToEvaluateCv } from "@/features/cv/prompts/get-prompt-to-evaluate-cv";
import { queryGemini } from "@/features/cv/queries/query-gemini";
import {consumeCredits, ConsumeCreditsParams} from "@/features/credits/actions/consume-credits";
import {
  allowedSectionTypesFromPayload,
  AiEvaluationResult,
  buildCvPayloadForEvaluation,
  sanitizeSectionType
} from "../utils/cv-evaluation-helper";
import {refundCredits} from "@/features/credits/actions/refund-credits";

export const evaluateCv = inngest.createFunction(
  { id: "evaluate-cv", name: "Evaluate CV with AI" },
  { event: "cv/ready-for-evaluation" },
  async ({ event, step }) => {
    const { cvId, userId, evaluationId } = event.data as {
      cvId: string;
      userId: string; // Todo: we don't need to delete
      evaluationId?: string
    };

    // 1. Inicialización del Job
    const job = await step.run("initialize-job", async () => {
      return prisma.queueJob.upsert({
        where: { jobId: event.id },
        update: { status: JobStatus.IN_PROGRESS, startedAt: new Date() },
        create: {
          jobId: event.id,
          type: "EVALUATE_CV",
          payload: event.data,
          status: JobStatus.IN_PROGRESS,
          cvId,
          startedAt: new Date(),
        },
      });
    });

    // 2. Preparación de Datos
    const { filteredSections, cv, allowedSectionTypes } = await step.run("prepare-data", async () => {
      const cvData = await prisma.cv.findUnique({
        where: { id: cvId },
        include: { sections: { where: { isVisible: true } } }
      });

      const fullPayload = buildCvPayloadForEvaluation({
        sections: cvData?.sections,
      });
      console.log("[fullPayload]", fullPayload)

      const allowed = Array.from(allowedSectionTypesFromPayload(fullPayload));

      return { filteredSections: fullPayload, cv: cvData, allowedSectionTypes: allowed };
    });

    if (Object.keys(filteredSections).length === 0) {
      throw new Error("CV insufficient data for evaluation type");
    }

    // 3. Gestión de la Evaluación (Registro)
    const evaluation = await step.run("get-or-create-evaluation", async () => {
      if (evaluationId) return prisma.cvEvaluation.findUnique({ where: { id: evaluationId } });
      return prisma.cvEvaluation.create({ data: { cvId, status: JobStatus.IN_PROGRESS } });
    });

    try {
      // 4. Inteligencia Artificial
      const aiResult = await step.run("query-ai-evaluator", async () => {
        const prompt = getPromptToEvaluateCv(filteredSections, cv?.cvType, cv?.opportunityType, cv?.language);
        const response = await queryGemini({ prompt, type: "JSON" });
        return response as { success: boolean; data: AiEvaluationResult; message?: string };
      });

      if (!aiResult.success) throw new Error(aiResult.message);

      // 5. Persistencia de Resultados (Transacción)
      await step.run("persist-evaluation-results", async () => {
        const { data } = aiResult;

        const allowedSet = new Set(allowedSectionTypes);

        // 1. Mapeamos y sanitizamos los scores
        const scoresToCreate = (data.sectionScores || [])
          .map((score) => {
            const sectionType = sanitizeSectionType(score.sectionType);
            if (!sectionType || !allowedSet.has(sectionType)) return null;

            return {
              evaluationId: evaluation!.id as string,
              sectionType,
              score: Number(score.score) || 0,
              detailsJson: score.details || {},
            };
          })
          .filter(Boolean);

        // 2. Mapeamos y sanitizamos los textos mejorados (dentro del JSON)
        const improvedTexts = (data.improvedTexts || [])
          .map((item) => {
            const sectionType = sanitizeSectionType(item.sectionType);
            if (!sectionType || !allowedSet.has(sectionType)) return null;

            return {
              ...item,
              sectionType,
            };
          })
          .filter(Boolean);

        const suggestedAdditions = (data.suggestedAdditions || [])
          .map((item) => {
            const sectionType = sanitizeSectionType(item.sectionType);
            if (!sectionType || !allowedSet.has(sectionType)) return null;

            return {
              ...item,
              sectionType,
            };
          })
          .filter(Boolean);

        // 3. Ejecutamos la transacción con datos limpios
        await prisma.$transaction([
          // Actualizar la evaluación principal
          prisma.cvEvaluation.update({
            where: { id: evaluation!.id },
            data: {
              status: JobStatus.SUCCEEDED,
              overallScore: data.overallScore,
              summary: data.summary,
              extractorOutput: data as any,
              improvementsJson: {
                improvedTexts,
                suggestedAdditions,
              },
            },
          }),

          // Crear todos los scores de una vez
          ...scoresToCreate.map(scoreData =>
            prisma.evaluationScore.create({
              data: {
                evaluationId: scoreData.evaluationId,
                sectionType: scoreData.sectionType,
                score: scoreData.score,
                detailsJson: JSON.stringify(scoreData.detailsJson),

              }
            })
          )
        ]);
      });

      // 6. Finalización y Créditos
      await step.run("finalize-process", async () => {
        const consumeCreditBody: ConsumeCreditsParams = {
          userId,
          type: CreditBalanceType.AI_ACTIONS,
          amount: 1,
          description: aiResult.data.description,
        }
        await consumeCredits(consumeCreditBody);
        await prisma.queueJob.update({ where: { id: job.id }, data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() } });

        // Update Route Status
        await prisma.route.updateMany({
          where: { cvId, userId, status: { in: [RouteStatus.CV_CREATED, RouteStatus.ANALYSIS_PENDING] } },
          data: { status: RouteStatus.ANALYSIS_DONE }
        });
      });

      await step.run("emit-completion-evaluation", async () => {
        await inngest.send({
          name: "cv/evaluation.completed",
          data: {
            cvId: cvId,
            userId: userId
          }
        });
      });

    } catch (error: any) {
      await step.run("handle-failure", async () => {
        await prisma.cvEvaluation.update({ where: { id: evaluation!.id }, data: { status: JobStatus.FAILED } });
        await prisma.queueJob.update({ where: { id: job.id }, data: { status: JobStatus.FAILED, lastError: error.message } });
        await refundCredits(userId, 1, "ERROR_IN_EVALUATION", CreditBalanceType.AI_ACTIONS);
      });
      throw error;
    }
  }
);
