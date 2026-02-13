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

export type EvaluationFilterOptions = {
  skip?: number;
  take?: number;
  cvId?: string; // Nuevo: Filtrar por un CV específico
  search?: string; // Nuevo: Búsqueda por título o contenido
};

export const geEvaluationsForCurrentUser = async (options: EvaluationFilterOptions = {}) => {
  const { skip = 0, take = 10, cvId, search } = options;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // CONSTRUCCIÓN DINÁMICA DEL FILTRO (Ingeniería de Consultas)
    const whereFilter: any = {
      cv: {
        userId: user.id,
        deletedAt: null,
        // Si hay un cvId, filtramos por él
        ...(cvId && { id: cvId }),
        // Si hay búsqueda, buscamos en el título del CV
        ...(search && {
          title: {
            contains: search,
            mode: 'insensitive', // Ignorar mayúsculas/minúsculas
          }
        }),
      }
    };

    // Ejecución en paralelo para optimizar performance (KISS & Fast)
    const [evaluations, totalCount] = await Promise.all([
      prisma.cvEvaluation.findMany({
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
        orderBy: { createdAt: "desc" }
      }),
      prisma.cvEvaluation.count({ where: whereFilter })
    ]);

    // Mapeo limpio (Ingeniería de Datos)
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
    };
  } catch (error) {
    console.error("[GET_EVALUATIONS_ERROR]", error);
    return null;
  }
};
