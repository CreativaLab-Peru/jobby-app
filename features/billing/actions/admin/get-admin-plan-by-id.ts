"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { PaymentPlan, UserPayment, User } from "@prisma/client";

export type AdminPlanDetail = PaymentPlan & {
  payments: (Pick<UserPayment, "id" | "userId" | "active" | "startedAt" | "expiresAt"> & {
    user: Pick<User, "id" | "email" | "name">;
  })[];
  _count: { payments: number };
};

export type AdminPlanByIdResult =
  | { success: true; data: AdminPlanDetail }
  | { success: false; error: string };

export const getAdminPlanById = async (
  planId: string
): Promise<AdminPlanByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const plan = await prisma.paymentPlan.findUnique({
      where: { id: planId },
      include: {
        payments: {
          select: {
            id: true,
            userId: true,
            active: true,
            startedAt: true,
            expiresAt: true,
            user: { select: { id: true, email: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { payments: true } },
      },
    });

    const planParsed = JSON.parse(JSON.stringify(plan)) as AdminPlanDetail | null;

    if (!planParsed) {
      return { success: false, error: "Plan no encontrado" };
    }

    return { success: true, data: planParsed as AdminPlanDetail };
  } catch (error) {
    console.error("[ADMIN_GET_PLAN_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo plan" };
  }
};

