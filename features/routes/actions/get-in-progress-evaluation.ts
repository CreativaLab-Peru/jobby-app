"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/enums";

/**
 * Checks if there is an active evaluation (PENDING or IN_PROGRESS) for a given CV.
 * This is used to redirect the user to the processing screen if an analysis is already running.
 */
export async function getInProgressEvaluation(cvId: string) {
  if (!cvId) return null;

  const activeEval = await prisma.cvEvaluation.findFirst({
    where: {
      cvId: cvId,
      status: {
        in: [JobStatus.IN_PROGRESS, JobStatus.PENDING],
      },
    },
    select: {
      id: true,
      cvId: true,
      status: true,
    },
  });

  return activeEval;
}
