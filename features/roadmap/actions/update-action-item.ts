"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleActionItem(
  stepId: string,
  actionIndex: number,
  isDone: boolean
) {
  const step = await prisma.roadmapStep.findUnique({ where: { id: stepId } });
  if (!step) return;

  const items = [...(step.actionItems as any[])];
  items[actionIndex].done = isDone;

  await prisma.roadmapStep.update({
    where: { id: stepId },
    data: { actionItems: items },
  });

  revalidatePath("/roadmap"); // Ajusta a tu ruta
}
