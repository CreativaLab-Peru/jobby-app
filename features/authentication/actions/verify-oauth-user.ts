"use server";

import { prisma } from "@/lib/prisma";
import { createBasicCredits } from "@/features/credits/actions/create-basic-credits";

/**
 * Verifica automáticamente el email de usuarios OAuth y les otorga créditos
 * ya que los proveedores OAuth (Google, etc.) ya verifican el email
 */
export async function verifyOAuthUser(userId: string) {
  console.log("[INFO] Iniciando verificación de usuario OAuth:", userId);
  
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

    console.log("[INFO] Usuario encontrado. Cuentas:", user.accounts.length);
    console.log("[INFO] Balance de créditos actual:", user.userCreditBalance.length);

    // Verificar si tiene una cuenta OAuth (no credential)
    const hasOAuthAccount = user.accounts.some(
      account => account.providerId !== "credential"
    );

    if (!hasOAuthAccount) {
      console.error("[ERROR] No es un usuario OAuth:", userId);
      return { error: "No es un usuario OAuth" };
    }

    console.log("[INFO] Usuario OAuth confirmado");

    // Si ya está verificado, verificar si tiene créditos
    if (user.emailVerified) {
      console.log("[INFO] Usuario OAuth ya verificado:", userId);
      
      // Verificar si ya tiene créditos
      const hasCredits = user.userCreditBalance.length > 0;
      if (!hasCredits) {
        console.log("[INFO] Usuario verificado pero sin créditos, otorgándolos...");
        const creditsResult = await createBasicCredits(userId);
        console.log("[INFO] Resultado de otorgar créditos:", creditsResult);
        return { success: true, alreadyVerified: true, creditsAdded: true };
      }
      
      return { success: true, alreadyVerified: true, creditsAdded: false };
    }

    console.log("[INFO] Marcando usuario como verificado...");

    // Marcar como verificado
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    console.log("[INFO] Usuario marcado como verificado");
    console.log("[INFO] Otorgando créditos básicos...");

    // Otorgar créditos básicos
    const creditsResult = await createBasicCredits(userId);
    
    console.log("[INFO] Resultado de otorgar créditos:", creditsResult);

    if (!creditsResult) {
      console.error("[ERROR] No se pudieron otorgar los créditos");
      return { error: "Error al otorgar créditos" };
    }

    console.log("[SUCCESS] Usuario OAuth verificado y créditos otorgados:", userId);
    return { success: true, alreadyVerified: false };

  } catch (error) {
    console.error("[ERROR_VERIFY_OAUTH_USER]", error);
    return { error: "Error al verificar usuario OAuth" };
  }
}
