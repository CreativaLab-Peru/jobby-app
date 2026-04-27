"use server";

import { inngest } from "@/inngest/functions/client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { JobStatus, RouteStatus } from "@prisma/client";

interface QuickMatchResult {
  success: boolean;
  message: string;
}

export async function startQuickMatchAction(cvId: string): Promise<QuickMatchResult> {
  try {
    if (!cvId) {
      return { success: false, message: "CV ID is required." };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Usuario no encontrado." };
    }

    // Verify CV exists and belongs to user
    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: currentUser.id },
    });
    if (!cv) {
      return { success: false, message: "CV no encontrado." };
    }

    const route = await prisma.route.findFirst({
      where: {
        userId: currentUser.id,
        cvId,
      },
      select: {
        id: true,
        status: true,
        _count: {
          select: {
            opportunities: true,
          },
        },
      },
    });

    const latestMatchJob = await prisma.queueJob.findFirst({
      where: {
        cvId,
        type: "GET_OPPORTUNITIES",
        status: {
          in: [JobStatus.IN_PROGRESS, JobStatus.SUCCEEDED],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        status: true,
      },
    });

    const statusesWithMatchExecuted: RouteStatus[] = [
      RouteStatus.OPPORTUNITIES_PENDING,
      RouteStatus.OPPORTUNITIES_DONE,
      RouteStatus.ROADMAP_PENDING,
      RouteStatus.ROADMAP_IN_PROGRESS,
      RouteStatus.ROADMAP_DONE,
      RouteStatus.PROGRAM_PENDING,
      RouteStatus.PROGRAM_IN_PROGRESS,
      RouteStatus.PROGRAM_DONE,
    ];

    const routeHasExecutedMatch = route ? statusesWithMatchExecuted.includes(route.status) : false;
    const hasPersistedOpportunities = (route?._count.opportunities ?? 0) > 0;
    const hasAlreadyMatched =
      Boolean(latestMatchJob) || routeHasExecutedMatch || hasPersistedOpportunities;

    if (latestMatchJob?.status === JobStatus.IN_PROGRESS) {
      return {
        success: false,
        message: "El match de oportunidades ya está en proceso para esta ruta.",
      };
    }

    if (hasAlreadyMatched) {
      return {
        success: false,
        message: "Ya has realizado el match para este perfil.",
      };
    }

    // Trigger Inngest function
    await inngest.send({
      name: "cv/get-opportunities",
      data: {
        cvId,
        userId: currentUser.id,
      },
    });

    return { success: true, message: "Búsqueda de oportunidades iniciada." };
  } catch (error) {
    console.error("[ERROR_START_QUICK_MATCH_ACTION]", error);
    return { success: false, message: "Error inesperado al iniciar la búsqueda." };
  }
}
