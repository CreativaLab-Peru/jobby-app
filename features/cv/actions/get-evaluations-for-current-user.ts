"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export const geEvaluationsForCurrentUser = async (skip = 0, take = 10) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Definimos el filtro base para reutilizarlo en la consulta y en el count
    const whereFilter = {
      userId: user.id,
      deletedAt: null,
      evaluations: {
        some: {}
      }
    };

    const cvs = await prisma.cv.findMany({
      where: whereFilter,
      skip,
      take,
      include: {
        evaluations: {
          include: {
            scores: true,
            recommendations: true
          },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        // Mantenemos los demás includes para la UI
        sections: { orderBy: { order: "asc" } },
        previews: { orderBy: { createdAt: "desc" }, take: 1 },
        queueJobs: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const totalCount = await prisma.cv.count({
      where: whereFilter
    });

    return {
      cvs,
      hasMore: skip + take < totalCount,
      totalCount
    };
  } catch (error) {
    console.error("[GET_EVALUATIONS_ERROR]", error);
    return null;
  }
};
