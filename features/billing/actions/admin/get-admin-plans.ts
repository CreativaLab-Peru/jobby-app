"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";

export type AdminPlanOption = {
  id: string;
  slug: string;
  name: string;
};

export const getAdminPlans = async (): Promise<AdminPlanOption[]> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) return [];

    const plans = await prisma.paymentPlan.findMany({
      select: { id: true, slug: true, name: true },
      orderBy: { name: "asc" },
    });

    return plans;
  } catch {
    return [];
  }
};

