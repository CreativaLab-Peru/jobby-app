"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type UpdateAdminCvEvaluationPromptResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminCvEvaluationPromptInput {
  beca: string;
  prompt: string;
  metadata?: Record<string, unknown> | null;
}

export const updateAdminCvEvaluationPrompt = async (
  promptId: string,
  input: UpdateAdminCvEvaluationPromptInput
): Promise<UpdateAdminCvEvaluationPromptResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    if (!input.beca.trim() || !input.prompt.trim()) {
      return { success: false, error: "Beca y prompt son requeridos." };
    }

    await prisma.cvEvaluationPrompt.update({
      where: { id: promptId },
      data: {
        beca: input.beca.trim(),
        prompt: input.prompt.trim(),
        metadata: input.metadata as any ?? undefined,
      },
    });

    revalidatePath("/admin/cv-evaluation-prompts");
    revalidatePath(`/admin/cv-evaluation-prompts/${promptId}`);
    revalidatePath(`/admin/cv-evaluation-prompts/${promptId}/edit`);

    return { success: true, message: "Prompt actualizado" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_CV_EVALUATION_PROMPT_ERROR]", error);
    return { success: false, error: "Error actualizando prompt" };
  }
};

