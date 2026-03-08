"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type AdminDeleteEvaluationResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminEvaluation = async (
  evaluationId: string
): Promise<AdminDeleteEvaluationResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return {
        success: false,
        error: "Acceso denegado. Solo los administradores pueden eliminar evaluaciones.",
      };
    }

    const evaluation = await prisma.cvEvaluation.findUnique({
      where: { id: evaluationId },
      select: { id: true },
    });

    if (!evaluation) {
      return { success: false, error: "Evaluación no encontrada" };
    }

    await prisma.cvEvaluation.update({
      where: { id: evaluationId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/admin/evaluations");

    return { success: true, message: "Evaluación cancelada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_EVALUATION_ERROR]", error);
    return { success: false, error: "Error cancelando evaluación" };
  }
};

