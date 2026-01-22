import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import {addToMailerLite} from "@/features/authentication/actions/mailerlite";
import {sendVerificationEmail} from "@/features/authentication/actions/send-verification-email";

const required = (value: any, field: string) => {
  if (!value) throw new Error(`Missing required field: ${field}`);
};

export const sendVerifyEmailv2 = inngest.createFunction(
  { id: "send-verification-email-v2" },
  { event: "send.verification.code" },
  async ({ event }) => {
    const { email, name, codeSixDigits } = event.data;

    try {
      required(email, "email");
      required(name, "name");
    } catch (err: any) {
      console.error("[VALIDATION_ERROR]:", err);

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.ERROR,
        message: "Validation failed for verification email",
        metadata: {
          error: err?.message,
          data: event.data,
        },
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
        type: "SEND_EMAIL_VERIFICATION",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    await logsService.createLog({
      action: LogAction.EMAIL,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "Started verification email job",
      metadata: { email, name, codeSixDigits },
    });

    try {
      await sendVerificationEmail(email, name, codeSixDigits); // Genera un código real en producción

      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: `Verification email sent to ${email}`,
        metadata: { email, name, codeSixDigits },
      });

    } catch (err: any) {
      console.error("[SEND_VERIFICATION_EMAIL_ERROR]:", err);

      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: err?.message ?? "Unknown error",
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Failed to send verification email",
        metadata: {
          error: err?.message,
          email,
          name,
          codeSixDigits,
        },
      });

      throw err;
    }
  }
);
