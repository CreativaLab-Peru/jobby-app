"use server";

import { prisma } from "@/lib/prisma";

/**
 * Verifica automáticamente el email de usuarios OAuth.
 * Los créditos básicos se otorgan al completar onboarding.
 * ya que los proveedores OAuth (Google, etc.) ya verifican el email
 */
export async function verifyOAuthUser(userId: string) {

  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true, userCreditBalance: true },
    });

    if (!user) {
      console.error("[ERROR] Usuario no encontrado:", userId);
      return { error: "Usuario no encontrado" };
    }

    // Verificar si tiene una cuenta OAuth (no credential)
    const hasOAuthAccount = user.accounts.some(
      account => account.providerId !== "credential"
    );

    if (!hasOAuthAccount) {
      console.error("[ERROR] No es un usuario OAuth:", userId);
      return { error: "No es un usuario OAuth" };
    }

    // Si ya está verificado, no hay más acciones necesarias aquí.
    if (user.emailVerified) {
      return {
        success: true,
        alreadyVerified: true,
        creditsAdded: false,
      };
    }

    // Marcar como verificado
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return { success: true, alreadyVerified: false };

  } catch (error) {
    return { error: "Error al verificar usuario OAuth" };
  }
}
