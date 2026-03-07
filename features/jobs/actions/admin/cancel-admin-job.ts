"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type CancelAdminJobResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const cancelAdminJob = async (
  jobDbId: string
): Promise<CancelAdminJobResult> => {
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

    if (existing.status !== "PENDING" && existing.status !== "IN_PROGRESS") {
      return { success: false, error: "Solo se pueden cancelar jobs pendientes o en progreso." };
    }

    await prisma.queueJob.update({
      where: { id: jobDbId },
      data: {
        status: "CANCELLED",
        finishedAt: new Date(),
      },
    });

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${jobDbId}`);

    return { success: true, message: "Job cancelado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_CANCEL_JOB_ERROR]", error);
    return { success: false, error: "Error cancelando job" };
  }
};

