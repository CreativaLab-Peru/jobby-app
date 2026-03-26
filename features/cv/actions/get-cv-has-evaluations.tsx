
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Returns the active route for the current user (isActive: true).
 */
export const getCvHasEvaluations = async (cvId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const cv = await prisma.cv.findFirst({
      where: {
        id: cvId,
        userId: user.id
      },
      include: {
        evaluations: true
      }
    })
    if (!cv) {
      return false;
    }

    return  cv.evaluations.length !== 0;
  } catch (error) {
    console.error("[GET_ACTIVE_ROUTE_ERROR]", error);
    return false;
  }
};

export type ActiveRoute = NonNullable<Awaited<ReturnType<typeof getCvHasEvaluations>>>;

