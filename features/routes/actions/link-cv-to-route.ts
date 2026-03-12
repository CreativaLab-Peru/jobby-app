"use server";

import { prisma } from "@/lib/prisma";
import { RouteStatus } from "@prisma/client";

/**
 * Links a CV to a route and advances status to CV_CREATED.
 */
export const linkCvToRoute = async (routeId: string, cvId: string) => {
  try {
    const route = await prisma.route.update({
      where: { id: routeId },
      data: {
        cvId,
        status: RouteStatus.CV_CREATED,
      },
    });

    return { success: true, data: route };
  } catch (error) {
    console.error("[LINK_CV_TO_ROUTE_ERROR]", error);
    return { success: false, message: "Error al vincular el CV a la ruta." };
  }
};

