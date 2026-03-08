"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type UpdateAdminBalanceResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminBalanceInput {
  amount: number;
  reason?: string;
}

export const updateAdminBalance = async (
  balanceId: string,
  input: UpdateAdminBalanceInput
): Promise<UpdateAdminBalanceResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.userCreditBalance.findUnique({
      where: { id: balanceId },
      select: { id: true, amount: true },
    });

    if (!existing) {
      return { success: false, error: "Balance no encontrado" };
    }

    const diff = input.amount - existing.amount;

    await prisma.$transaction(async (tx) => {
      await tx.userCreditBalance.update({
        where: { id: balanceId },
        data: { amount: input.amount },
      });

      // Log the admin adjustment as a transaction
      if (diff !== 0) {
        await tx.creditTransaction.create({
          data: {
            balanceId,
            amount: diff,
            type: diff > 0 ? "RECHARGE" : "CONSUMPTION",
            description: input.reason || `Ajuste administrativo (${diff > 0 ? "+" : ""}${diff})`,
            metadata: { adjustedBy: "admin", previousAmount: existing.amount, newAmount: input.amount },
          },
        });
      }
    });

    revalidatePath("/admin/balances");
    revalidatePath(`/admin/balances/${balanceId}`);

    return { success: true, message: "Balance actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_BALANCE_ERROR]", error);
    return { success: false, error: "Error actualizando balance" };
  }
};

