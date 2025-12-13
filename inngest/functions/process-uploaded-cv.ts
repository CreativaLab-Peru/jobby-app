import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { getPromptToGetCv } from "@/lib/prompts/get-prompt-to-get-cv";
import { queryGemini } from "@/lib/queries/query-gemini";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";
import { logsService } from "@/features/share/services/logs-service";

export const processUploadedCv = inngest.createFunction(
  { id: "process-uploaded-cv" },
  { event: "cv/uploaded" },
  async ({ event, step }) => {
    const { cvId, attachmentUrl, userId } = event.data;

    // ✅ Create and mark job as IN_PROGRESS
    const job = await prisma.queueJob.upsert({
      where: { jobId: event.id },
      update: {
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      create: {
        jobId: event.id,
        type: "CREATE_CV",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        cvId,
        startedAt: new Date(),
      },
    });

    // ✅ Log: job started
    await logsService.createLog({
      userId,
      action: LogAction.CREATE,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "Started processing uploaded CV",
      metadata: { cvId, attachmentUrl },
    });

    try {
      // ✅ Extract data
      const result = await step.run("Extract data from CV", async () => {
        const textFromCv = await getTextFromPdfApi(attachmentUrl);

        await logsService.createLog({
          userId,
          action: LogAction.CREATE,
          level: LogLevel.INFO,
          entity: "QUEUE_JOB",
          entityId: job.id,
          message: "Extracted raw text from uploaded CV",
          metadata: { textLength: textFromCv?.length },
        });

        const prompt = getPromptToGetCv(textFromCv);

        await logsService.createLog({
          userId,
          action: LogAction.CREATE,
          level: LogLevel.INFO,
          entity: "QUEUE_JOB",
          entityId: job.id,
          message: "Prompt generated for CV extraction",
          metadata: { promptLength: prompt.length },
        });

        return await queryGemini({ prompt, type: "JSON" });
      });

      // ✅ Gemini failed?
      if (!result.success) {
        await logsService.createLog({
          userId,
          action: LogAction.CREATE,
          level: LogLevel.ERROR,
          entity: "QUEUE_JOB",
          entityId: job.id,
          message: "Gemini extraction failed",
          metadata: {
            message: result.message,
            raw: result,
          },
        });

        throw new Error(result.message ?? "Extraction failed");
      }

      const jsonData = result.data;
      const textCv = JSON.stringify(jsonData, null, 2);

      await logsService.createLog({
        userId,
        action: LogAction.CREATE,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Gemini extracted JSON data from CV",
        metadata: {
          sections: jsonData.sections?.length,
          fields: Object.keys(jsonData || {}).length,
        },
      });

      // ✅ Update CV with extracted JSON
      await prisma.cv.update({
        where: { id: cvId },
        data: {
          extractedJson: jsonData,
          fullTextSearch: textCv,
        }
      });

      // ✅ Process sections
      if (Array.isArray(jsonData.sections)) {
        await prisma.cvSection.deleteMany({ where: { cvId } });

        const sectionsData = jsonData.sections.map((section: any, index: number) => ({
          cvId,
          sectionType: section.sectionType,
          title: section.title ?? null,
          contentJson: section.contentJson ?? [],
          order: index,
        }));

        await prisma.cvSection.createMany({ data: sectionsData });

        await logsService.createLog({
          userId,
          action: LogAction.CREATE,
          level: LogLevel.INFO,
          entity: "QUEUE_JOB",
          entityId: job.id,
          message: "Parsed and stored CV sections",
          metadata: {
            count: sectionsData.length,
          },
        });
      }

      // ✅ Job success
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        userId,
        action: LogAction.CREATE,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "CV uploaded and processed successfully",
        metadata: { cvId },
      });

      // ✅ Trigger evaluation
      await inngest.send({
        name: "cv/ready-for-evaluation",
        data: { cvId, userId },
      });
      await inngest.send({
        name: "get.and.save.opportunities",
        data: { cvId, userId },
      });

      await logsService.createLog({
        userId,
        action: LogAction.EVALUATION,
        level: LogLevel.INFO,
        message: "CV queued for evaluation",
        entity: "CV",
        entityId: cvId,
      });

    } catch (err: any) {
      console.error("❌ CV processing failed:", err);

      // ✅ Mark job as FAILED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: err.message,
        },
      });

      // ✅ Log error
      await logsService.createLog({
        userId,
        action: LogAction.CREATE,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "CV processing failed",
        metadata: {
          error: err?.message,
          stack: err?.stack,
          cvId,
          attachmentUrl,
        },
      });

      throw err;
    }
  }
);
