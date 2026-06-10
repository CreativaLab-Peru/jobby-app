"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { ScholarshipType } from "@prisma/client";

export interface ScholarshipListItem {
  id: string;
  name: string;
  type: ScholarshipType;
  isActive: boolean;
  deadline: Date | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  country: {
    id: string;
    name: string;
    code: string;
    flag: string;
  };
}

export interface GetScholarshipsResult {
  success: boolean;
  data?: ScholarshipListItem[];
  error?: string;
}

export async function getScholarships(): Promise<GetScholarshipsResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, error: admin.error };
  }

  try {
    const scholarships = await prisma.scholarshipOpportunity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
            flag: true,
          },
        },
      },
    });

    return { success: true, data: scholarships };
  } catch (error) {
    console.error("[getScholarships]", error);
    return { success: false, error: "Error al obtener las becas" };
  }
}