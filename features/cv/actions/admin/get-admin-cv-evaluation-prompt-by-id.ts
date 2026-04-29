"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { CvEvaluationPrompt } from "@prisma/client";

export type AdminCvEvaluationPromptDetail = CvEvaluationPrompt;

export type AdminCvEvaluationPromptDetailResult =
  | { success: true; data: AdminCvEvaluationPromptDetail }
  | { success: false; error: string };

export const getAdminCvEvaluationPromptById = async (
  promptId: string
): Promise<AdminCvEvaluationPromptDetailResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const prompt = await prisma.cvEvaluationPrompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      return { success: false, error: "Prompt no encontrado" };
    }

    return { success: true, data: prompt };
  } catch (error) {
    console.error("[ADMIN_GET_CV_EVALUATION_PROMPT_ERROR]", error);
    return { success: false, error: "Error obteniendo prompt" };
  }
};

