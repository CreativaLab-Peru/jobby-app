"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { CreditBalanceType } from "@prisma/client";

export type AddAdminCreditsResult =
  | { success: true; message: string; balanceId: string }
  | { success: false; error: string };

export const addAdminCredits = async (
  userId: string,
  type: CreditBalanceType,
  amountDelta: number,
  reason?: string
): Promise<AddAdminCreditsResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) return { success: false, error: "Acceso denegado." };

    if (!userId) return { success: false, error: "Usuario invalido" };

    // Find existing balance for user+type
    let balance = await prisma.userCreditBalance.findFirst({ where: { userId, type } });

    if (!balance) {
      // Create new balance
      balance = await prisma.userCreditBalance.create({
        data: { userId, type, amount: Math.max(0, amountDelta) },
      });

      if (amountDelta !== 0) {
        await prisma.creditTransaction.create({
          data: {
            balanceId: balance.id,
            amount: amountDelta,
            type: amountDelta > 0 ? "RECHARGE" : "CONSUMPTION",
            description: reason || `Ajuste administrativo (${amountDelta > 0 ? '+' : ''}${amountDelta})`,
            metadata: { adjustedBy: "admin", createdForUser: userId },
          },
        });
      }
    } else {
      // Update existing amount
      const newAmount = balance.amount + amountDelta;
      await prisma.$transaction(async (tx) => {
        await tx.userCreditBalance.update({ where: { id: balance!.id }, data: { amount: newAmount } });
        if (amountDelta !== 0) {
          await tx.creditTransaction.create({
            data: {
              balanceId: balance!.id,
              amount: amountDelta,
              type: amountDelta > 0 ? "RECHARGE" : "CONSUMPTION",
              description: reason || `Ajuste administrativo (${amountDelta > 0 ? '+' : ''}${amountDelta})`,
              metadata: { adjustedBy: "admin", previousAmount: balance!.amount, newAmount },
            },
          });
        }
      });
    }

    revalidatePath(`/admin/balances/${balance.id}`);
    revalidatePath(`/admin/balances`);

    return { success: true, message: "Créditos aplicados correctamente", balanceId: balance.id };
  } catch (error) {
    console.error("[ADMIN_ADD_CREDITS_ERROR]", error);
    return { success: false, error: "Error aplicando créditos" };
  }
};
