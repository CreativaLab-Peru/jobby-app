"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/authentication/actions/get-session";
import { cookies } from "next/headers";

export async function updateThemeAction(theme: "light" | "dark") {
  try {
    // Escribir cookie siempre, incluso si el usuario no está autenticado,
    // para evitar el flash claro→oscuro en el SSR al recargar la página.
    const cookieStore = await cookies();
    cookieStore.set("theme", theme, { path: "/", sameSite: "lax" });

    // Solo persistir en BD si hay sesión activa
    const session = await getSession();
    if (session.success && session.user) {
      await prisma.userPreference.upsert({
        where: { userId: session.user.id },
        update: { theme },
        create: { userId: session.user.id, theme },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_THEME_ERROR]", error);
    return { success: false, error: "No se pudo guardar el tema" };
  }
}
