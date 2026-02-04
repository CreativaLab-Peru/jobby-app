"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TalentOnboardingFormData } from "@/features/onboarding/schemas";
import {createBasicCredits} from "@/features/credits/actions/create-basic-credits";

export async function completeOnboardingDebugAction(id: string, body: TalentOnboardingFormData) {
  const data = body;

  try {
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
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          birthday: new Date(data.birthDate)
        },
      })
    });

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
