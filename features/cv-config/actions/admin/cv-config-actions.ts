// @/features/cv-config/actions/admin/cv-config-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { UpdateCvConfigSchema } from "../../types/admin-config.schema";

export async function getAdminCvConfigs() {
  const admin = await requireAdmin();
  if (!admin.success) throw new Error("No autorizado");

  return await prisma.cvSectionConfiguration.findMany({
    orderBy: [
      { cvType: 'asc' },
      { opportunityType: 'asc' }
    ]
  });
}

export async function updateCvSectionConfig(data: unknown) {
  const admin = await requireAdmin();
  if (!admin.success) return { success: false, error: "No autorizado" };

  const result = UpdateCvConfigSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Estructura de configuración inválida" };
  }

  try {
    await prisma.cvSectionConfiguration.update({
      where: { id: result.data.id },
      data: {
        sections: result.data.sections as any, // Cast a any para JSON de Prisma
      },
    });

    revalidatePath("/admin/cv-configs");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_CV_CONFIG_ERROR]", error);
    return { success: false, error: "Error al actualizar la base de datos" };
  }
}
