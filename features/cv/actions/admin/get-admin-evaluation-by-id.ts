"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import {
  Cv,
  CvEvaluation,
  EvaluationScore,
  Recommendation,
  User,
} from "@prisma/client";

export type AdminEvaluationDetail = CvEvaluation & {
  scores: EvaluationScore[];
  recommendations: Recommendation[];
  cv: Cv & {
    user: Pick<User, "id" | "email" | "name"> | null;
  };
};

export type AdminEvaluationByIdResult =
  | { success: true; data: AdminEvaluationDetail }
  | { success: false; error: string };

export const getAdminEvaluationById = async (
  evaluationId: string
): Promise<AdminEvaluationByIdResult> => {
  try {
    const adminResult = await requireAdmin();
    if (!adminResult.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver evaluaciones." };
    }

    const evaluation = await prisma.cvEvaluation.findUnique({
      where: { id: evaluationId },
      include: {
        scores: true,
        recommendations: true,
        cv: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });

    if (!evaluation) {
      return { success: false, error: "Evaluación no encontrada" };
    }

    return { success: true, data: evaluation as AdminEvaluationDetail };
  } catch (error) {
    console.error("[ADMIN_GET_EVALUATION_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo evaluación" };
  }
};

