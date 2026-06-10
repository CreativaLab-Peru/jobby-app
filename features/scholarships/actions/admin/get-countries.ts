"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface CountryListItem {
  id: string;
  name: string;
  code: string;
  flag: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    opportunities: number;
  };
}

export interface GetCountriesResult {
  success: boolean;
  data?: CountryListItem[];
  error?: string;
}

export async function getCountries(): Promise<GetCountriesResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, error: admin.error };
  }

  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { opportunities: true },
        },
      },
    });

    return { success: true, data: countries };
  } catch (error) {
    console.error("[getCountries]", error);
    return { success: false, error: "Error al obtener los países" };
  }
}