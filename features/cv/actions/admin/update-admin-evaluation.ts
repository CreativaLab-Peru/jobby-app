"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { JobStatus } from "@prisma/client";

export type UpdateAdminEvaluationResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const updateAdminEvaluation = async (
  evaluationId: string,
  input: { status: JobStatus; overallScore?: number | null; summary?: string | null }
): Promise<UpdateAdminEvaluationResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.cvEvaluation.findUnique({
      where: { id: evaluationId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Evaluacion no encontrada" };
    }

    const data: Record<string, unknown> = {
      status: input.status,
      updatedAt: new Date(),
    };

    if (input.overallScore !== undefined) {
      data.overallScore = input.overallScore;
    }

    if (input.summary !== undefined) {
      data.summary = input.summary;
    }

    if (input.status === "SUCCEEDED" || input.status === "FAILED" || input.status === "CANCELLED") {
      data.finishedAt = new Date();
    }

    await prisma.cvEvaluation.update({
      where: { id: evaluationId },
      data,
    });

    revalidatePath("/admin/evaluations");
    revalidatePath(`/admin/evaluations/${evaluationId}`);

    return { success: true, message: "Evaluacion actualizada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_EVALUATION_ERROR]", error);
    return { success: false, error: "Error actualizando evaluacion" };
  }
};

