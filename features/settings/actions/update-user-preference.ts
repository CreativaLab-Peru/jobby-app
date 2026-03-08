"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { revalidatePath } from "next/cache";

export interface UpdateUserPreferenceInput {
  country?: string;
  targetIndustries?: string[];
  preferredRoles?: string[];
  expLevel?: string;
  workModality?: string[];
  relocation?: boolean;
  availability?: string[];
  opportunityTypes?: string[];
  skills?: { name: string; level: string }[];
  portfolioUrl?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string;
}

export type UpdateUserPreferenceResult =
  | { success: true }
  | { success: false, error: string };

export const updateUserPreference = async (
  input: UpdateUserPreferenceInput
): Promise<UpdateUserPreferenceResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "No autenticado." };
    }

    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        country: input.country,
        targetIndustries: input.targetIndustries,
        preferredRoles: input.preferredRoles,
        expLevel: input.expLevel,
        workModality: input.workModality,
        relocation: input.relocation,
        availability: input.availability,
        opportunityTypes: input.opportunityTypes,
        skills: input.skills,
        portfolioUrl: input.portfolioUrl,
        minSalary: input.minSalary,
        maxSalary: input.maxSalary,
        currency: input.currency,
      },
      create: {
        userId: user.id,
        country: input.country,
        targetIndustries: input.targetIndustries ?? [],
        preferredRoles: input.preferredRoles ?? [],
        expLevel: input.expLevel,
        workModality: input.workModality ?? [],
        relocation: input.relocation ?? false,
        availability: input.availability ?? [],
        opportunityTypes: input.opportunityTypes ?? [],
        skills: input.skills ?? [],
        portfolioUrl: input.portfolioUrl,
        minSalary: input.minSalary,
        maxSalary: input.maxSalary,
        currency: input.currency ?? "USD",
      },
    });

    revalidatePath("/preferences");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_USER_PREFERENCE_ERROR]", error);
    return { success: false, error: "Error actualizando preferencias." };
  }
};
