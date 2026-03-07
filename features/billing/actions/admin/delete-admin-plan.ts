"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminPlanResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminPlan = async (
  planId: string
): Promise<DeleteAdminPlanResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.paymentPlan.findUnique({
      where: { id: planId },
      include: { _count: { select: { payments: true } } },
    });

    if (!existing) {
      return { success: false, error: "Plan no encontrado" };
    }

    if (existing._count.payments > 0) {
      return {
        success: false,
        error: `No se puede eliminar este plan porque tiene ${existing._count.payments} pago(s) asociado(s). Desactiva los pagos primero.`,
      };
    }

    await prisma.paymentPlan.delete({
      where: { id: planId },
    });

    revalidatePath("/admin/plans");

    return { success: true, message: "Plan eliminado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_PLAN_ERROR]", error);
    return { success: false, error: "Error eliminando plan" };
  }
};

