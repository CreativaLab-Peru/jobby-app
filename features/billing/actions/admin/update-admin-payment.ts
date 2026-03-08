"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type UpdateAdminPaymentResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminPaymentInput {
  active?: boolean;
  manualCvsUsed?: number;
  uploadCvsUsed?: number;
  expiresAt?: string | null;
}

export const updateAdminPayment = async (
  paymentId: string,
  input: UpdateAdminPaymentInput
): Promise<UpdateAdminPaymentResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.userPayment.findUnique({
      where: { id: paymentId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    const data: Record<string, unknown> = {};

    if (input.active !== undefined) data.active = input.active;
    if (input.manualCvsUsed !== undefined) data.manualCvsUsed = input.manualCvsUsed;
    if (input.uploadCvsUsed !== undefined) data.uploadCvsUsed = input.uploadCvsUsed;
    if (input.expiresAt !== undefined) {
      data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    }

    await prisma.userPayment.update({
      where: { id: paymentId },
      data,
    });

    revalidatePath("/admin/payments");
    revalidatePath(`/admin/payments/${paymentId}`);

    return { success: true, message: "Pago actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_PAYMENT_ERROR]", error);
    return { success: false, error: "Error actualizando pago" };
  }
};

