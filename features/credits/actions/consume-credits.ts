import {prisma} from "@/lib/prisma";

export const consumeCredits = async (userId: string, amount: number, description: string) => {
  return prisma.$transaction(async (tx) => {
    // 1. Buscar y bloquear el balance para evitar condiciones de carrera (Race Conditions)
    const balance = await tx.userCreditBalance.findUnique({
      where: {userId},
    });

    if (!balance || balance.amount < amount) {
      throw new Error("Créditos insuficientes");
    }

    // 2. Restar créditos
    const updatedBalance = await tx.userCreditBalance.update({
      where: {userId},
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
