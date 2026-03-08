"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { JobStatus } from "@prisma/client";

export type UpdateAdminJobResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminJobInput {
  status?: JobStatus;
  attempts?: number;
  maxAttempts?: number;
  lastError?: string | null;
}

export const updateAdminJob = async (
  jobDbId: string,
  input: UpdateAdminJobInput
): Promise<UpdateAdminJobResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.queueJob.findUnique({
      where: { id: jobDbId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Job no encontrado" };
    }

    const data: Record<string, unknown> = {};

    if (input.status !== undefined) data.status = input.status;
    if (input.attempts !== undefined) data.attempts = input.attempts;
    if (input.maxAttempts !== undefined) data.maxAttempts = input.maxAttempts;
    if (input.lastError !== undefined) data.lastError = input.lastError;

    await prisma.queueJob.update({
      where: { id: jobDbId },
      data,
    });

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${jobDbId}`);

    return { success: true, message: "Job actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_JOB_ERROR]", error);
    return { success: false, error: "Error actualizando job" };
  }
};

