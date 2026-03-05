"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/authentication/actions/get-session";
import { changePasswordSchema, type ChangePasswordValues } from "@/features/settings/schemas/change-password.schema";

// Mensajes de error de Better Auth (better-call APIError) traducidos al español
const BETTER_AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid password": "La contraseña actual es incorrecta.",
  "Password too short": "La nueva contraseña es demasiado corta.",
  "Password too long": "La nueva contraseña es demasiado larga.",
  "User not found": "Usuario no encontrado.",
  "Failed to get session": "No se pudo obtener la sesión. Vuelve a iniciar sesión.",
};

function extractBetterAuthMessage(error: unknown): string | null {
  if (
    error != null &&
    typeof error === "object" &&
    "body" in error &&
    error.body != null &&
    typeof error.body === "object" &&
    "message" in error.body
  ) {
    return String(error.body.message);
  }
  return null;
}

export async function changePasswordAction(formData: ChangePasswordValues) {
  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.currentPassword?.[0] ||
      fieldErrors.newPassword?.[0] ||
      fieldErrors.confirmPassword?.[0] ||
      "Datos inválidos";
    return { success: false, error: firstError, fieldErrors };
  }

  try {
    const session = await getSession();
    if (!session.success || !session.user) {
      return { success: false, error: "No autenticado." };
    }

    const oauthAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        NOT: { providerId: "credential" },
      },
      select: { id: true },
    });

    if (oauthAccount) {
      return {
        success: false,
        error: "Los usuarios con cuenta de Google no pueden cambiar la contraseña.",
      };
    }

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: false,
      },
    });

    return { success: true };
  } catch (error) {
    const apiMessage = extractBetterAuthMessage(error);
    const message =
      (apiMessage && BETTER_AUTH_ERROR_MESSAGES[apiMessage]) ||
      apiMessage ||
      "No se pudo actualizar la contraseña. Intenta nuevamente.";

    return { success: false, error: message };
  }
}
