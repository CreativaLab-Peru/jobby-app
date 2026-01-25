import {prisma} from "@/lib/prisma";

/**
 * RECARGA DE CRÉDITOS
 * Se usa tras un pago exitoso (Stripe Webhook) o bono.
 */
export const rechargeCredits = async (
  userId: string,
  amount: number,
  description: string,
  metadata: any = {}
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Upsert del balance: Si no existe lo crea, si existe lo incrementa
    const balance = await tx.userCreditBalance.upsert({
      where: {userId},
      update: {amount: {increment: amount}},
      create: {
        userId,
        amount: amount
      },
    });

    // 2. Registrar el ingreso en el Ledger
    await tx.creditTransaction.create({
      data: {
        balanceId: balance.id,
        amount: amount,
        type: "RECHARGE", // O "BONUS" según lógica
        description,
        metadata,
      },
    });

    return balance;
  });
};
