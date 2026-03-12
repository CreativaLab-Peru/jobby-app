"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Gets all routes for the current user with CV summary data.
 */
export const getRoutesForUser = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, routes: [], message: "Usuario no encontrado." };

    const routes = await prisma.route.findMany({
      where: { userId: user.id },
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
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, routes };
  } catch (error) {
    console.error("[GET_ROUTES_FOR_USER_ERROR]", error);
    return { success: false, routes: [], message: "Error al obtener las rutas." };
  }
};

export type RouteWithCv = NonNullable<
  Awaited<ReturnType<typeof getRoutesForUser>>
>["routes"][number];

