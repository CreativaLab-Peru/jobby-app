"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export const createCountry = async (data: {
  name: string;
  code: string;
  flag: string;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const country = await prisma.country.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        flag: data.flag,
      },
    });

    return { success: true, country };
  } catch (error) {
    console.error("[ERROR_CREATE_COUNTRY]", error);
    return { success: false, error: "Error al crear el pais" };
  }
};
