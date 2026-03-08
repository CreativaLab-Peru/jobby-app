"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminCreditPackageResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminCreditPackage = async (
  packageId: string
): Promise<DeleteAdminCreditPackageResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.creditPackage.findUnique({
      where: { id: packageId },
      include: { _count: { select: { invoice: true } } },
    });

    if (!existing) {
      return { success: false, error: "Paquete no encontrado" };
    }

    if (existing._count.invoice > 0) {
      // Soft-deactivate if has invoices
      await prisma.creditPackage.update({
        where: { id: packageId },
        data: { active: false },
      });
      revalidatePath("/admin/credit-packages");
      return { success: true, message: "Paquete desactivado (tiene facturas asociadas)" };
    }

    await prisma.creditPackage.delete({
      where: { id: packageId },
    });

    revalidatePath("/admin/credit-packages");

    return { success: true, message: "Paquete eliminado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_CREDIT_PACKAGE_ERROR]", error);
    return { success: false, error: "Error eliminando paquete" };
  }
};

