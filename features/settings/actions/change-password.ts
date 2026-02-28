"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Debes confirmar la nueva contraseña"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
        code: "custom",
      });
    }
  });

export async function changePasswordAction(formData: unknown) {
  // Verificar sesión una sola vez y reutilizarla
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return { success: false, error: "No autenticado." };
  }

  // Verificar si el usuario tiene una cuenta OAuth (Google, etc.) usando el cliente prisma compartido
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

  const parsed = changePasswordSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Devolver el primer error encontrado
    const firstError =
      fieldErrors.currentPassword?.[0] ||
      fieldErrors.newPassword?.[0] ||
      fieldErrors.confirmPassword?.[0] ||
      "Datos inválidos";
    return { success: false, error: firstError, fieldErrors };
  }

  try {
    await auth.api.changePassword({
      headers: reqHeaders,
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: false,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);

    // Better Auth devuelve mensajes específicos en algunos errores
    const message =
      error?.body?.message ||
      error?.message ||
      "No se pudo actualizar la contraseña. Verifica que la contraseña actual sea correcta.";

    return { success: false, error: message };
  }
}

