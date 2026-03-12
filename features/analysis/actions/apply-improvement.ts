"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CvSectionType } from "@prisma/client";

/**
 * Applies an AI-suggested improved text to a specific section of the user's CV.
 */
export const applyImprovement = async (
  cvId: string,
  sectionType: string,
  improvedText: string,
) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Usuario no encontrado." };

    // Verify CV belongs to user
    const cv = await prisma.cv.findFirst({
      where: { id: cvId, userId: user.id, deletedAt: null },
    });
    if (!cv) return { success: false, message: "CV no encontrado." };

    // Find the target section
    const section = await prisma.cvSection.findFirst({
      where: { cvId, sectionType: sectionType as CvSectionType },
    });

    if (!section) {
      return { success: false, message: "Sección no encontrada en el CV." };
    }

    // Apply the improved text.
    // For SUMMARY: contentJson is { text: string }
    // For list sections (EXPERIENCE, EDUCATION, etc.): contentJson is an array — we replace the full array
    let newContent: any;

    if (sectionType === "SUMMARY") {
      newContent = { text: improvedText };
    } else {
      // Try to parse if it's JSON, otherwise wrap as text
      try {
        newContent = JSON.parse(improvedText);
      } catch {
        // If the improved text is plain text, store as { text: ... }
        newContent = { text: improvedText };
      }
    }

    await prisma.cvSection.update({
      where: { id: section.id },
      data: { contentJson: newContent, updatedAt: new Date() },
    });

    return { success: true, message: "Mejora aplicada correctamente." };
  } catch (error) {
    console.error("[APPLY_IMPROVEMENT_ERROR]", error);
    return { success: false, message: "Error al aplicar la mejora." };
  }
};

