"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { Cv, CvEvaluation, CvPreview, EvaluationScore, Recommendation } from "@prisma/client";

export type EvaluationWithRelations = CvEvaluation & {
  cv: Cv & {
    previews: CvPreview[];
  };
  scores: EvaluationScore[];
  recommendations: Recommendation[];
};

export interface RouteEvaluationOptions {
  skip?: number;
  take?: number;
  onlySuccessful?: boolean;
}

/**
 * Gets evaluations scoped to the active route's CV.
 * No CV selector needed — always filters by the route's cvId.
 */
export const getEvaluationsForActiveRoute = async (options: RouteEvaluationOptions = {}) => {
  const { skip = 0, take = 10, onlySuccessful = true } = options;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Get active route's cvId
    const activeRoute = await prisma.route.findFirst({
      where: { userId: user.id, isActive: true },
      select: { cvId: true },
    });

    if (!activeRoute?.cvId) {
      return { evaluations: [], hasMore: false, totalCount: 0, hasCv: false };
    }

    const whereFilter: any = {
      cvId: activeRoute.cvId,
      cv: { deletedAt: null },
      ...(onlySuccessful && { status: { not: "FAILED" } }),
    };

    const [evaluations, totalCount] = await Promise.all([
      prisma.cvEvaluation.findMany({
        where: whereFilter,
        skip,
        take,
        include: {
          cv: {
            include: {
              previews: { orderBy: { createdAt: "desc" }, take: 1 },
            },
          },
          scores: true,
          recommendations: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.cvEvaluation.count({ where: whereFilter }),
    ]);

    const formattedEvaluations: EvaluationWithRelations[] = evaluations.map((e) => ({
      ...e,
      cv: { ...e.cv, previews: e.cv.previews || [] },
      scores: e.scores || [],
      recommendations: e.recommendations || [],
    }));

    return {
      evaluations: formattedEvaluations,
      hasMore: skip + take < totalCount,
      totalCount,
      hasCv: true,
    };
  } catch (error) {
    console.error("[GET_EVALUATIONS_FOR_ACTIVE_ROUTE_ERROR]", error);
    return null;
  }
};

