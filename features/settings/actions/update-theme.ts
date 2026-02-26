"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/authentication/actions/get-session";
import { cookies } from "next/headers";

export async function updateThemeAction(theme: "light" | "dark") {
  try {
    const session = await getSession();
    if (!session.success || !session.user) {
      return { success: false, error: "No autenticado" };
    }

    await prisma.userPreference.update({
      where: { userId: session.user.id },
      data: { theme },
    });

    // Escribir cookie (permitido en Server Actions)
    const cookieStore = await cookies();
    cookieStore.set("theme", theme, { path: "/", sameSite: "lax" });

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_THEME_ERROR]", error);
    return { success: false, error: "No se pudo guardar el tema" };
  }
}
