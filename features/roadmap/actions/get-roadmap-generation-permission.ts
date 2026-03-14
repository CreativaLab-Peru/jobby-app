"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { PAYMENT_PRO_ID, PAYMENT_STARTER_ID } from "@/features/billing/consts/payment-plant-ids";

export type RoadmapPlanTier = "FREE" | "STARTER" | "PRO";

export type RoadmapGenerationPermission = {
  canGenerate: boolean;
  planTier: RoadmapPlanTier;
  isFirstOpportunity: boolean;
  message: string | null;
};

export async function getRoadmapGenerationPermissionByUser(
  userId: string,
  opportunityId: string,
  cvId: string,
): Promise<RoadmapGenerationPermission> {
  const activePaidPlans = await prisma.userPayment.findMany({
    where: {
      userId,
      active: true,
      planId: { in: [PAYMENT_STARTER_ID, PAYMENT_PRO_ID] },
    },
    select: { planId: true },
  });

  const hasPro = activePaidPlans.some((payment) => payment.planId === PAYMENT_PRO_ID);
  const hasStarter = activePaidPlans.some((payment) => payment.planId === PAYMENT_STARTER_ID);
  const planTier: RoadmapPlanTier = hasPro ? "PRO" : hasStarter ? "STARTER" : "FREE";

  const firstOpportunity = await prisma.opportunity.findFirst({
    where: {
      cvId,
      cv: { userId },
    },
    orderBy: [{ match: "desc" }, { createdAt: "desc" }],
    select: { id: true },
  });

  const isFirstOpportunity = firstOpportunity?.id === opportunityId;

  if (planTier === "PRO") {
    return {
      canGenerate: true,
      planTier,
      isFirstOpportunity,
      message: null,
    };
  }

  if (isFirstOpportunity) {
    return {
      canGenerate: true,
      planTier,
      isFirstOpportunity,
      message: null,
    };
  }

  return {
    canGenerate: false,
    planTier,
    isFirstOpportunity,
    message:
      planTier === "STARTER"
        ? "Con Starter solo puedes generar roadmap para tu primera oportunidad. Mejora a Pro para desbloquear las demás."
        : "Con Free solo puedes generar roadmap para tu primera oportunidad.",
  };
}

export async function getRoadmapGenerationPermission(
  opportunityId: string,
  cvId: string,
): Promise<RoadmapGenerationPermission> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      canGenerate: false,
      planTier: "FREE",
      isFirstOpportunity: false,
      message: "Usuario no autenticado.",
    };
  }

  return getRoadmapGenerationPermissionByUser(user.id, opportunityId, cvId);
}
