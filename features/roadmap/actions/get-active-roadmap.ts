"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { JobStatus } from "@/enums";

/**
 * Checks if the current user has an active roadmap generation (PENDING or IN_PROGRESS).
 * This is used to redirect the user to the processing screen if a generation is already running.
 */
export async function getActiveRoadmap() {
  const user = await getCurrentUser();
  if (!user) return null;

  const activeRoadmap = await prisma.roadmap.findFirst({
    where: {
      userId: user.id,
      status: {
        in: [JobStatus.IN_PROGRESS, JobStatus.PENDING],
      },
    },
    select: {
      id: true,
    },
  });

  return activeRoadmap;
}
