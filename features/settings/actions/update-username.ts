"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateUsernameSchema, type UpdateUsernameValues } from "@/features/settings/schemas/update-username.schema";

export async function updateUsernameAction(formData: UpdateUsernameValues) {
  // Validar
  const parsed = updateUsernameSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Nombre inválido",
    };
  }

  try {
    // Verificar sesión
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      return { success: false, error: "No autenticado." };
    }

    // Actualizar nombre
    const response = await auth.api.updateUser({
      headers: reqHeaders,
      body: { name: parsed.data.name },
    });

    if (!response) {
      return { success: false, error: "No se pudo actualizar el nombre." };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_USERNAME_ERROR]", error);
    return { success: false, error: "Ocurrió un error al actualizar el nombre." };
  }
}
