import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

// TODO: missing to redefine
async function markAttemptAndMaybeFail(jobId: string, error: any) {
  // increment attempts and save lastError atomically
  const updated = await prisma.queueJob.update({
    where: { id: jobId },
    data: {
      attempts: { increment: 1 },
      lastError: error?.message ?? String(error ?? "Unknown error"),
      updatedAt: new Date(),
    },
  });

  // If attempts exceeded maxAttempts -> mark FAILED
  if (updated.attempts >= (updated.maxAttempts ?? 5)) {
    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.FAILED,
        finishedAt: new Date(),
      },
    });
  }

  return updated;
}