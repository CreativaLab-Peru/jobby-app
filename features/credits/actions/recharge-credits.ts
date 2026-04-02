import { prisma } from "@/lib/prisma";
import { CreditBalanceType, Prisma, TransactionType } from "@prisma/client";

export type RechargeCreditsBody = {
  userId: string;
  amount: number;
  description: string;
  metadata?: Prisma.InputJsonValue;
  type: CreditBalanceType;
  transactionType?: TransactionType;
};

/**
 * RECARGA DE CRÉDITOS
 * @param body
 * @param tx - Cliente de transacción opcional para operaciones atómicas complejas
 */
export const rechargeCredits = async (
  body: RechargeCreditsBody,
  tx?: Prisma.TransactionClient // <--- Soporte para transacción opcional
) => {
  const { userId, amount, description, metadata, type, transactionType } = body;

  // Definimos la lógica de ejecución
  const execute = async (client: Prisma.TransactionClient) => {
    // 1. Upsert del balance con filtro por tipo (Importante si un usuario tiene varios tipos)
    const balance = await client.userCreditBalance.upsert({
      where: {
        userId_type: { // Prisma busca este campo autogenerado para llaves compuestas
          userId,
          type,
        },
      },
      update: { amount: { increment: amount } },
      create: {
        userId,
        amount,
        type,
      },
    });

    // 2. Registrar el ingreso en el Ledger
    await client.creditTransaction.create({
      data: {
        balanceId: balance.id,
        amount,
        type: transactionType ?? "RECHARGE",
        description,
        metadata,
      },
    });

    return balance;
  };

  // Si ya viene una transacción, la usamos. Si no, creamos una nueva.
  return tx ? execute(tx) : prisma.$transaction(execute);
};
