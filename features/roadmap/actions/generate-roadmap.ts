"use server";

import { inngest } from "@/inngest/functions/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { getRoadmapGenerationPermissionByUser } from "@/features/roadmap/actions/get-roadmap-generation-permission";

interface GenerateRoadmapParams {
  opportunityId: string;
  cvId: string;
  routeId: string | null;
}

export async function generateRoadmapAction({
  opportunityId,
  cvId,
  routeId,
}: GenerateRoadmapParams) {
  if (!opportunityId || !cvId || !routeId) {
    return {
      success: false,
      message: "opportunityId, cvId y routeId son requeridos.",
      status: 400,
    };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      message: "Usuario no encontrado.",
      status: 404,
    };
  }

  // Verify opportunity belongs to user's CV
  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id: opportunityId,
      cvId,
      routeId,
      cv: { userId: currentUser.id },
    },
  });
  if (!opportunity) {
    return {
      success: false,
      message: "Oportunidad no encontrada.",
      status: 404,
    };
  }

  // Check if a roadmap already exists and is succeeded
  const existing = await prisma.roadmap.findUnique({
    where: {
      opportunityId_cvId_userId_routeId: {
        opportunityId,
        cvId,
        userId: currentUser.id,
        routeId,
      },
    },
  });
  if (existing?.status === "SUCCEEDED") {
    return {
      success: true,
      message: "Ya existe un roadmap para esta oportunidad.",
      data: { roadmapId: existing.id },
      status: 200,
    };
  }

  if (existing?.status === "PENDING" || existing?.status === "IN_PROGRESS") {
    return {
      success: true,
      message: "Ya estamos generando un roadmap para esta oportunidad.",
      data: { roadmapId: existing.id },
      status: 202,
    };
  }

  const permission = await getRoadmapGenerationPermissionByUser(
    currentUser.id,
    opportunityId,
    cvId,
    routeId,
  );

  if (!permission.canGenerate) {
    return {
      success: false,
      message: permission.message || "No puedes generar roadmap para esta oportunidad.",
      status: 403,
    };
  }

  await inngest.send({
    name: "generate.roadmap",
    data: {
      opportunityId,
      cvId,
      userId: currentUser.id,
      routeId,
    },
  });

  return {
    success: true,
    message: "Generación de roadmap iniciada.",
    data: { opportunityId, cvId },
    status: 202,
  };
}
