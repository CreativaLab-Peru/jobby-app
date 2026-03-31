"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

export async function getEvaluationStatusAction(id: string) {
  try {
    const evaluation = await prisma.tempCvWithEvaluation.findUnique({
      where: { id },
      select: {
        status: true,
        overallScore: true,
        extractorOutput: true,
      }
    });

    if (!evaluation) {
      return { error: "Evaluación no encontrada." };
    }

    return {
      status: evaluation.status as JobStatus,
      overallScore: evaluation.overallScore,
      extractorOutput: evaluation.extractorOutput,
    };
  } catch (error) {
    console.error("[ERROR_GET_STATUS_ACTION]", error);
    return { error: "Error al consultar el estado." };
  }
}
