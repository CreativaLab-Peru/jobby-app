"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminPaymentResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminPayment = async (
  paymentId: string
): Promise<DeleteAdminPaymentResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.userPayment.findUnique({
      where: { id: paymentId },
      select: { id: true, active: true },
    });

    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    // Deactivate instead of hard delete to preserve audit trail
    await prisma.userPayment.update({
      where: { id: paymentId },
      data: { active: false },
    });

    revalidatePath("/admin/payments");

    return { success: true, message: "Pago desactivado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_PAYMENT_ERROR]", error);
    return { success: false, error: "Error desactivando pago" };
  }
};

