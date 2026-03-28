
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {getActiveRoute} from "@/features/routes/actions/get-active-route";

export type RouteDossier = {
  success: true;
  data: {
    routeName: string;
    routeStatus: string;
    userName: string;
    cv: {
      id: string;
      title: string;
      score: number;
    };
    opportunity?: {
      title: string;
      company: string;
      match: number;
    };
    roadmap?: {
      title: string;
      stepsCount: number;
    };
  };
} | { success: false; error: string };

export const getRouteDossier = async (): Promise<RouteDossier> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "No autorizado" };

    const activeRoute = await getActiveRoute();
    if (!activeRoute) return { success: false, error: "No autorizado" };

    const routeId = activeRoute.id;

    // Partimos desde la Ruta como eje central
    const route = await prisma.route.findUnique({
      where: {
        id: routeId,
        userId: user.id
      },
      include: {
        user: { select: { name: true } },
        cv: {
          include: {
            evaluations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { overallScore: true }
            }
          }
        },
        // Traemos la oportunidad que hizo match para el roadmap
        opportunities: {
          where: { roadmaps: { some: { routeId } } },
          take: 1,
          select: { title: true, company: true, match: true }
        },
        roadmaps: {
          where: { routeId },
          select: {
            title: true,
            _count: { select: { steps: true } }
          }
        }
      }
    });

    if (!route || !route.cv) {
      return { success: false, error: "No se encontró una ruta activa con CV" };
    }

    return {
      success: true,
      data: {
        routeName: route.name,
        routeStatus: route.status,
        userName: route.user.name || "Candidato",
        cv: {
          id: route.cv.id,
          title: route.cv.title || "CV Principal",
          score: route.cv.evaluations[0]?.overallScore || 0,
        },
        opportunity: route.opportunities[0] ? {
          title: route.opportunities[0].title,
          company: route.opportunities[0].company || "N/A",
          match: Number(route.opportunities[0].match) * 100, // Convertimos a porcentaje
        } : undefined,
        roadmap: route.roadmaps[0] ? {
          title: route.roadmaps[0].title || "Plan de Carrera",
          stepsCount: route.roadmaps[0]._count.steps
        } : undefined
      }
    };
  } catch (error) {
    console.error("[GET_ROUTE_DOSSIER_ERROR]", error);
    return { success: false, error: "Error al obtener el dossier de la ruta" };
  }
};
