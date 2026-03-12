"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { Opportunity } from "@prisma/client";

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
      select: { cvId: true },
    });

    if (!activeRoute?.cvId) {
      return { opportunities: [], hasMore: false, totalCount: 0, hasCv: false };
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

    const [data, count] = await Promise.all([
      prisma.opportunity.findMany({
        where: whereClause,
        orderBy: [{ match: "desc" }, { createdAt: "desc" }],
        include: { cv: true },
        skip,
        take,
      }),
      prisma.opportunity.count({ where: whereClause }),
    ]);

    const opportunities = JSON.parse(
      JSON.stringify(
        data.map((opt) => ({
          ...opt,
          match: Number(opt.match),
          cv: { id: opt.cv.id, title: opt.cv.title },
        })),
      ),
    ) as RouteOpportunity[];

    return {
      opportunities,
      hasMore: skip + take < count,
      totalCount: count,
      hasCv: true,
    };
  } catch (error) {
    console.error("[GET_OPPORTUNITIES_FOR_ACTIVE_ROUTE_ERROR]", error);
    return null;
  }
};

