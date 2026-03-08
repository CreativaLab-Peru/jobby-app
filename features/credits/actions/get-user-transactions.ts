"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CreditTransaction, TransactionType, CreditBalanceType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type UserTransactionItem = CreditTransaction & {
  balance: {
    type: CreditBalanceType;
  };
};

export type UserTransactionListResult =
  | {
      success: true;
      data: {
        transactions: UserTransactionItem[];
        totalCount: number;
        hasMore: boolean;
      };
    }
  | { success: false; error: string };

export interface GetUserTransactionsOptions {
  type?: TransactionType | null;
  creditType?: CreditBalanceType | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export const getUserTransactions = async (
  skip = 0,
  take = 10,
  options?: GetUserTransactionsOptions
): Promise<UserTransactionListResult> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado." };
    }

    const where: Prisma.CreditTransactionWhereInput = {
      balance: { userId: currentUser.id },
    };

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.creditType) {
      where.balance = { ...(where.balance as Prisma.UserCreditBalanceWhereInput), type: options.creditType };
    }

    if (options?.dateFrom || options?.dateTo) {
      where.createdAt = {};
      if (options?.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (where.createdAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        skip,
        take,
        include: {
          balance: { select: { type: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.creditTransaction.count({ where }),
    ]);

    return {
      success: true,
      data: {
        transactions: transactions as UserTransactionItem[],
        totalCount,
        hasMore: skip + take < totalCount,
      },
    };
  } catch (error) {
    console.error("[GET_USER_TRANSACTIONS_ERROR]", error);
    return { success: false, error: "Error obteniendo transacciones" };
  }
};

