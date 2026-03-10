"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { UserCreditBalance, User, CreditBalanceType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminBalanceItem = UserCreditBalance & {
  user: Pick<User, "id" | "email" | "name">;
  _count: { creditTransaction: number };
};

export type AdminUserBalanceGroup = {
  userId: string;
  user: Pick<User, "id" | "email" | "name">;
  balances: AdminBalanceItem[];
  totalCredits: number;
};

export type AdminBalanceListResult =
  | {
      success: true;
      data: {
        userGroups: AdminUserBalanceGroup[];
        hasMore: boolean;
        totalCount: number;
        stats: {
          total: number;
          aiActions: number;
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

    const balanceWhere: Prisma.UserCreditBalanceWhereInput = {
      type: { not: "UPLOADS" },
    };

    if (options?.type) {
      balanceWhere.type = options.type;
    }

    if (options?.amountMin !== undefined && options?.amountMin !== null) {
      balanceWhere.amount = { ...(balanceWhere.amount as Prisma.IntFilter || {}), gte: options.amountMin };
    }
    if (options?.amountMax !== undefined && options?.amountMax !== null) {
      balanceWhere.amount = { ...(balanceWhere.amount as Prisma.IntFilter || {}), lte: options.amountMax };
    }

    if (options?.balanceStatus === "zero") {
      balanceWhere.amount = { ...(balanceWhere.amount as Prisma.IntFilter || {}), equals: 0 };
    } else if (options?.balanceStatus === "positive") {
      balanceWhere.amount = { ...(balanceWhere.amount as Prisma.IntFilter || {}), gt: 0 };
    }

    if (options?.hasTransactions === "yes") {
      balanceWhere.creditTransaction = { some: {} };
    } else if (options?.hasTransactions === "no") {
      balanceWhere.creditTransaction = { none: {} };
    }

    if (options?.dateFrom || options?.dateTo) {
      balanceWhere.updatedAt = {};
      if (options?.dateFrom) {
        (balanceWhere.updatedAt as Prisma.DateTimeFilter).gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (balanceWhere.updatedAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    const userWhere: Prisma.UserWhereInput = {
      userCreditBalance: { some: balanceWhere },
    };

    if (options?.query) {
      userWhere.OR = [
        { email: { contains: options.query, mode: "insensitive" } },
        { name: { contains: options.query, mode: "insensitive" } },
      ];
    }

    const [users, totalCount, aiActionsCount, manageCvsCount, searchOppCount, zeroBalanceCount, creditsAgg] = await Promise.all([
      prisma.user.findMany({
        where: userWhere,
        skip,
        take,
        include: {
          userCreditBalance: {
            where: balanceWhere,
            include: {
              _count: { select: { creditTransaction: true } },
            },
            orderBy: { type: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.user.count({ where: userWhere }),
      prisma.userCreditBalance.count({ where: { type: "AI_ACTIONS" } }),
      prisma.userCreditBalance.count({ where: { type: "MANAGE_CVS" } }),
      prisma.userCreditBalance.count({ where: { type: "SEARCH_OPPORTUNITIES" } }),
      prisma.userCreditBalance.count({ where: { amount: 0 } }),
      prisma.userCreditBalance.aggregate({ _sum: { amount: true } }),
    ]);

    const userGroups: AdminUserBalanceGroup[] = users.map((u) => {
      const userInfo = { id: u.id, email: u.email ?? "", name: u.name ?? "" };
      return {
        userId: u.id,
        user: userInfo,
        balances: u.userCreditBalance.map((b) => ({
          ...b,
          user: userInfo,
        })) as AdminBalanceItem[],
        totalCredits: u.userCreditBalance.reduce((sum, b) => sum + b.amount, 0),
      };
    });

    const total = aiActionsCount + manageCvsCount + searchOppCount;

    return {
      success: true,
      data: {
        userGroups,
        hasMore: skip + take < totalCount,
        totalCount,
        stats: {
          total,
          aiActions: aiActionsCount,
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