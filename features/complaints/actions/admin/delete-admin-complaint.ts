"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminComplaintResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminComplaint = async (
  complaintId: string
): Promise<DeleteAdminComplaintResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Reclamo no encontrado" };
    }

    await prisma.complaint.delete({
      where: { id: complaintId },
    });

    revalidatePath("/admin/complaints");

    return { success: true, message: "Reclamo eliminado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_COMPLAINT_ERROR]", error);
    return { success: false, error: "Error eliminando reclamo" };
  }
};

