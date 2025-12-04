"use server";

import { prisma } from "@/lib/prisma";

export const updateCvTitle = async (cvId: string, newTitle: string) => {
  try {
    const existsCv = await prisma.cv.findFirst({
      where: { id: cvId, deletedAt: null },
    });
    if (!existsCv) {
      return { success: false, error: "CV not found." };
    }
    await prisma.cv.updateMany({
      where: { id: cvId, deletedAt: null },
      data: { title: newTitle },
    });
    return { success: true };
  } catch (error) {
    console.error("[ERROR_UPDATE_CV_TITLE]", error);
    return { success: false, error: "Failed to update CV title." };
  }
}
