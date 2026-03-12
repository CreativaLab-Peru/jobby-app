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

export const getCVsForOpportunities = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const route = await prisma.route.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
    })
    console.log("[route]", route);

    if (!route) return null;

    const cv = await prisma.cv.findMany({
      where: {
        id: route.cvId,
      },
      include: {
        evaluations: {
          include: { scores: true, recommendations: true },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        sections: { orderBy: { order: "asc" } },
        previews: { orderBy: { createdAt: "desc" }, take: 1 },
        queueJobs: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { createdAt: "desc" }
    });

    // Contamos el total para saber si hay más páginas
    const totalCount = await prisma.cv.count({
      where: { userId: user.id, deletedAt: null }
    });

    return {
      cvs: [cv],
      hasMore: false,
      totalCount
    };
  } catch (error) {
    console.error("[GET_CV_FOR_CURRENT_USER_ERROR]", error);
    return null;
  }
};
