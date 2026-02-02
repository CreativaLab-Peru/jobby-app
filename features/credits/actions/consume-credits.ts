import {prisma} from "@/lib/prisma";
import {CreditBalanceType} from "@prisma/client";

export type ConsumeCreditsParams = {
  userId: string;
  type: CreditBalanceType
  amount: number;
  description: string;
};

export const consumeCredits = async (body: ConsumeCreditsParams) => {
  const {userId, amount, description, type} = body;
  return prisma.$transaction(async (tx) => {
    // 1. Buscar y bloquear el balance para evitar condiciones de carrera (Race Conditions)
    const balance = await tx.userCreditBalance.findUnique({
      where: {
        userId_type: {
          userId,
          type
        }
      },
    });

    if (!balance || balance.amount < amount) {
      throw new Error("Créditos insuficientes");
    }

    // 2. Restar créditos
    const updatedBalance = await tx.userCreditBalance.update({
      where: {
        userId_type: {
          userId,
          type
        }
      },
      data: {amount: {decrement: amount}},
    });

    // 3. Registrar en el Ledger
    await tx.creditTransaction.create({
      data: {
        balanceId: balance.id,
        amount: -amount,
        type: "CONSUMPTION",
        description,
      },
    });

    return updatedBalance;
  });
};
