"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminOpportunityResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminOpportunity = async (
  id: string,
  cvId: string
): Promise<DeleteAdminOpportunityResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id_cvId: { id, cvId } },
      select: { id: true },
    });

    if (!opportunity) {
      return { success: false, error: "Oportunidad no encontrada" };
    }

    await prisma.opportunity.delete({
      where: { id_cvId: { id, cvId } },
    });

    revalidatePath("/admin/opportunities");

    return { success: true, message: "Oportunidad eliminada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_OPPORTUNITY_ERROR]", error);
    return { success: false, error: "Error eliminando oportunidad" };
  }
};

