"use server";

import { prisma } from "@/lib/prisma";
import { configSchema, ConfigInput } from "../types/config.schema";
import { revalidatePath } from "next/cache";

/**
 * READ: Obtiene todas las configuraciones del sistema
 */
export async function getConfigs() {
  try {
    return await prisma.appConfig.findMany({
      orderBy: { key: "asc" },
    });
  } catch (error) {
    console.error("Error fetching configs:", error);
    return [];
  }
}

/**
 * CREATE / UPDATE: Crea una nueva configuración o actualiza una existente
 */
export async function upsertConfig(id: string | undefined, data: ConfigInput) {
  const validated = configSchema.safeParse(data);
  if (!validated.success) {
    throw new Error("Datos inválidos");
  }

  try {
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
    return { success: true };
  } catch (error: any) {
    console.error("DEBUG - Error original en upsertConfig:", error);
    if (error.code === "P2002") {
      throw new Error("La clave ya existe");
    }
    throw new Error(`Error al guardar la configuración: ${error.message || "Error desconocido"}`);
  }
}

/**
 * DELETE: Elimina una configuración por su ID
 */
export async function deleteConfig(id: string) {
  try {
    await prisma.appConfig.delete({
      where: { id },
    });
    revalidatePath("/admin/configurations");
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar:", error);
    throw new Error("Error al eliminar la configuración");
  }
}
