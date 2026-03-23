"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { PaymentPlan } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminPlanItem = PaymentPlan & {
  _count: { payments: number };
};

export type AdminPlanListResult =
  | {
      success: true;
      data: {
        plans: AdminPlanItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminPlansListOptions {
  query?: string;
  sortBy?: "createdAt" | "name" | "priceCentsUSD";
  sortOrder?: "asc" | "desc";
}

export const getAdminPlansList = async (
  skip = 0,
  take = 10,
  options?: GetAdminPlansListOptions
): Promise<AdminPlanListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.PaymentPlanWhereInput = {};

    if (options?.query) {
      where.OR = [
        { name: { contains: options.query, mode: "insensitive" } },
        { slug: { contains: options.query, mode: "insensitive" } },
        { description: { contains: options.query, mode: "insensitive" } },
      ];
    }

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [plans, totalCount] = await Promise.all([
      prisma.paymentPlan.findMany({
        where,
        skip,
        take,
        include: {
          _count: { select: { payments: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.paymentPlan.count({ where }),
    ]);

    const plansParsed = JSON.stringify(plans);
    const plansFinal = JSON.parse(plansParsed) as AdminPlanItem[];

    return {
      success: true,
      data: {
        plans: plansFinal as AdminPlanItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_PLANS_LIST_ERROR]", error);
    return { success: false, error: "Error obteniendo planes" };
  }
};

