"use server";

import { prisma } from "@/lib/prisma";

export type PlanNamesMap = {
  starter: string;
  pro: string;
};

export const getPlanNames = async (): Promise<PlanNamesMap> => {
  try {
    const plans = await prisma.paymentPlan.findMany({
      where: { slug: { in: ["starter", "pro"] } },
      select: { slug: true, name: true },
    });

    return {
      starter: plans.find((p) => p.slug === "starter")?.name || "Starter",
      pro: plans.find((p) => p.slug === "pro")?.name || "Pro",
    };
  } catch (error) {
    console.error("[GET_PLAN_NAMES_ERROR]", error);
    return {
      starter: "Starter",
      pro: "Pro",
    };
  }
};
