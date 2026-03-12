"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * Sets a specific route as active (deactivates all others).
 */
export const setActiveRoute = async (routeId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Usuario no encontrado." };

    // Verify the route belongs to this user
    const route = await prisma.route.findFirst({
      where: { id: routeId, userId: user.id },
    });

    if (!route) {
      return { success: false, message: "Ruta no encontrada." };
    }

    // Transaction: deactivate all, activate target
    await prisma.$transaction([
      prisma.route.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      }),
      prisma.route.update({
        where: { id: routeId },
        data: { isActive: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("[SET_ACTIVE_ROUTE_ERROR]", error);
    return { success: false, message: "Error al cambiar la ruta activa." };
  }
};

