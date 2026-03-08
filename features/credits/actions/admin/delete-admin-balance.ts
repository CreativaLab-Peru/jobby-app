"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminBalanceResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminBalance = async (
  balanceId: string
): Promise<DeleteAdminBalanceResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.userCreditBalance.findUnique({
      where: { id: balanceId },
      include: { _count: { select: { creditTransaction: true } } },
    });

    if (!existing) {
      return { success: false, error: "Balance no encontrado" };
    }

    // Reset to zero instead of deleting to preserve referential integrity
    await prisma.$transaction(async (tx) => {
      if (existing.amount !== 0) {
        await tx.creditTransaction.create({
          data: {
            balanceId,
            amount: -existing.amount,
            type: "CONSUMPTION",
            description: "Balance reseteado por administrador",
            metadata: { resetBy: "admin", previousAmount: existing.amount },
          },
        });
      }

      await tx.userCreditBalance.update({
        where: { id: balanceId },
        data: { amount: 0 },
      });
    });

    revalidatePath("/admin/balances");

    return { success: true, message: "Balance reseteado a 0 exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_BALANCE_ERROR]", error);
    return { success: false, error: "Error reseteando balance" };
  }
};

