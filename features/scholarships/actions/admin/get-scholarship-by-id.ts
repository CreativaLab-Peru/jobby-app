"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface ScholarshipDetail {
  id: string;
  name: string;
  type: string;
  requirements: string[];
  benefits: string[];
  deadline: Date | null;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  country: {
    id: string;
    name: string;
    code: string;
    flag: string;
  };
}

export interface GetScholarshipByIdResult {
  success: boolean;
  data?: ScholarshipDetail;
  error?: string;
}

export async function getScholarshipById(
  scholarshipId: string
): Promise<GetScholarshipByIdResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, error: admin.error };
  }

  try {
    const scholarship = await prisma.scholarshipOpportunity.findUnique({
      where: { id: scholarshipId },
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

    if (!scholarship) {
      return { success: false, error: "Beca no encontrada" };
    }

    return { success: true, data: scholarship };
  } catch (error) {
    console.error("[getScholarshipById]", error);
    return { success: false, error: "Error al obtener la beca" };
  }
}