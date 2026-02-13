"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {Cv, CvEvaluation, CvPreview, EvaluationScore, Recommendation} from "@prisma/client";

export type EvaluationWithRelations = CvEvaluation & {
  cv: Cv & {
    previews: CvPreview[]; // Prisma siempre devuelve array en relaciones some/many
  };
  scores: EvaluationScore[]; // Array, no objeto único
  recommendations: Recommendation[]; // Array, no objeto único
};

export const geEvaluationsForCurrentUser = async (skip = 0, take = 10) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Filtro centrado en la EVALUACIÓN
    const whereFilter: any = {
      cv: {
        userId: user.id,
        deletedAt: null,
      }
    };

    // Consultamos directamente la tabla de evaluaciones
    const evaluations = await prisma.cvEvaluation.findMany({
      where: whereFilter,
      skip,
      take,
      include: {
        cv: {
          include: {
            previews: {
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        },
        scores: true,
        recommendations: true
      },
      orderBy: {
        createdAt: "desc" // La más reciente siempre primero
      }
    });

    const totalCount = await prisma.cvEvaluation.count({
      where: whereFilter
    });

    const formattedEvaluations: EvaluationWithRelations[] = evaluations.map(evaluation => ({
      ...evaluation,
      cv: {
        ...evaluation.cv,
        previews: evaluation.cv.previews || []
      },
      scores: evaluation.scores || [],
      recommendations: evaluation.recommendations || []
    }));

    return {
      hasMore: skip + take < totalCount,
      totalCount,
      evaluations: formattedEvaluations,
    }
  } catch (error) {
    console.error("[GET_EVALUATIONS_ERROR]", error);
    return null;
  }
};
