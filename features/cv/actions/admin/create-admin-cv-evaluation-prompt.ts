"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type CreateAdminCvEvaluationPromptResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

export interface CreateAdminCvEvaluationPromptInput {
  beca: string;
  prompt: string;
  metadata?: Record<string, unknown> | null;
}

export const createAdminCvEvaluationPrompt = async (
  input: CreateAdminCvEvaluationPromptInput
): Promise<CreateAdminCvEvaluationPromptResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    if (!input.beca.trim() || !input.prompt.trim()) {
      return { success: false, error: "Beca y prompt son requeridos." };
    }

    const created = await prisma.cvEvaluationPrompt.create({
      data: {
        beca: input.beca.trim(),
        prompt: input.prompt.trim(),
        metadata: input.metadata as any ?? undefined,
      },
    });

    revalidatePath("/admin/cv-evaluation-prompts");

    return { success: true, data: { id: created.id }, message: "Prompt creado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_CREATE_CV_EVALUATION_PROMPT_ERROR]", error);
    return { success: false, error: "Error creando prompt" };
  }
};

