"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TalentOnboardingFormData } from "@/features/onboarding/schemas";
import {createBasicCredits} from "@/features/credits/actions/create-basic-credits";
import { Prisma } from "@prisma/client";

const hasCompletedOnboardingPreference = (pref: {
  preferredRoles: string[];
  targetIndustries: string[];
  workModality: string[];
  availability: string[];
  opportunityTypes: string[];
  skills: unknown[];
  expLevel: string | null;
  portfolioUrl: string | null;
  minSalary: unknown;
  maxSalary: unknown;
  relocation: boolean;
} | null) => {
  if (!pref) return false;

  return (
    pref.preferredRoles.length > 0 ||
    pref.targetIndustries.length > 0 ||
    pref.workModality.length > 0 ||
    pref.availability.length > 0 ||
    pref.opportunityTypes.length > 0 ||
    pref.skills.length > 0 ||
    Boolean(pref.expLevel) ||
    Boolean(pref.portfolioUrl) ||
    pref.minSalary !== null ||
    pref.maxSalary !== null ||
    pref.relocation === true
  );
};

export async function completeOnboardingDebugAction(id: string, body: TalentOnboardingFormData) {
  const data = body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: "Usuario no encontrado." };
    }

    let onboardingAlreadyCompleted = false;

    // Usamos una transacción serializable para evitar carreras en doble submit.
    await prisma.$transaction(async (tx) => {
      const existingPreference = await tx.userPreference.findUnique({
        where: { userId: user.id },
        select: {
          preferredRoles: true,
          targetIndustries: true,
          workModality: true,
          availability: true,
          opportunityTypes: true,
          skills: true,
          expLevel: true,
          portfolioUrl: true,
          minSalary: true,
          maxSalary: true,
          relocation: true,
        },
      });

      if (hasCompletedOnboardingPreference(existingPreference)) {
        onboardingAlreadyCompleted = true;
        return;
      }

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
          opportunityTypes: data.opportunityTypes,
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
          opportunityTypes: data.opportunityTypes,
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          birthday: new Date(data.birthDate)
        },
      });

      if (data.beca && data.beca.trim().length > 0) {
        const existingBeca = await tx.userBecaParam.findFirst({
          where: {
            userId: user.id,
            beca: data.beca.trim(),
            usedAt: null,
          },
        });

        if (!existingBeca) {
          await tx.userBecaParam.create({
            data: {
              userId: user.id,
              beca: data.beca.trim(),
            },
          });
        }
      }

      const creditsResult = await createBasicCredits(user.id, tx);
      if (!creditsResult) {
        throw new Error("CREDITS_GRANT_FAILED");
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    if (onboardingAlreadyCompleted) {
      return { error: "El onboarding ya fue completado." };
    }

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
