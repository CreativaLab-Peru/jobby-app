"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export type RoadmapStepData = {
  id: string;
  order: number;
  title: string;
  description: string;
  actionItems: { done: boolean, action: string }[];
  estimatedDays: number | null;
  resources: { title: string; url?: string; type: string }[];
  isFree: boolean;
};

export type RoadmapData = {
  id: string;
  title: string | null;
  summary: string | null;
  status: string;
  createdAt: string;
  steps: RoadmapStepData[];
} | null;

/**
 * Fetches the roadmap for a specific opportunity+cv combo for the current user.
 */
export async function getRoadmapForOpportunity(
  opportunityId: string,
  cvId: string,
): Promise<RoadmapData> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const route = await prisma.route.findFirst({
      where: {
        isActive: true,
        userId: user.id,
      }
    })
    if (!route) return null;

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        opportunityId_cvId_userId_routeId: {
          opportunityId,
          cvId,
          userId: user.id,
          routeId: route.id,
        },
      },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!roadmap) return null;

    return {
      id: roadmap.id,
      title: roadmap.title,
      summary: roadmap.summary,
      status: roadmap.status,
      createdAt: roadmap.createdAt.toISOString(),
      steps: roadmap.steps.map((s) => ({
        id: s.id,
        order: s.order,
        title: s.title,
        description: s.description,
        actionItems: (s.actionItems as {done: boolean, action: string}[]) || [],
        estimatedDays: s.estimatedDays,
        resources: (s.resources as { title: string; url?: string; type: string }[]) || [],
        isFree: s.isFree,
      })),
    };
  } catch (error) {
    console.error("[GET_ROADMAP_ERROR]", error);
    return null;
  }
}

