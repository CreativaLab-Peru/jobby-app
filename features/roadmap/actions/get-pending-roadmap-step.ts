"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/features/authentication/actions/get-user";

export type PendingStepInfo = {
  id: string;
  title: string;
  roadmapId: string;
  totalItems: number;
  doneItems: number;
} | null;

export async function getPendingRoadmapStep(): Promise<PendingStepInfo> {
  const user = await getUser();
  if (!user) return null;

  // 1. Buscamos el roadmap activo del usuario a través de su ruta activa
  const roadmap = await prisma.roadmap.findFirst({
    where: {
      userId: user.id,
      route: { isActive: true }
    },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!roadmap || !roadmap.steps.length) return null;

  // 2. Buscamos el primer paso que tenga al menos un actionItem pendiente
  for (const step of roadmap.steps) {
    const items = (step.actionItems as { done: boolean, action: string }[]) || [];
    const doneItems = items.filter((item: any) => item.done).length;

    if (doneItems < items.length) {
      return {
        id: step.id,
        title: step.title,
        roadmapId: roadmap.id,
        totalItems: items.length,
        doneItems: doneItems,
      };
    }
  }

  return null;
}
