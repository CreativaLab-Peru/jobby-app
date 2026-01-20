"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {talentOnboardingSchema} from "@/features/onboarding/schemas";

export async function completeTalentOnboardingAction(userId: string, rawData: unknown) {
  const validated = talentOnboardingSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Datos inválidos" };
  }

  const { data } = validated;

  try {
    await prisma.$transaction([
      // 1. Crear o actualizar preferencias
      prisma.userPreference.upsert({
        where: { userId },
        update: {
          minSalary: data.minSalary,
          currency: data.currency,
          work: data.work,
          availability: [data.availability], // Ajustado a tu esquema array
          preferredRoles: data.preferredRoles,
          targetIndustries: data.targetIndustries,
        },
        create: {
          userId,
          minSalary: data.minSalary,
          currency: data.currency,
          work: data.work,
          availability: [data.availability],
          preferredRoles: data.preferredRoles,
          targetIndustries: data.targetIndustries,
        },
      }),
      // 2. Marcar al usuario con el onboarding completado
      prisma.user.update({
        where: { id: userId },
        data: {
          // Aquí puedes usar un flag o actualizar el updatedAt
          updatedAt: new Date()
        }
      })
    ]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { error: "Error interno del servidor" };
  }
}
