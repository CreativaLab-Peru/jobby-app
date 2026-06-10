"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface CountryDetail {
  id: string;
  name: string;
  code: string;
  flag: string;
  createdAt: Date;
  updatedAt: Date;
  opportunities: {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    deadline: Date | null;
  }[];
}

export interface GetCountryByIdResult {
  success: boolean;
  data?: CountryDetail;
  error?: string;
}

export async function getCountryById(
  countryId: string
): Promise<GetCountryByIdResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, error: admin.error };
  }

  try {
    const country = await prisma.country.findUnique({
      where: { id: countryId },
      include: {
        opportunities: {
          select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
            deadline: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!country) {
      return { success: false, error: "País no encontrado" };
    }

    return { success: true, data: country };
  } catch (error) {
    console.error("[getCountryById]", error);
    return { success: false, error: "Error al obtener el país" };
  }
}