import {prisma} from "@/lib/prisma";
import {CreditBalanceType} from "@prisma/client";

export type RechargeCreditsBody = {
  userId: string;
  amount: number;
  description: string;
  metadata?: any;
  type: CreditBalanceType
};

/**
 * RECARGA DE CRÉDITOS
 * Se usa tras un pago exitoso (Mercado pago u otros)
 */
export const rechargeCredits = async (body: RechargeCreditsBody) => {
  const {userId, amount, description, metadata, type} = body;
  return prisma.$transaction(async (tx) => {
    // 1. Upsert del balance: Si no existe lo crea, si existe lo incrementa
    const balance = await tx.userCreditBalance.upsert({
      where: {userId},
      update: {amount: {increment: amount}},
      create: {
        userId,
        amount: amount,
        type
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
