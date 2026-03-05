"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/features/authentication/actions/get-session";
import { updateUsernameSchema, type UpdateUsernameValues } from "@/features/settings/schemas/update-username.schema";

export async function updateUsernameAction(formData: UpdateUsernameValues) {
  const parsed = updateUsernameSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Nombre inválido",
    };
  }

  try {
    const session = await getSession();
    if (!session.success || !session.user) {
      return { success: false, error: "No autenticado." };
    }

    const response = await auth.api.updateUser({
      headers: await headers(),
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


