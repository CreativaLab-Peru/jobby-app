"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { ScholarshipType } from "@prisma/client";

export const createOpportunity = async (data: {
  countryId: string;
  name: string;
  type: ScholarshipType;
  requirements: string[];
  benefits: string[];
  deadline?: Date;
  url: string;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const opportunity = await prisma.scholarshipOpportunity.create({
      data: {
        countryId: data.countryId,
        name: data.name,
        type: data.type,
        requirements: data.requirements,
        benefits: data.benefits,
        deadline: data.deadline,
        url: data.url,
        isActive: true,
      },
    });

    return { success: true, opportunity };
  } catch (error) {
    console.error("[ERROR_CREATE_OPPORTUNITY]", error);
    return { success: false, error: "Error al crear la oportunidad" };
  }
};
