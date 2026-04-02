"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {newUserConfiguration} from "@/features/authentication/actions/new-user-configuration";
import {createBasicCredits} from "@/features/credits/actions/create-basic-credits";

export async function verifyCodeAction(userId: string, code: string) {
  try {
    // 1. Buscar el código en la BD
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
      },
    });

    // 2. Validaciones
    if (!verificationRecord) {
      return { error: "El código es incorrecto." };
    }

    if (new Date() > verificationRecord.expiresAt) {
      return { error: "El código ha expirado. Solicita uno nuevo." };
    }

    // 3. Marcar usuario como verificado y limpiar el código
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      }),
      prisma.verificationCode.delete({
        where: { id: verificationRecord.id },
      }),
    ]);

    // Todo: deprecated
    // await newUserConfiguration(userId);

    // Create basic credits for the user
    const creditsResult = await createBasicCredits(userId);
    if (creditsResult.status === "error") {
      return { error: "Error al otorgar créditos" };
    }

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Verification Error:", error);
    return { error: "Ocurrió un error inesperado al verificar." };
  }
}
