"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {
  PAYMENT_STARTER_ID,
  PAYMENT_PRO_ID,
} from "@/features/billing/consts/payment-plant-ids";

const PAID_PLAN_IDS = [PAYMENT_STARTER_ID, PAYMENT_PRO_ID];

/**
 * Checks whether the current user has an active paid plan
 * (STARTER or PRO) that grants full roadmap visibility.
 */
export async function canViewFullRoadmap(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const activePlan = await prisma.userPayment.findFirst({
      where: {
        userId: user.id,
        active: true,
        planId: { in: PAID_PLAN_IDS },
      },
      select: { id: true },
    });

    return !!activePlan;
  } catch {
    return false;
  }
}

