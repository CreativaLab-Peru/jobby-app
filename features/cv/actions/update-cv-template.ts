"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { revalidatePath } from "next/cache";

export const updateCvTemplate = async (cvId: string, templateId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "User not found." };
    }

    const cv = await prisma.cv.findFirst({
      where: { id: cvId, userId: currentUser.id, deletedAt: null },
    });

    if (!cv) {
      return { success: false, message: "CV not found." };
    }

    await prisma.cv.update({
      where: { id: cvId },
      data: { templateId },
    });

    revalidatePath(`/cv/${cvId}/edit`);

    return { success: true, message: "Template updated successfully." };
  } catch (error) {
    console.error("[UPDATE_CV_TEMPLATE_ERROR]", error);
    return { success: false, message: "Error updating template." };
  }
};
