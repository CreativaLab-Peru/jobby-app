"use server";

import { prisma } from "@/lib/prisma";
import { Language } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export async function updateCvLanguage(cvId: string, language: Language) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autorizado" };
    }

    await prisma.cv.update({
      where: {
        id: cvId,
        userId: currentUser.id,
      },
      data: { language },
    });

    // Revalidamos la ruta del CV para que los componentes de servidor
    // y el PDF reflejen el cambio de idioma (ej: etiquetas de secciones)
    revalidatePath(`/cv/${cvId}`);
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_CV_LANGUAGE_ERROR]", error);
    return { success: false, error: "No se pudo actualizar el idioma" };
  }
}
