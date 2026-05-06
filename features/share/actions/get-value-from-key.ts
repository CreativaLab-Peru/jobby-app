"use server";

import { prisma } from "@/lib/prisma";

/**
 * Obtiene el valor de una configuración de la tabla AppConfig por su clave.
 * @param key La clave de la configuración a buscar.
 * @returns El valor de la configuración o null si no existe.
 */
export async function getValueFromKey(key: string): Promise<string | null> {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key },
      select: { value: true },
    });

    return config?.value ?? null;
  } catch (error) {
    console.error(`[GET_VALUE_FROM_KEY_ERROR] Key: ${key}`, error);
    return null;
  }
}
