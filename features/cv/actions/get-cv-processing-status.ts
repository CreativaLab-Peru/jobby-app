"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { JobStatus } from "@prisma/client";

export type CvProcessingStatus =
  | {
  success: true;
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";
}
  | { success: false; error: string };

export const getCvProcessingStatus = async (cvId: string): Promise<CvProcessingStatus> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "No autenticado." };

    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: user.id },
      select: {
        status: true,
        extractedJson: true,
      },
    });

    if (!cv) return { success: false, error: "CV no encontrado." };

    // Validamos que si dice SUCCEEDED, realmente haya data (no un {} vacío)
    const hasRealData = cv.extractedJson &&
      typeof cv.extractedJson === 'object' &&
      Object.keys(cv.extractedJson).length > 0;

    let currentStatus: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" = "IN_PROGRESS";

    // Lógica estricta de estados
    if (cv.status === JobStatus.SUCCEEDED && hasRealData) {
      currentStatus = "SUCCEEDED";
    } else if (cv.status === JobStatus.FAILED) {
      currentStatus = "FAILED";
    } else if (cv.status === JobStatus.IN_PROGRESS) {
      currentStatus = "IN_PROGRESS";
    } else {
      // Si el status es SUCCEEDED pero no hay data aún, lo mantenemos en IN_PROGRESS
      // para evitar que el usuario vea una pantalla vacía en el preview.
      currentStatus = "IN_PROGRESS";
    }

    return { success: true, status: currentStatus };
  } catch (error) {
    return { success: false, error: "Error consultando estado." };
  }
};
