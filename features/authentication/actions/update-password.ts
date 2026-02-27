"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const updatePassword = async (password: string) => {
  try {
    const reqHeaders = await headers();

    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      console.error("[ERROR_UPDATE_PASSWORD] User not found");
      return { success: false, message: "No autenticado." };
    }

    await auth.api.setPassword({
      headers: reqHeaders,
      body: { newPassword: password },
    });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente ✅",
    };

  } catch (error) {
    console.error("[ERROR_UPDATE_PASSWORD]", error);
    return {
      success: false,
      message: "Hubo un error al actualizar la contraseña.",
    };
  }
}

