"use server";

import { prisma } from "@/lib/prisma";
import { configSchema, ConfigInput } from "../types/config.schema";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type UpsertConfigResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * CREATE / UPDATE: Crea una nueva configuración o actualiza una existente
 * Requiere permisos de admin
 */
export async function upsertConfig(
  id: string | undefined,
  data: ConfigInput,
): Promise<UpsertConfigResult> {
  try {
    // Validar que el usuario es admin
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return { success: false, error: adminCheck.error };
    }

    // Validar datos de entrada
    const validated = configSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Datos inválidos" };
    }

    if (id && id.trim() !== "") {
      await prisma.appConfig.update({
        where: { id },
        data: {
          key: validated.data.key,
          value: validated.data.value,
        },
      });
    } else {
      await prisma.appConfig.create({
        data: {
          key: validated.data.key,
          value: validated.data.value,
        },
      });
    }

    revalidatePath("/admin/configurations");
    return { success: true, message: "Configuración guardada exitosamente" };
  } catch (error: any) {
    console.error("DEBUG - Error original en upsertConfig:", error);
    if (error.code === "P2002") {
      return { success: false, error: "La clave ya existe" };
    }
    return {
      success: false,
      error: `Error al guardar la configuración: ${error.message || "Error desconocido"}`,
    };
  }
}
