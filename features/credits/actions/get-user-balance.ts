import {prisma} from "@/lib/prisma";
import {CreditBalanceType} from "@prisma/client";

export type GetUserBalanceParams = {
  userId: string;
  type: CreditBalanceType;
};

/**
 * CONSULTA DE SALDO
 * Rápida y sin transacciones pesadas.
 */
export const getUserBalance = async (body: GetUserBalanceParams) => {
  const {userId, type} = body;
  const balance = await prisma.userCreditBalance.findUnique({
    where: {
      userId_type: {
        userId,
        type
      }
    },
    select: { amount: true }
  });

  return balance?.amount ?? 0;
};
