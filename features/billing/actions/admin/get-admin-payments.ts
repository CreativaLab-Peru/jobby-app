"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { PaymentPlan, UserPayment, User } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminPaymentItem = UserPayment & {
  plan: Pick<PaymentPlan, "id" | "slug" | "name" | "priceCents" | "currency" | "paymentType">;
  user: Pick<User, "id" | "email" | "name">;
};

export type AdminPaymentListResult =
  | {
      success: true;
      data: {
        payments: AdminPaymentItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminPaymentsOptions {
  query?: string;
  active?: "all" | "active" | "inactive" | null;
  planId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "startedAt" | "expiresAt";
  sortOrder?: "asc" | "desc";
}

export const getAdminPayments = async (
  skip = 0,
  take = 10,
  options?: GetAdminPaymentsOptions
): Promise<AdminPaymentListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver pagos." };
    }

    const where: Prisma.UserPaymentWhereInput = {};

    if (options?.active === "active") {
      where.active = true;
    } else if (options?.active === "inactive") {
      where.active = false;
    }

    if (options?.planId) {
      where.planId = options.planId;
    }

    if (options?.query) {
      where.OR = [
        { user: { email: { contains: options.query, mode: "insensitive" } } },
        { user: { name: { contains: options.query, mode: "insensitive" } } },
        { plan: { name: { contains: options.query, mode: "insensitive" } } },
        { plan: { slug: { contains: options.query, mode: "insensitive" } } },
      ];
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

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [payments, totalCount] = await Promise.all([
      prisma.userPayment.findMany({
        where,
        skip,
        take,
        include: {
          plan: {
            select: {
              id: true,
              slug: true,
              name: true,
              priceCents: true,
              currency: true,
              paymentType: true,
            },
          },
          user: { select: { id: true, email: true, name: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.userPayment.count({ where }),
    ]);

    return {
      success: true,
      data: {
        payments: payments as AdminPaymentItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_PAYMENTS_ERROR]", error);
    return { success: false, error: "Error obteniendo pagos" };
  }
};

