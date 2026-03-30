"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { PAYMENT_PRO_ID, PAYMENT_STARTER_ID } from "@/features/billing/consts/payment-plant-ids";

export type RoadmapPlanTier = "FREE" | "STARTER" | "PRO";

export type RoadmapGenerationPermission = {
  canGenerate: boolean;
  planTier: RoadmapPlanTier;
  message: string | null;
};

export async function getRoadmapGenerationPermissionByUser(
  userId: string,
  _opportunityId: string,
  _cvId: string,
  routeId: string,
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


  // Para saber si ya existe un roadmap en esta ruta para el usuario
  const existingRoadmap = await prisma.roadmap.findFirst({
    where: {
      userId,
      routeId,
      status: JobStatus.SUCCEEDED,
    },
    select: { id: true },
  });

  if (planTier === "PRO") {
    return {
      canGenerate: true,
      planTier,
      message: null,
    };
  }

  if (planTier === "STARTER") {
    // Starter: solo 1 roadmap por ruta
    const generatedCount = await prisma.roadmap.count({
      where: {
        userId,
        routeId,
        status: JobStatus.SUCCEEDED,
      },
    });

    if (generatedCount >= 1) {
      return {
        canGenerate: false,
        planTier,
        message: "Con Starter puedes generar 1 roadmap por ruta. Mejora a Pro para generar más.",
      };
    }

    return {
      canGenerate: true,
      planTier,
      message: null,
    };
  }

  // FREE: solo permitir crear un roadmap por ruta
  if (!existingRoadmap) {
    return {
      canGenerate: true,
      planTier,
      message: null,
    };
  }

  return {
    canGenerate: false,
    planTier,
    message: "Con Free solo puedes generar 1 roadmap por ruta. Mejora a Starter o Pro para desbloquear más.",
  };
}

export async function getRoadmapGenerationPermission(
  opportunityId: string,
  cvId: string,
  routeId: string,
): Promise<RoadmapGenerationPermission> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      canGenerate: false,
      planTier: "FREE",
      message: "Usuario no autenticado.",
    };
  }

  return getRoadmapGenerationPermissionByUser(user.id, opportunityId, cvId, routeId);
}
