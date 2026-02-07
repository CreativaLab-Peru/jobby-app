"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TalentOnboardingFormData } from "@/features/onboarding/schemas";
import { inngest } from "@/inngest/functions/client";
import { generateNumericCode } from "@/utils/digicts";
import {createBasicCredits} from "@/features/credits/actions/create-basic-credits";

export async function completeOnboardingAction(id: string, body: TalentOnboardingFormData) {
  const data = body;

  try {
    const codeSixDigits = generateNumericCode();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: "Usuario no encontrado." };
    }

    // Usamos una transacción para asegurar que todo se cree correctamente
    await prisma.$transaction(async (tx) => {
      // 1. Guardar preferencias
      await tx.userPreference.upsert({
        where: { userId: user.id },
        update: {
          minSalary: data.minSalary,
          currency: data.currency,
          workModality: data.workModality,
          availability: data.availability,
          preferredRoles: data.preferredRoles,
          targetIndustries: data.targetIndustries,
          expLevel: data.expLevel,
          portfolioUrl: data.portfolioUrl,
          skills: data.skills,
          relocation: data.relocation,
        },
        create: {
          userId: user.id,
          minSalary: data.minSalary,
          currency: data.currency,
          workModality: data.workModality,
          availability: data.availability,
          preferredRoles: data.preferredRoles,
          targetIndustries: data.targetIndustries,
          expLevel: data.expLevel,
          portfolioUrl: data.portfolioUrl,
          skills: data.skills,
          relocation: data.relocation,
        },
      });

      // 2. Crear el código de verificación
      // await tx.verificationCode.create({
      //   data: {
      //     userId: user.id,
      //     code: codeSixDigits,
      //     expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
      //   },
      // });

      // 3. Update user birthday (solo si existe y es válida)
      const updateData: any = {
        name: data.name,
      };

      if (data.birthDate && data.birthDate.trim() !== '') {
        const birthDate = new Date(data.birthDate);
        if (!isNaN(birthDate.getTime())) {
          updateData.birthday = birthDate;
        }
      }

      await tx.user.update({
        where: { id: user.id },
        data: updateData,
      });
    });

    // 3. Enviar evento a Inngest (fuera de la tx para evitar bloqueos)
    // if (!user.emailVerified) {
    //   await inngest.send({
    //     name: "send.verification.code",
    //     data: {
    //       email: data.email, // Asegúrate que 'data.email' venga en el body
    //       name: data.name,
    //       codeSixDigits,
    //     }
    //   });
    // }

    // Create basic credits for the user
    await createBasicCredits(user.id);

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error: any) {
    console.error("Registration Error:", error);
    if (error.code === 'P2002') {
      return { error: "Este correo electrónico ya está registrado." };
    }
    return { error: "Error interno al procesar el registro." };
  }
}
