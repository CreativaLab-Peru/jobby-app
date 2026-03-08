"use server";

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { User } from "@prisma/client";

export type RequireAdminResult =
  | { success: true; user: User, error: null }
  | { success: false; error: string };

export const requireAdmin = async (): Promise<RequireAdminResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    if (user.role !== "ADMIN") {
      return { success: false, error: "Acceso solo para administradores" };
    }

    return { success: true, user, error: null };
  } catch (error) {
    console.error("[REQUIRE_ADMIN_ERROR]", error);
    return { success: false, error: "Error validando permisos" };
  }
};

