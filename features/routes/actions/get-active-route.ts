"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Returns the active route for the current user (isActive: true).
 */
export const getActiveRoute = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const route = await prisma.route.findFirst({
      where: { userId: user.id, isActive: true },
      include: {
        cv: {
          select: {
            id: true,
            title: true,
            cvType: true,
            opportunityType: true,
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
      },
    });

    return route;
  } catch (error) {
    console.error("[GET_ACTIVE_ROUTE_ERROR]", error);
    return null;
  }
};
