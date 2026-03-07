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
        stats: {
          total: number;
          aiActions: number;
          uploads: number;
          manageCvs: number;
          searchOpportunities: number;
          zeroBalance: number;
          totalCredits: number;
        };
      };
    }
  | { success: false; error: string };

export interface GetAdminBalancesOptions {
  query?: string;
  type?: CreditBalanceType | null;
  balanceStatus?: "zero" | "positive" | null;
  hasTransactions?: "yes" | "no" | null;
  dateFrom?: string | null;
  dateTo?: string | null;
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

    // Balance status filter
    if (options?.balanceStatus === "zero") {
      where.amount = { ...(where.amount as Prisma.IntFilter || {}), equals: 0 };
    } else if (options?.balanceStatus === "positive") {
      where.amount = { ...(where.amount as Prisma.IntFilter || {}), gt: 0 };
    }

    // Has transactions filter
    if (options?.hasTransactions === "yes") {
      where.creditTransaction = { some: {} };
    } else if (options?.hasTransactions === "no") {
      where.creditTransaction = { none: {} };
    }

    // Date range
    if (options?.dateFrom || options?.dateTo) {
      where.updatedAt = {};
      if (options?.dateFrom) {
        (where.updatedAt as Prisma.DateTimeFilter).gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (where.updatedAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    const sortBy = options?.sortBy || "updatedAt";
    const sortOrder = options?.sortOrder || "desc";

    const [balances, totalCount, aiActionsCount, uploadsCount, manageCvsCount, searchOppCount, zeroBalanceCount, creditsAgg] = await Promise.all([
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
      prisma.userCreditBalance.count({ where: { type: "AI_ACTIONS" } }),
      prisma.userCreditBalance.count({ where: { type: "UPLOADS" } }),
      prisma.userCreditBalance.count({ where: { type: "MANAGE_CVS" } }),
      prisma.userCreditBalance.count({ where: { type: "SEARCH_OPPORTUNITIES" } }),
      prisma.userCreditBalance.count({ where: { amount: 0 } }),
      prisma.userCreditBalance.aggregate({ _sum: { amount: true } }),
    ]);

    const total = aiActionsCount + uploadsCount + manageCvsCount + searchOppCount;

    return {
      success: true,
      data: {
        balances: balances as AdminBalanceItem[],
        hasMore: skip + take < totalCount,
        totalCount,
        stats: {
          total,
          aiActions: aiActionsCount,
          uploads: uploadsCount,
          manageCvs: manageCvsCount,
          searchOpportunities: searchOppCount,
          zeroBalance: zeroBalanceCount,
          totalCredits: creditsAgg._sum.amount ?? 0,
        },
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_BALANCES_ERROR]", error);
    return { success: false, error: "Error obteniendo balances" };
  }
};

