"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteConfigResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * DELETE: Elimina una configuración por su ID
 * Requiere permisos de admin
 */
export async function deleteConfig(id: string): Promise<DeleteConfigResult> {
  try {
    // Validar que el usuario es admin
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return { success: false, error: adminCheck.error };
    }

    // Verificar que la configuración existe
    const existing = await prisma.appConfig.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Configuración no encontrada" };
    }

    await prisma.appConfig.delete({
      where: { id },
    });

    revalidatePath("/admin/configurations");
    return { success: true, message: "Configuración eliminada exitosamente" };
  } catch (error: any) {
    console.error("Error al eliminar configuración:", error);
    return { success: false, error: "Error al eliminar la configuración" };
  }
}
