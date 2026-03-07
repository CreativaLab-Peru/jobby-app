"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { UserCreditBalance, User, CreditBalanceType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminBalanceItem = UserCreditBalance & {
  user: Pick<User, "id" | "email" | "name">;
  _count: { creditTransaction: number };
};

export type AdminBalanceListResult =
  | {
      success: true;
      data: {
        balances: AdminBalanceItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminBalancesOptions {
  query?: string;
  type?: CreditBalanceType | null;
  amountMin?: number | null;
  amountMax?: number | null;
  sortBy?: "updatedAt" | "amount" | "type";
  sortOrder?: "asc" | "desc";
}

export const getAdminBalances = async (
  skip = 0,
  take = 10,
  options?: GetAdminBalancesOptions
): Promise<AdminBalanceListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.UserCreditBalanceWhereInput = {};

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.query) {
      where.user = {
        OR: [
          { email: { contains: options.query, mode: "insensitive" } },
          { name: { contains: options.query, mode: "insensitive" } },
        ],
      };
    }

    if (options?.amountMin !== undefined && options?.amountMin !== null) {
      where.amount = { ...(where.amount as Prisma.IntFilter || {}), gte: options.amountMin };
    }
    if (options?.amountMax !== undefined && options?.amountMax !== null) {
      where.amount = { ...(where.amount as Prisma.IntFilter || {}), lte: options.amountMax };
    }

    const sortBy = options?.sortBy || "updatedAt";
    const sortOrder = options?.sortOrder || "desc";

    const [balances, totalCount] = await Promise.all([
      prisma.userCreditBalance.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { creditTransaction: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.userCreditBalance.count({ where }),
    ]);

    return {
      success: true,
      data: {
        balances: balances as AdminBalanceItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_BALANCES_ERROR]", error);
    return { success: false, error: "Error obteniendo balances" };
  }
};

