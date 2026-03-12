"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Lightweight status poll for roadmap generation progress.
 */
export async function getRoadmapStatus(
  opportunityId: string,
  cvId: string,
): Promise<{ status: string | null; roadmapId: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: null, roadmapId: null };

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        opportunityId_cvId_userId: {
          opportunityId,
          cvId,
          userId: user.id,
        },
      },
      select: { id: true, status: true },
    });

    return {
      status: roadmap?.status ?? null,
      roadmapId: roadmap?.id ?? null,
    };
  } catch {
    return { status: null, roadmapId: null };
  }
}

