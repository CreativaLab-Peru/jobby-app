"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { RouteStatus } from "@prisma/client";

// Definimos un tipo para mayor claridad
export interface ActionItem {
  done: boolean;
  action: string;
}

export async function toggleActionItem(
  stepId: string,
  actionIndex: number,
  isDone: boolean
) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return { error: "Unauthorized" };

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Obtener el step dentro de la transacción
      const step = await tx.roadmapStep.findUnique({
        where: { id: stepId },
        select: { actionItems: true, roadmapId: true }
      });

      if (!step) throw new Error("Step not found");

      const actionsItems = step.actionItems as unknown as ActionItem[];
      const items = [...actionsItems];

      // 2. Validación de índice para evitar crashes
      if (!items[actionIndex]) throw new Error("Invalid action index");

      // 3. Actualizar solo si el estado es diferente (Optimización)
      if (items[actionIndex].done === isDone) return { success: true };

      items[actionIndex].done = isDone;

      // 4. Actualizar el Step
      await tx.roadmapStep.update({
        where: { id: stepId },
        data: { actionItems: items as any },
      });

      // 5. Lógica de verificación de completitud
      const allDone = items.every(item => item.done);

      if (allDone) {
        const activeRoute = await tx.route.findFirst({
          where: {
            isActive: true,
            userId: currentUser.id,
          }
        });

        if (activeRoute) {
          await tx.route.update({
            where: { id: activeRoute.id },
            data: { status: RouteStatus.ROADMAP_DONE }
          });
        }
      }

      revalidatePath("/my-roadmaps");
      return { success: true };
    });
  } catch (error) {
    console.error("[ERROR_TOGGLE_ACTION_ITEM]", error);
    return { error: "Internal Server Error" };
  }
}
