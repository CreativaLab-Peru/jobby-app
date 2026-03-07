"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminInterviewResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminInterview = async (
  sessionId: string
): Promise<DeleteAdminInterviewResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Entrevista no encontrada" };
    }

    await prisma.interviewSession.delete({
      where: { id: sessionId },
    });

    revalidatePath("/admin/interviews");

    return { success: true, message: "Entrevista eliminada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_INTERVIEW_ERROR]", error);
    return { success: false, error: "Error eliminando entrevista" };
  }
};

