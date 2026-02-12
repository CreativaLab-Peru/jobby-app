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

export const getCvForCurrentUser = async (skip = 0, take = 10) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const cvs = await prisma.cv.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        createdByJobId: null
      },
      skip, // Salta los registros ya cargados
      take, // Trae solo la siguiente tanda
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
      cvs,
      hasMore: skip + take < totalCount,
      totalCount
    };
  } catch (error) {
    console.error("[GET_CV_FOR_CURRENT_USER_ERROR]", error);
    return null;
  }
};
