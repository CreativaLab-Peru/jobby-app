"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface DeleteCountryResult {
  success: boolean;
  message?: string;
}

export async function deleteCountryAction(
  countryId: string
): Promise<DeleteCountryResult> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { success: false, message: admin.error };
  }

  try {
    // Check if country exists
    const country = await prisma.country.findUnique({
      where: { id: countryId },
      include: {
        _count: {
          select: { opportunities: true },
        },
      },
    });

    if (!country) {
      return { success: false, message: "País no encontrado" };
    }

    // Check if country has scholarships
    if (country._count.opportunities > 0) {
      return {
        success: false,
        message: `No se puede eliminar. Este país tiene ${country._count.opportunities} beca(s) asociada(s)`,
      };
    }

    await prisma.country.delete({
      where: { id: countryId },
    });

    revalidatePath("/admin/countries");

    return {
      success: true,
      message: "País eliminado exitosamente",
    };
  } catch (error) {
    console.error("[deleteCountryAction]", error);
    return {
      success: false,
      message: "Error al eliminar el país",
    };
  }
}