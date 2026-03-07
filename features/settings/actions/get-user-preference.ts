"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { UserPreference } from "@prisma/client";

export type UserPreferenceResult =
  | { success: true; data: UserPreference }
  | { success: false; error: string };

export const getUserPreference = async (): Promise<UserPreferenceResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "No autenticado." };
    }

    let preference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });

    if (!preference) {
      preference = await prisma.userPreference.create({
        data: { userId: user.id },
      });
    }

    const preferenceParsed = JSON.parse(JSON.stringify(preference));

    return { success: true, data: preferenceParsed as UserPreference };
  } catch (error) {
    console.error("[GET_USER_PREFERENCE_ERROR]", error);
    return { success: false, error: "Error obteniendo preferencias." };
  }
};

