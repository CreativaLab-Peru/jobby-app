"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {Route} from "@prisma/client";

export type CvSummaryInRoute = {
  id: string;
  title: string | null;
  cvType: string | null;
  opportunityType: string | null;
  createdAt: Date;
  evaluations: {
    id: string;
    status: string;
    overallScore: number | null;
  }[];
  _count: {
    opportunities: number;
  };
};

/**
 * Interfaz de progreso del Roadmap calculada en el servidor
 */
export interface RoadmapProgress {
  totalSteps: number;
  completedSteps: number;
  totalActions: number;
  completedActions: number;
}

/**
 * TIPO FINAL: El que usarás en el Store, Sidebar y Selectores
 */
export type RouteWithCvSummary = Route & {
  cv: CvSummaryInRoute | null;
  roadmapProgress?: RoadmapProgress;
};

/**
 * Obtiene todas las rutas del usuario con sumario de CV y progreso real del roadmap.
 */
export const getRoutesForUser = async (): Promise<{
  success: boolean;
  routes: RouteWithCvSummary[];
  message?: string
}> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, routes: [], message: "Usuario no encontrado." };

    const routesRaw = await prisma.route.findMany({
      where: {
        userId: user.id,
      },
      include: {
        cv: {
          select: {
            id: true,
            title: true,
            cvType: true,
            opportunityType: true,
            createdAt: true,
            evaluations: {
              select: { id: true, status: true, overallScore: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
            _count: {
              select: { opportunities: true },
            },
          },
        },
        // Incluimos el roadmap activo para calcular progreso
        roadmaps: {
          where: { status: { not: "FAILED" } },
          select: {
            steps: {
              select: {
                actionItems: true,
              },
            },
          },
          take: 1,
        }
      },
      orderBy: { updatedAt: "desc" }, // Ordenar por actividad reciente
    });

    // Mapeo dinámico para calcular el progreso de los actionItems
    const routes: RouteWithCvSummary[] = routesRaw.map((route) => {
      const roadmap = route.roadmaps?.[0];
      let roadmapProgress = undefined;

      if (roadmap && roadmap.steps.length > 0) {
        let totalActions = 0;
        let completedActions = 0;
        let completedSteps = 0;

        roadmap.steps.forEach((step) => {
          const items = (step.actionItems as any[]) || [];
          const stepTotal = items.length;
          const stepDone = items.filter((i) => i.done).length;

          totalActions += stepTotal;
          completedActions += stepDone;

          // Un paso se considera completado solo si tiene items y todos están done
          if (stepTotal > 0 && stepTotal === stepDone) {
            completedSteps++;
          }
        });

        roadmapProgress = {
          totalSteps: roadmap.steps.length,
          completedSteps,
          totalActions,
          completedActions,
        };
      }

      return {
        ...route,
        roadmapProgress,
      };
    });

    return { success: true, routes };
  } catch (error) {
    console.error("[GET_ROUTES_FOR_USER_ERROR]", error);
    return { success: false, routes: [], message: "Error al obtener las rutas." };
  }
};
