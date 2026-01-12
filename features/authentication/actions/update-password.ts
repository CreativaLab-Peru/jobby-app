"use server"

import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export const updatePassword = async (password: string) => {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      console.error("[ERROR_UPDATE_PASSWORD] User not found");
      return
    }

    await auth.api.changePassword({
      body: {
        currentPassword: "ASDJKBAasd@asdni123",
        newPassword: password
      }
    });

    await auth.api.signInEmail({
      body: {
        email: currentUser.email,
        password: password,
      },
      asResponse: true
    });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente ✅",
    }

  } catch (error) {
    console.error("[ERROR_UPDATE_PASSWORD]", error);
    return {
      success: false,
      message: "Hubo un error al actualizar la contraseña.",
    }
  }
}
