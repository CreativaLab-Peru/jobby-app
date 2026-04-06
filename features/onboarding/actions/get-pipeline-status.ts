'use server'

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export async function getPipelineStatus(cvId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No usuario encontrado" };
    }
    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: currentUser.id },
      select: { status: true }
    });

    const evaluation = await prisma.cvEvaluation.findFirst({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
      select: { status: true }
    });

    const oppJob = await prisma.queueJob.findFirst({
      where: { cvId, type: "GET_OPPORTUNITIES" },
      orderBy: { startedAt: 'desc' },
      select: { status: true }
    });

    return {
      success: true,
      steps: {
        // Forzamos el fallback a PENDING con el tipo correcto
        config: (cv?.status as JobStatus) ?? JobStatus.PENDING,
        analysis: (evaluation?.status as JobStatus) ?? JobStatus.PENDING,
        matches: (oppJob?.status as JobStatus) ?? JobStatus.PENDING
      }
    };
  } catch (error) {
    return { success: false, error: "Error fetch status" };
  }
}
