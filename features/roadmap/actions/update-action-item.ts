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

  const items = [...(step.actionItems as {done: boolean, action: string}[])];
  items[actionIndex].done = isDone;

  await prisma.roadmapStep.update({
    where: { id: stepId },
    data: { actionItems: items },
  });

  revalidatePath("/my-roadmaps");
}
