"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { ScholarshipType } from "@prisma/client";

export const updateOpportunity = async (
  id: string,
  data: {
    countryId?: string;
    name?: string;
    type?: ScholarshipType;
    requirements?: string[];
    benefits?: string[];
    deadline?: Date;
    url?: string;
    isActive?: boolean;
  }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const opportunity = await prisma.scholarshipOpportunity.update({
      where: { id },
      data: {
        ...(data.countryId && { countryId: data.countryId }),
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.benefits && { benefits: data.benefits }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
        ...(data.url && { url: data.url }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return { success: true, opportunity };
  } catch (error) {
    console.error("[ERROR_UPDATE_OPPORTUNITY]", error);
    return { success: false, error: "Error al actualizar la oportunidad" };
  }
};
