"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export const deleteOpportunity = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    await prisma.scholarshipOpportunity.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("[ERROR_DELETE_OPPORTUNITY]", error);
    return { success: false, error: "Error al eliminar la oportunidad" };
  }
};
