import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import {
  CreditBalanceType,
  CvType,
  JobStatus,
  OpportunityType,
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
    const { cvId, attachmentUrl, userId } = event.data;

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
      // 2. Extracción de Texto y AI (Paso costoso, debe estar en un step)
      const aiResult = await step.run("extract-cv-data-with-ai", async () => {
        const textFromCv = await getTextFromPdfApi(attachmentUrl);
        if (!textFromCv) throw new Error("No se pudo extraer texto del PDF");

        const prompt = getPromptToGetCv(textFromCv);
        const result = await queryGemini({ prompt, type: "JSON" });

        if (!result.success) throw new Error(result.message || "Gemini falló al extraer datos");

        return result.data;
      });

      // 3. Normalización y Limpieza de Datos
      const processedData = await step.run("normalize-data", async () => {
        let opportunityType = aiResult.opportunityType || OpportunityType.EMPLOYMENT;
        let cvType = aiResult.cvType || CvType.TECHNOLOGY_ENGINEERING;

        // Validar contra Enums de Prisma
        if (!Object.values(OpportunityType).includes(opportunityType)) {
          opportunityType = OpportunityType.EMPLOYMENT;
        }
        if (!Object.values(CvType).includes(cvType)) {
          cvType = CvType.TECHNOLOGY_ENGINEERING;
        }

        return { ...aiResult, opportunityType, cvType };
      });

      // 4. Persistencia en Base de Datos (Transaccional)
      await step.run("save-cv-to-db", async () => {
        const textCv = JSON.stringify(processedData, null, 2);

        await prisma.$transaction(async (tx) => {
          // Actualizar CV principal
          await tx.cv.update({
            where: { id: cvId },
            data: {
              cvType: processedData.cvType,
              opportunityType: processedData.opportunityType,
              extractedJson: processedData,
              fullTextSearch: textCv,
            }
          });

          // Procesar secciones (Borrar e insertar para asegurar limpieza)
          if (Array.isArray(processedData.sections)) {
            await tx.cvSection.deleteMany({ where: { cvId } });

            const sectionsData = processedData.sections.map((section: any, index: number) => ({
              cvId,
              sectionType: section.sectionType,
              title: section.title ?? null,
              contentJson: section.contentJson ?? [],
              order: index,
            }));

            await tx.cvSection.createMany({ data: sectionsData });
          }

          // Vincular a la ruta activa si no tiene CV
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

      // 5. Finalización y Pago
      await step.run("complete-job-and-billing", async () => {
        await consumeCredits({
          userId,
          type: CreditBalanceType.MANAGE_CVS,
          amount: 1,
          description: `Procesamiento exitoso de CV: ${cvId}`,
        });

        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
        });
      });

    } catch (err: any) {
      await step.run("handle-process-failure", async () => {
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.FAILED, lastError: err.message },
        });
      });
      throw err;
    }
  }
);
