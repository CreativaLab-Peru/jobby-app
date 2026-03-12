"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { Cv, CvEvaluation, CvPreview, CvSection, QueueJob, EvaluationScore, Recommendation } from "@prisma/client";

export type CvWithRelations = Cv & {
  evaluations: (CvEvaluation & {
    scores: EvaluationScore[];
    recommendations: Recommendation[];
  })[];
  sections: CvSection[];
  previews: CvPreview[];
  queueJobs: QueueJob[];
};

/**
 * Gets the CV linked to the active route, with full relations.
 * Returns a single CV (or null) since each route has exactly one CV.
 */
export const getCvForActiveRoute = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Find the active route for this user
    const activeRoute = await prisma.route.findFirst({
      where: { userId: user.id, isActive: true },
      select: { cvId: true },
    });

    if (!activeRoute?.cvId) {
      return { cv: null, routeHasCv: false };
    }

    const cv = await prisma.cv.findUnique({
      where: { id: activeRoute.cvId, deletedAt: null },
      include: {
        evaluations: {
          include: { scores: true, recommendations: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        sections: { orderBy: { order: "asc" } },
        previews: { orderBy: { createdAt: "desc" }, take: 1 },
        queueJobs: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    return { cv, routeHasCv: true };
  } catch (error) {
    console.error("[GET_CV_FOR_ACTIVE_ROUTE_ERROR]", error);
    return null;
  }
};

