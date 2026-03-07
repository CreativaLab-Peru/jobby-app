"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type AdminDeleteCvResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const softDeleteAdminCv = async (cvId: string): Promise<AdminDeleteCvResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return {
        success: false,
        error: "Acceso denegado. Solo los administradores pueden ocultar CVs.",
      }
    }

    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: { id: true },
    });

    if (!cv) {
      return { success: false, error: "CV no encontrado" };
    }

    await prisma.cv.update({
      where: { id: cvId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/cv");

    return { success: true, message: "CV ocultado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_CV_ERROR]", error);
    return { success: false, error: "Error ocultando CV" };
  }
};

