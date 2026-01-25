import {prisma} from "@/lib/prisma";

/**
 * CONSULTA DE SALDO
 * Rápida y sin transacciones pesadas.
 */
export const getUserBalance = async (userId: string) => {
  const balance = await prisma.userCreditBalance.findUnique({
    where: { userId },
    select: { amount: true }
  });

  return balance?.amount ?? 0;
};
