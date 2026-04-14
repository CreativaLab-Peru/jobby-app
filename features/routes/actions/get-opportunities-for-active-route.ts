"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { JobStatus, Opportunity, RouteStatus } from "@prisma/client";

export type RouteOpportunity = Opportunity & {
  match: number;
  cv: { id: string; title: string };
};

export interface RouteOpportunityOptions {
  skip?: number;
  take?: number;
  query?: string;
}

/**
 * Gets opportunities scoped to the active route's CV.
 * No CV selector needed — always filters by the route's cvId.
 */
export const getOpportunitiesForActiveRoute = async (options: RouteOpportunityOptions = {}) => {
  const { skip = 0, take = 6, query } = options;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Get active route's cvId
    const activeRoute = await prisma.route.findFirst({
      where: { userId: user.id, isActive: true },
      select: {
        cvId: true,
        status: true,
        _count: {
          select: {
            opportunities: true,
          },
        },
      },
    });

    if (!activeRoute?.cvId) {
      return {
        opportunities: [],
        hasMore: false,
        totalCount: 0,
        hasCv: false,
        hasMatchedOnce: false,
        isMatchingInProgress: false,
      };
    }

    const whereClause: any = {
      cvId: activeRoute.cvId,
    };

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const [data, count, latestMatchJob] = await Promise.all([
      prisma.opportunity.findMany({
        where: whereClause,
        orderBy: [{ match: "desc" }, { createdAt: "desc" }],
        include: { cv: true },
        skip,
        take,
      }),
      prisma.opportunity.count({ where: whereClause }),
      prisma.queueJob.findFirst({
        where: {
          cvId: activeRoute.cvId,
          type: "GET_OPPORTUNITIES",
          status: {
            in: [JobStatus.IN_PROGRESS, JobStatus.SUCCEEDED],
          },
        },
        orderBy: { createdAt: "desc" },
        select: { status: true },
      }),
    ]);

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

    const routeHasExecutedMatch = statusesWithMatchExecuted.includes(activeRoute.status);
    const hasMatchedOnce =
      Boolean(latestMatchJob) || routeHasExecutedMatch || activeRoute._count.opportunities > 0;
    const isMatchingInProgress =
      latestMatchJob?.status === JobStatus.IN_PROGRESS ||
      activeRoute.status === RouteStatus.OPPORTUNITIES_PENDING;

    const opportunities = JSON.parse(
      JSON.stringify(
        data.map((opt) => ({
          ...opt,
          match: Number(opt.match),
          cv: { id: opt.cv.id, title: opt.cv.title },
          routeId: opt.routeId,
        })),
      ),
    ) as RouteOpportunity[];

    return {
      opportunities,
      hasMore: skip + take < count,
      totalCount: count,
      hasCv: true,
      hasMatchedOnce,
      isMatchingInProgress,
    };
  } catch (error) {
    console.error("[GET_OPPORTUNITIES_FOR_ACTIVE_ROUTE_ERROR]", error);
    return null;
  }
};
