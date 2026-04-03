'use server'

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

export async function getPipelineStatus(cvId: string) {
  try {
    // 1. Verificamos el estado del CV (Paso 1: Configuración/Hidratación)
    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: { status: true }
    });

    // 2. Verificamos el estado de la Evaluación (Paso 2: Análisis IA)
    const evaluation = await prisma.cvEvaluation.findFirst({
      where: { cvId },
      orderBy: { createdAt: 'desc' },
      select: { status: true }
    });

    // 3. Verificamos el Job de Oportunidades (Paso 3: Match Engine)
    const oppJob = await prisma.queueJob.findFirst({
      where: { cvId, type: "GET_OPPORTUNITIES" },
      orderBy: { startedAt: 'desc' },
      select: { status: true }
    });

    return {
      success: true,
      steps: {
        config: cv?.status ?? JobStatus.PENDING,
        analysis: evaluation?.status ?? JobStatus.PENDING,
        matches: oppJob?.status ?? JobStatus.PENDING
      }
    };
  } catch (error) {
    return { success: false, error: "Error fetch status" };
  }
}
