"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export const updateCountry = async (
  id: string,
  data: {
    name?: string;
    code?: string;
    flag?: string;
  }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const country = await prisma.country.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code.toUpperCase() }),
        ...(data.flag && { flag: data.flag }),
      },
    });

    return { success: true, country };
  } catch (error) {
    console.error("[ERROR_UPDATE_COUNTRY]", error);
    return { success: false, error: "Error al actualizar el pais" };
  }
};
