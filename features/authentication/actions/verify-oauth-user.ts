"use server";

import { prisma } from "@/lib/prisma";
import { createBasicCredits } from "@/features/credits/actions/create-basic-credits";

/**
 * Verifica automáticamente el email de usuarios OAuth y les otorga créditos
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


    // Si ya está verificado, otorgar créditos de onboarding una sola vez
    if (user.emailVerified) {
      console.log("[INFO] Usuario verificado, otorgando créditos de onboarding si aún no los recibió...");
      const creditsResult = await createBasicCredits(userId);
      if (creditsResult.status === "error") {
        return { error: "Error al otorgar créditos" };
      }

      console.log("[INFO] Resultado de otorgar créditos:", creditsResult);
      return {
        success: true,
        alreadyVerified: true,
        creditsAdded: creditsResult.status === "granted",
      };
    }

    // Marcar como verificado
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Otorgar créditos básicos
    const creditsResult = await createBasicCredits(userId);

    if (creditsResult.status === "error") {
      return { error: "Error al otorgar créditos" };
    }

    return { success: true, alreadyVerified: false };

  } catch (error) {
    return { error: "Error al verificar usuario OAuth" };
  }
}
