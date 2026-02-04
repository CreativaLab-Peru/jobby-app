import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

/**
 * Detecta si el usuario actual se autenticó mediante OAuth (Google, etc.)
 * @returns {Promise<{isOAuth: boolean, provider?: string}>}
 */
export async function detectOAuthUser() {
  const prisma = new PrismaClient();
  
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { isOAuth: false };
    }

    // Verificar si el usuario tiene una cuenta OAuth vinculada en la base de datos
    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id,
      },
    });
    
    const oauthAccount = accounts.find(
      (account) => account.providerId !== "credential"
    );

    if (oauthAccount) {
      return {
        isOAuth: true,
        provider: oauthAccount.providerId,
      };
    }

    return { isOAuth: false };
  } catch (error) {
    console.error("Error detecting OAuth user:", error);
    return { isOAuth: false };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
}

/**
 * Verifica si un usuario necesita completar el onboarding
 * basado en si tiene preferencias configuradas
 */
export async function needsOnboarding(userId: string) {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const userPreference = await prisma.userPreference.findUnique({
      where: { userId },
    });

    // Si no tiene preferencias, necesita onboarding
    return !userPreference;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return true; // Por seguridad, asumir que necesita onboarding
  } finally {
    await prisma.$disconnect();
  }
}
