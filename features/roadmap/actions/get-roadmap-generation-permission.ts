"use server";

import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { PAYMENT_PRO_ID, PAYMENT_STARTER_ID } from "@/features/billing/consts/payment-plant-ids";

export type RoadmapPlanTier = "FREE" | "STARTER" | "PRO";

export type RoadmapGenerationBlockReason =
  | "NONE"
  | "UNAUTHENTICATED"
  | "ROUTE_NOT_FOUND"
  | "FREE_ONLY_FIRST_OPPORTUNITY"
  | "ALREADY_EXISTS_FOR_OPPORTUNITY"
  | "ALREADY_PROCESSING_FOR_OPPORTUNITY"
  | "ROUTE_LIMIT_REACHED_FREE"
  | "ROUTE_LIMIT_REACHED_STARTER"
  | "ROUTE_LIMIT_PENDING_FREE"
  | "ROUTE_LIMIT_PENDING_STARTER";

export type RoadmapGenerationPermission = {
  canGenerate: boolean;
  planTier: RoadmapPlanTier;
  message: string | null;
  reason: RoadmapGenerationBlockReason;
};

export async function getRoadmapGenerationPermissionByUser(
  userId: string,
  opportunityId: string,
  _cvId: string,
  routeId: string,
): Promise<RoadmapGenerationPermission> {
  if (!routeId) {
    return {
      canGenerate: false,
      planTier: "FREE",
      message: "No se pudo identificar la ruta activa para esta oportunidad.",
      reason: "ROUTE_NOT_FOUND",
    };
  }

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

  const routeRoadmaps = await prisma.roadmap.findMany({
    where: {
      userId,
      routeId,
      status: {
        in: [JobStatus.PENDING, JobStatus.IN_PROGRESS, JobStatus.SUCCEEDED],
      },
    },
    select: {
      opportunityId: true,
      status: true,
    },
  });

  const roadmapForOpportunity = routeRoadmaps.find(
    (roadmap) => roadmap.opportunityId === opportunityId,
  );

  if (roadmapForOpportunity?.status === JobStatus.SUCCEEDED) {
    return {
      canGenerate: false,
      planTier,
      message: "Ya existe un roadmap generado para esta oportunidad en esta ruta.",
      reason: "ALREADY_EXISTS_FOR_OPPORTUNITY",
    };
  }

  if (
    roadmapForOpportunity?.status === JobStatus.PENDING ||
    roadmapForOpportunity?.status === JobStatus.IN_PROGRESS
  ) {
    return {
      canGenerate: false,
      planTier,
      message: "Ya hay un roadmap en proceso para esta oportunidad.",
      reason: "ALREADY_PROCESSING_FOR_OPPORTUNITY",
    };
  }

  const generatedCount = routeRoadmaps.filter(
    (roadmap) => roadmap.status === JobStatus.SUCCEEDED,
  ).length;
  const processingCount = routeRoadmaps.filter(
    (roadmap) => roadmap.status === JobStatus.PENDING || roadmap.status === JobStatus.IN_PROGRESS,
  ).length;

  if (planTier === "FREE") {
    const firstRouteOpportunity = await prisma.opportunity.findFirst({
      where: {
        routeId,
        cv: {
          userId,
        },
      },
      orderBy: [{ match: "desc" }, { createdAt: "desc" }, { id: "asc" }],
      select: { id: true },
    });

    if (firstRouteOpportunity && firstRouteOpportunity.id !== opportunityId) {
      return {
        canGenerate: false,
        planTier,
        message: "Con Free solo puedes generar roadmap para la primera oportunidad de tu ruta.",
        reason: "FREE_ONLY_FIRST_OPPORTUNITY",
      };
    }
  }

  if (planTier === "PRO") {
    return {
      canGenerate: true,
      planTier,
      message: null,
      reason: "NONE",
    };
  }

  if (planTier === "STARTER") {
    if (generatedCount >= 1) {
      return {
        canGenerate: false,
        planTier,
        message: "Con Starter puedes generar 1 roadmap por ruta. Mejora a Pro para generar más.",
        reason: "ROUTE_LIMIT_REACHED_STARTER",
      };
    }

    if (processingCount >= 1) {
      return {
        canGenerate: false,
        planTier,
        message: "Ya tienes un roadmap en proceso en esta ruta. Espera a que termine.",
        reason: "ROUTE_LIMIT_PENDING_STARTER",
      };
    }

    return {
      canGenerate: true,
      planTier,
      message: null,
      reason: "NONE",
    };
  }

  if (generatedCount >= 1) {
    return {
      canGenerate: false,
      planTier,
      message:
        "Con Free solo puedes generar 1 roadmap incompleto por ruta. Mejora a Starter o Pro para más.",
      reason: "ROUTE_LIMIT_REACHED_FREE",
    };
  }

  if (processingCount >= 1) {
    return {
      canGenerate: false,
      planTier,
      message: "Ya tienes un roadmap en proceso en esta ruta. Espera a que termine.",
      reason: "ROUTE_LIMIT_PENDING_FREE",
    };
  }

  return {
    canGenerate: true,
    planTier,
    message: null,
    reason: "NONE",
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
      reason: "UNAUTHENTICATED",
    };
  }

  return getRoadmapGenerationPermissionByUser(user.id, opportunityId, cvId, routeId);
}
