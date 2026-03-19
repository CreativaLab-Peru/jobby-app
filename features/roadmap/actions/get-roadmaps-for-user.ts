"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export type RoadmapListItem = {
  id: string;
  title: string | null;
  summary: string | null;
  status: string;
  stepsCount: number;
  totalDays: number;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    company: string | null;
    type: string;
    cvId: string;
  };
};

interface GetRoadmapsParams {
  skip?: number;
  take?: number;
  query?: string;
}

export async function getRoadmapsForUser(params: GetRoadmapsParams = {}) {
  const { skip = 0, take = 10, query } = params;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const activeRoute = await prisma.route.findFirst({
      where: {
        isActive: true,
      }
    })

    if (!activeRoute) return null;

    const where: any = {
      userId: user.id,
      status: "SUCCEEDED",
      routeId: activeRoute.id,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { opportunity: { title: { contains: query, mode: "insensitive" } } },
      ];
    }

    const [roadmaps, totalCount] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              company: true,
              type: true,
              cvId: true,
            },
          },
          steps: {
            select: { id: true, estimatedDays: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.roadmap.count({ where }),
    ]);

    const items: RoadmapListItem[] = roadmaps.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      status: r.status,
      stepsCount: r.steps.length,
      totalDays: r.steps.reduce((sum, s) => sum + (s.estimatedDays ?? 0), 0),
      createdAt: r.createdAt.toISOString(),
      opportunity: {
        id: r.opportunity.id,
        title: r.opportunity.title,
        company: r.opportunity.company,
        type: r.opportunity.type,
        cvId: r.opportunity.cvId,
      },
    }));

    return {
      roadmaps: items,
      totalCount,
      hasMore: skip + take < totalCount,
    };
  } catch (error) {
    console.error("[GET_ROADMAPS_FOR_USER_ERROR]", error);
    return null;
  }
}

