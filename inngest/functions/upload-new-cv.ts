import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import {
  CreditBalanceType,
  JobStatus,
  RouteStatus
} from "@prisma/client";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";
import { getPromptToGetCv } from "@/features/cv/prompts/get-prompt-to-get-cv";
import { queryGemini } from "@/features/cv/queries/query-gemini";
import { consumeCredits } from "@/features/credits/actions/consume-credits";

export const uploadNewCv = inngest.createFunction(
  { id: "process-uploaded-cv", name: "Process Uploaded CV" },
  { event: "cv/uploaded" },
  async ({ event, step }) => {
    // Ahora recibimos targetSections desde el evento
    const { cvId, attachmentUrl, userId, targetSections } = event.data;

    const initCvUploading = await step.run("initialize-cv-status", async () => {
      return prisma.cv.update({
        where: {
          id: cvId,
          userId,
        },
        data: {
          status: JobStatus.IN_PROGRESS,
        }
      })
    });

    if (!initCvUploading) {
      return step.run("handle-missing-cv", async () => {
        await prisma.queueJob.create({
          data: {
            jobId: event.id,
            type: "UPLOAD_CV",
            payload: event.data,
            status: JobStatus.FAILED,
            cvId,
            lastError: "CV no encontrado para procesar.",
          },
        });
      });
    }


    // 1. Inicialización del Job (Idempotente)
    const job = await step.run("initialize-job", async () => {
      return prisma.queueJob.upsert({
        where: { jobId: event.id },
        update: { status: JobStatus.IN_PROGRESS, startedAt: new Date() },
        create: {
          jobId: event.id,
          type: "UPLOAD_CV",
          payload: event.data,
          status: JobStatus.IN_PROGRESS,
          cvId,
          startedAt: new Date(),
        },
      });
    });

    try {
      // 2. Extracción de Texto y AI
      const aiResult = await step.run("extract-cv-data-with-ai", async () => {
        const textFromCv = await getTextFromPdfApi(attachmentUrl);
        if (!textFromCv) throw new Error("No se pudo extraer texto del PDF");

        // PASO CLAVE: Pasamos targetSections al prompt para que la IA sepa qué buscar
        const prompt = getPromptToGetCv(textFromCv, targetSections);
        const result = await queryGemini({ prompt, type: "JSON" });

        if (!result.success) throw new Error(result.message || "Gemini falló al extraer datos");

        return result.data;
      });

      // 3. Persistencia Inteligente (No destructiva)
      await step.run("update-cv-and-sections", async () => {
        await prisma.$transaction(async (tx) => {
          // Actualizamos los datos maestros del CV
          await tx.cv.update({
            where: { id: cvId },
            data: {
              extractedJson: aiResult,
              fullTextSearch: JSON.stringify(aiResult),
              // El lenguaje lo detecta la IA, pero lo guardamos formalmente
              language: aiResult.language || "ES",
            }
          });

          // HIDRATACIÓN DE SECCIONES:
          // En lugar de borrar, actualizamos las secciones que ya creamos en el Action
          if (aiResult.sections && Array.isArray(aiResult.sections)) {
            for (const section of aiResult.sections) {
              await tx.cvSection.updateMany({
                where: {
                  cvId,
                  sectionType: section.sectionType
                },
                data: {
                  title: section.title ?? "",
                  contentJson: section.contentJson ?? [],
                }
              });
            }
          }

          // 4. Vincular a Ruta Activa (Lógica de negocio existente)
          const activeRoute = await tx.route.findFirst({
            where: { userId, isActive: true, cvId: null },
          });

          if (activeRoute) {
            await tx.route.update({
              where: { id: activeRoute.id },
              data: { cvId, status: RouteStatus.CV_CREATED },
            });
          }
        });
      });

      // 5. Cobro y Finalización
      await step.run("complete-job-and-billing", async () => {
        await consumeCredits({
          userId,
          type: CreditBalanceType.MANAGE_CVS,
          amount: 1,
          description: `CV Procesado: ${cvId}`,
        });

        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
        });

        await prisma.cv.update({
          where: {
            id: cvId,
            userId
          },
          data: {
            status: JobStatus.SUCCEEDED,
          }
        })
      });

    } catch (err: any) {
      await step.run("handle-process-failure", async () => {
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.FAILED, lastError: err.message },
        });

        await prisma.cv.update({
          where: {
            id: cvId,
            userId
          },
          data: {
            status: JobStatus.FAILED,
          }
        })
      });
      throw err;
    }
  }
);
