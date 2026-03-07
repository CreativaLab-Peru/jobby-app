"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminJobResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminJob = async (
  jobDbId: string
): Promise<DeleteAdminJobResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.queueJob.findUnique({
      where: { id: jobDbId },
      select: { id: true, status: true },
    });

    if (!existing) {
      return { success: false, error: "Job no encontrado" };
    }

    if (existing.status === "IN_PROGRESS") {
      return { success: false, error: "No se puede eliminar un job en progreso. Cancelalo primero." };
    }

    await prisma.queueJob.delete({
      where: { id: jobDbId },
    });

    revalidatePath("/admin/jobs");

    return { success: true, message: "Job eliminado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_JOB_ERROR]", error);
    return { success: false, error: "Error eliminando job" };
  }
};

