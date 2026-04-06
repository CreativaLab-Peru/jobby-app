'use server'

import { prisma } from "@/lib/prisma";

interface GetTempAnalysisData {
  email: string;
}

interface TempAnalysisResponse {
  success: boolean;
  error?: string;
  data?: {
    temporalUserId: string;
    tempCvEvaluationId: string | null;
  } | null;
}

/**
 * Verifica si existe un usuario temporal y obtiene su análisis asociado.
 */
export async function getTempAnalysisByUserEmail(
  data: GetTempAnalysisData
): Promise<TempAnalysisResponse> {
  try {
    const { email } = data;

    if (!email) {
      return { success: false, error: "email_required" };
    }

    // 1. Buscar al usuario temporal por email
    const temporalUser = await prisma.temporalUser.findUnique({
      where: { email },
    });

    if (!temporalUser) {
      // Si no existe el usuario, retornamos data null con éxito
      return { success: true, data: null };
    }

    // 2. Buscar el análisis temporal más reciente asociado a este usuario
    // Se asume que el vínculo es a través de tempUserId
    const evaluation = await prisma.tempCvWithEvaluation.findFirst({
      where: {
        tempUserId: temporalUser.id,
      },
      orderBy: {
        createdAt: 'desc', // Traemos el más reciente
      },
      select: {
        id: true,
      }
    });

    return {
      success: true,
      data: {
        temporalUserId: temporalUser.id,
        tempCvEvaluationId: evaluation?.id ?? null,
      },
    };

  } catch (e) {
    console.error("[ERROR_GET_TEMP_ANALYSIS]:", e);
    return { success: false, error: "internal_server_error" };
  }
}
