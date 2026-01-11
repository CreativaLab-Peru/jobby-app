import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import {addToMailerLite} from "@/features/authentication/actions/mailerlite";

const required = (value: any, field: string) => {
  if (!value) throw new Error(`Missing required field: ${field}`);
};

export const sendWelcomeEmail = inngest.createFunction(
  { id: "send-welcome-email" },
  { event: "send/welcome" },
  async ({ event }) => {
    const { email, name, userId } = event.data;

    try {
      required(email, "email");
      required(name, "name");
    } catch (err) {
      console.error("[WELCOME_EMAIL_VALIDATION_ERROR]:", err);

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.ERROR,
        message: "Validation failed for welcome email",
        metadata: { error: err?.message, data: event.data },
      });

      return;
    }

    const job = await prisma.queueJob.upsert({
      where: { jobId: event.id },
      update: {
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
        payload: event.data,
      },
      create: {
        jobId: event.id,
        type: "SEND_EMAIL_WELCOME",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    try {
      await addToMailerLite(email, { name }, "welcome");

      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        userId,
        action: LogAction.EMAIL,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: `Welcome email sent to ${email}`,
        metadata: {
          email,
          name,
        },
      });

    } catch (err: any) {
      console.error("[SEND_WELCOME_EMAIL_ERROR]:", err);

      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: err?.message ?? "Unknown error",
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        userId,
        action: LogAction.EMAIL,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Failed to send welcome email",
        metadata: {
          error: err?.message,
          email,
          name,
        },
      });

      throw err;
    }
  }
);
