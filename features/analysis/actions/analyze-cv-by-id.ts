"use server";

import { inngest } from "@/inngest/functions/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";

export const analyzeCvById = async (cvId: string) => {
  try {
    if (!cvId) {
      return { success: false, message: "CV ID is required." };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Usuario no encontrado." };
    }

    // 1. Verificar que el CV existe y pertenece al usuario
    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: currentUser.id },
    });

    if (!cv) {
      return { success: false, message: "CV no encontrado." };
    }

    // 2. Verificar límites de créditos
    const creditLimits = await getCurrentCreditLimits();
    if (creditLimits.aiActionsLimit <= 0) {
      return {
        success: false,
        message: "No tienes intentos disponibles para subir CVs. Por favor, actualiza tu plan."
      };
    }

    // 4. Disparar el evento de Inngest
    await inngest.send({
      name: "cv/ready-for-evaluation",
      data: { cvId, userId: currentUser.id },
    });

    return {
      success: true,
      message: "Análisis de CV iniciado.",
      data: { cvId },
    };

  } catch (error) {
    console.error("[ANALYZE_CV_BY_ID_ERROR]:", error);
    return {
      success: false,
      message: "Error al iniciar el análisis del CV."
    };
  }
};
