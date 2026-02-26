"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateUsernameSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
});

export async function updateUsernameAction(formData: unknown) {
  const parsed = updateUsernameSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Nombre inválido",
    };
  }

  try {
    const response = await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: parsed.data.name,
      },
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

