"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Lightweight status poll for roadmap generation progress.
 */
export async function getRoadmapStatus(
  opportunityId: string,
  cvId: string,
  routeId?: string | null,
): Promise<{ status: string | null; roadmapId: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: null, roadmapId: null };

    let usedRouteId = routeId;
    if (!usedRouteId) {
      const route = await prisma.route.findFirst({
        where: {
          isActive: true,
          userId: user.id,
        }
      });
      if (!route) return { status: null, roadmapId: null };
      usedRouteId = route.id;
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        opportunityId_cvId_userId_routeId: {
          opportunityId,
          cvId,
          userId: user.id,
          routeId: usedRouteId,
        },
      },
      select: {
        id: true,
        status: true,
        createdByJobId: true,
        _count: { select: { steps: true } },
      },
    });

    if (
      roadmap &&
      roadmap.status === "IN_PROGRESS" &&
      roadmap.createdByJobId &&
      roadmap._count.steps > 0
    ) {
      const job = await prisma.queueJob.findUnique({
        where: { id: roadmap.createdByJobId },
        select: { status: true },
      });

      if (job?.status === "SUCCEEDED") {
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { status: "SUCCEEDED" },
        });

        return {
          status: "SUCCEEDED",
          roadmapId: roadmap.id,
        };
      }
    }

    return {
      status: roadmap?.status ?? null,
      roadmapId: roadmap?.id ?? null,
    };
  } catch {
    return { status: null, roadmapId: null };
  }
}

