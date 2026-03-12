"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { createRouteSchema } from "@/features/routes/schemas/route-schema";

/**
 * Creates a new route for the current user.
 * Deactivates all other routes and sets the new one as active.
 */
export const createRoute = async (name: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Usuario no encontrado." };

    const parsed = createRouteSchema.safeParse({ name });
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    // Deactivate all existing routes for this user
    await prisma.route.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Create the new route as active
    const route = await prisma.route.create({
      data: {
        name: parsed.data.name,
        userId: user.id,
        isActive: true,
      },
    });

    return { success: true, data: route };
  } catch (error) {
    console.error("[CREATE_ROUTE_ERROR]", error);
    return { success: false, message: "Error al crear la ruta." };
  }
};

