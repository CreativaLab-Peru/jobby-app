"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

export async function getTempCvAnalysis(id: string) {
  try {
    const analysis = await prisma.tempCvWithEvaluation.findUnique({
      where: { id },
    });

    if (!analysis) return { error: "Análisis no encontrado" };

    if (analysis.status !== JobStatus.SUCCEEDED) {
      return { status: analysis.status, isPending: true };
    }

    // Tipamos el extractorOutput basándonos en el schema de Inngest
    const data = analysis.extractorOutput as any;

    return {
      success: true,
      score: analysis.overallScore,
      data: data,
      status: analysis.status
    };
  } catch (error) {
    return { error: "Error al recuperar el análisis" };
  }
}
