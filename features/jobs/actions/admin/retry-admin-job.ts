"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type RetryAdminJobResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const retryAdminJob = async (
  jobDbId: string
): Promise<RetryAdminJobResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.queueJob.findUnique({
      where: { id: jobDbId },
      select: { id: true, status: true, attempts: true, maxAttempts: true },
    });

    if (!existing) {
      return { success: false, error: "Job no encontrado" };
    }

    if (existing.status !== "FAILED" && existing.status !== "CANCELLED") {
      return { success: false, error: "Solo se pueden reintentar jobs fallidos o cancelados." };
    }

    await prisma.queueJob.update({
      where: { id: jobDbId },
      data: {
        status: "PENDING",
        lastError: null,
        attempts: 0,
        startedAt: null,
        finishedAt: null,
      },
    });

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${jobDbId}`);

    return { success: true, message: "Job reencolado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_RETRY_JOB_ERROR]", error);
    return { success: false, error: "Error reintentando job" };
  }
};

