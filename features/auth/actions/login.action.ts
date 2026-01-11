"use server";

import { loginSchema } from "../schemas/login-schema";
import { authClient } from "@/lib/auth-client";

const errorMapper: Record<string, string> = {
  "Invalid password": "Contraseña incorrecta",
  "User not found": "Usuario no encontrado",
  "Email not verified": "Correo electrónico no verificado",
  "Too many requests": "Demasiadas solicitudes, intenta más tarde",
  "Invalid email or password": "Correo electrónico o contraseña inválidos",
};

export async function loginAction(input: unknown) {
  const parsed = await loginSchema.safeParseAsync(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const response = await authClient.signIn.email({
    email,
    password,
  });

  if (response.error) {
    return {
      success: false,
      formError:
        errorMapper[response.error.message] ??
        "Error al iniciar sesión",
    };
  }

  return { success: true };
}
