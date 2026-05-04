"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminCompanyResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminCompany = async (
  companyId: string
): Promise<DeleteAdminCompanyResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      return { success: false, error: "Empresa no encontrada" };
    }

    // Check if company has members
    const membersCount = await prisma.companyMember.count({
      where: { companyId },
    });

    if (membersCount > 0) {
      return { success: false, error: "No se puede eliminar una empresa con miembros" };
    }

    // Delete company and all related data (cascading)
    await prisma.company.delete({
      where: { id: companyId },
    });

    revalidatePath("/admin/companies");

    return { success: true, message: "Empresa eliminada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_COMPANY_ERROR]", error);
    return { success: false, error: "Error eliminando empresa" };
  }
};

