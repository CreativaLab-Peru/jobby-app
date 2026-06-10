"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface DeleteScholarshipResult {
  success: boolean;
  message?: string;
}

export async function deleteScholarshipAction(
  scholarshipId: string
): Promise<DeleteScholarshipResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, message: admin.error };
  }

  try {
    // Check if scholarship exists
    const scholarship = await prisma.scholarshipOpportunity.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      return { success: false, message: "Beca no encontrada" };
    }

    await prisma.scholarshipOpportunity.delete({
      where: { id: scholarshipId },
    });

    revalidatePath("/admin/scholarships");

    return {
      success: true,
      message: "Beca eliminada exitosamente",
    };
  } catch (error) {
    console.error("[deleteScholarshipAction]", error);
    return {
      success: false,
      message: "Error al eliminar la beca",
    };
  }
}