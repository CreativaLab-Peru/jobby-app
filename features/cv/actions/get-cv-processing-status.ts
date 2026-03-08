"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export type CvProcessingStatus =
  | { success: true; status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED"; hasExtractedData: boolean }
  | { success: false; error: string };

export const getCvProcessingStatus = async (cvId: string): Promise<CvProcessingStatus> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "No autenticado." };
    }

    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: {
        userId: true,
        extractedJson: true,
        sections: { select: { id: true }, take: 1 },
      },
    });

    if (!cv || cv.userId !== user.id) {
      return { success: false, error: "CV no encontrado." };
    }

    // Check if CV already has extracted data (processing done)
    const hasExtractedData = !!cv.extractedJson || cv.sections.length > 0;

    if (hasExtractedData) {
      return { success: true, status: "SUCCEEDED", hasExtractedData: true };
    }

    // Check the latest QueueJob for this CV
    const job = await prisma.queueJob.findFirst({
      where: { cvId, type: "UPLOAD_CV" },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    });

    if (!job) {
      return { success: true, status: "PENDING", hasExtractedData: false };
    }

    return {
      success: true,
      status: job.status as "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED",
      hasExtractedData: false,
    };
  } catch (error) {
    console.error("[GET_CV_PROCESSING_STATUS_ERROR]", error);
    return { success: false, error: "Error consultando estado." };
  }
};

