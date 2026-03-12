"use server";

import { prisma } from "@/lib/prisma";
import { RouteStatus } from "@prisma/client";

/**
 * Updates the status of a route. Used internally to advance the stepper.
 */
export const updateRouteStatus = async (routeId: string, status: RouteStatus) => {
  try {
    const route = await prisma.route.update({
      where: { id: routeId },
      data: { status },
    });

    return { success: true, data: route };
  } catch (error) {
    console.error("[UPDATE_ROUTE_STATUS_ERROR]", error);
    return { success: false, message: "Error al actualizar el estado de la ruta." };
  }
};

