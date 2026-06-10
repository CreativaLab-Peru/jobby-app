"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { ScholarshipType } from "@prisma/client";

export const listOpportunities = async (filters?: {
  countryId?: string;
  type?: ScholarshipType;
  isActive?: boolean;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const opportunities = await prisma.scholarshipOpportunity.findMany({
      where: {
        ...(filters?.countryId && { countryId: filters.countryId }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: { country: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, opportunities };
  } catch (error) {
    console.error("[ERROR_LIST_OPPORTUNITIES]", error);
    return { success: false, error: "Error al listar las oportunidades" };
  }
};
