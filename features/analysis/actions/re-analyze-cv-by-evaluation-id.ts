"use server";

import { inngest } from "@/inngest/functions/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CreditBalanceType } from "@prisma/client";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";

export const reAnalyzeCvByEvaluationId = async (evaluationId: string) => {
  try {
    if (!evaluationId) {
      return { success: false, message: "CV ID is required." };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Usuario no encontrado." };
    }

    // 1. Verificar que el CV existe y pertenece al usuario
    const evaluation = await prisma.cvEvaluation.findUnique({
      where: { id: evaluationId},
    });

    if (!evaluation) {
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

    // 3. Actualizar balance de créditos del usuario
    await prisma.userCreditBalance.update({
      where: {
        userId_type: {
          userId: currentUser.id,
          type: CreditBalanceType.AI_ACTIONS
        },
      },
      data: {
        amount: {
          decrement: 1,
        }
      },
    });

    // 4. Disparar el evento de Inngest
    await inngest.send({
      name: "cv/ready-for-evaluation",
      data: {
        cvId: evaluation.cvId,
        userId: currentUser.id,
        evaluationId: evaluation.id
      },
    });

    return {
      success: true,
      message: "Análisis de CV iniciado.",
      data: { cvId: evaluationId },
    };

  } catch (error) {
    console.error("[ANALYZE_CV_BY_ID_ERROR]:", error);
    return {
      success: false,
      message: "Error al iniciar el análisis del CV."
    };
  }
};
