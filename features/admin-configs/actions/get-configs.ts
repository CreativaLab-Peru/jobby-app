"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { AppConfig } from "@prisma/client";

export type GetConfigsResult =
  | { success: true; data: AppConfig[] }
  | { success: false; error: string };

/**
 * READ: Obtiene todas las configuraciones del sistema
 * Requiere permisos de admin
 */
export async function getConfigs(): Promise<GetConfigsResult> {
  try {
    // Validar que el usuario es admin
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return { success: false, error: adminCheck.error };
    }

    const configs = await prisma.appConfig.findMany({
      orderBy: { key: "asc" },
    });

    return { success: true, data: configs };
  } catch (error) {
    console.error("Error fetching configs:", error);
    return { success: false, error: "Error al obtener configuraciones" };
  }
}
