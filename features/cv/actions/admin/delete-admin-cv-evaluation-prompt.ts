"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminCvEvaluationPromptResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminCvEvaluationPrompt = async (
  promptId: string
): Promise<DeleteAdminCvEvaluationPromptResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    await prisma.cvEvaluationPrompt.delete({
      where: { id: promptId },
    });

    revalidatePath("/admin/cv-evaluation-prompts");

    return { success: true, message: "Prompt eliminado" };
  } catch (error) {
    console.error("[ADMIN_DELETE_CV_EVALUATION_PROMPT_ERROR]", error);
    return { success: false, error: "Error eliminando prompt" };
  }
};

