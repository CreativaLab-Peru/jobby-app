"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { UserCreditBalance, User, CreditTransaction } from "@prisma/client";

export type AdminBalanceDetail = UserCreditBalance & {
  user: Pick<User, "id" | "email" | "name" | "image" | "role" | "createdAt">;
  creditTransaction: CreditTransaction[];
  _count: { creditTransaction: number };
};

export type AdminBalanceByIdResult =
  | { success: true; data: AdminBalanceDetail }
  | { success: false; error: string };

export const getAdminBalanceById = async (
  balanceId: string
): Promise<AdminBalanceByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const balance = await prisma.userCreditBalance.findUnique({
      where: { id: balanceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
          },
        },
        creditTransaction: {
          orderBy: { createdAt: "desc" },
          take: 30,
        },
        _count: { select: { creditTransaction: true } },
      },
    });

    if (!balance) {
      return { success: false, error: "Balance no encontrado" };
    }

    return { success: true, data: balance as AdminBalanceDetail };
  } catch (error) {
    console.error("[ADMIN_GET_BALANCE_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo balance" };
  }
};

