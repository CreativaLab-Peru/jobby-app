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
    userEmail: string; // Nuevo: Para el mensaje de WhatsApp y PDF
    cv: {
      id: string;
      title: string;
      score: number;
    };
    // Cambiamos a plural para mostrar el listado completo en el PDF
    opportunities: Array<{
      title: string;
      company: string;
      match: number;
      deadline?: string; // Nuevo: Para la lógica de "upcomingDeadlines"
    }>;
    roadmap?: {
      title: string;
      stepsCount: number;
      // Podrías incluir los títulos de los pasos si quieres más valor en el PDF
    };
  };
} | { success: false; error: string };

export const getRouteDossier = async (): Promise<RouteDossier> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "No autorizado" };

    const activeRoute = await getActiveRoute();
    if (!activeRoute || !activeRoute.id) return { success: false, error: "No hay ruta activa" };

    const route = await prisma.route.findUnique({
      where: { id: activeRoute.id, userId: user.id },
      include: {
        user: { select: { name: true, email: true } }, // Traemos el email
        cv: {
          include: {
            evaluations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { overallScore: true }
            }
          }
        },
        // Traemos todas las oportunidades de esta ruta para el PDF
        opportunities: {
          select: {
            title: true,
            company: true,
            match: true,
            deadline: true // Importante para el orden de prioridad
          }
        },
        roadmaps: {
          select: {
            title: true,
            _count: { select: { steps: true } }
          }
        }
      }
    });

    console.log("[OPPORTUNITIES.LENGTH", route.opportunities.length);

    if (!route || !route.cv) {
      return { success: false, error: "Datos incompletos" };
    }

    return {
      success: true,
      data: {
        routeName: route.name,
        routeStatus: route.status,
        userName: route.user.name || "Candidato",
        userEmail: route.user.email || "", // Mapeo del nuevo campo
        cv: {
          id: route.cv.id,
          title: route.cv.title || "CV Principal",
          score: route.cv.evaluations[0]?.overallScore || 0,
        },
        opportunities: route.opportunities.map(opp => ({
          title: opp.title,
          company: opp.company || "N/A",
          match: Math.round(Number(opp.match) * 100),
          deadline: opp.deadline?.toISOString() // Convertimos a string para el cliente
        })),
        roadmap: route.roadmaps[0] ? {
          title: route.roadmaps[0].title || "Plan de Carrera",
          stepsCount: route.roadmaps[0]._count.steps
        } : undefined
      }
    };
  } catch (error) {
    console.error("[GET_ROUTE_DOSSIER_ERROR]", error);
    return { success: false, error: "Error de servidor" };
  }
};
