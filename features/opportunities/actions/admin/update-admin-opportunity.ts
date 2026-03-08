"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { OpportunityType } from "@prisma/client";

export type UpdateAdminOpportunityResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminOpportunityInput {
  title?: string;
  description?: string | null;
  company?: string | null;
  requirements?: string;
  linkUrl?: string;
  location?: string | null;
  modality?: string | null;
  salary?: string | null;
  benefits?: string | null;
  type?: OpportunityType;
  deadline?: string | null;
}

export const updateAdminOpportunity = async (
  id: string,
  cvId: string,
  input: UpdateAdminOpportunityInput
): Promise<UpdateAdminOpportunityResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.opportunity.findUnique({
      where: { id_cvId: { id, cvId } },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Oportunidad no encontrada" };
    }

    const data: Record<string, unknown> = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.company !== undefined) data.company = input.company;
    if (input.requirements !== undefined) data.requirements = input.requirements;
    if (input.linkUrl !== undefined) data.linkUrl = input.linkUrl;
    if (input.location !== undefined) data.location = input.location;
    if (input.modality !== undefined) data.modality = input.modality;
    if (input.salary !== undefined) data.salary = input.salary;
    if (input.benefits !== undefined) data.benefits = input.benefits;
    if (input.type !== undefined) data.type = input.type;
    if (input.deadline !== undefined) {
      data.deadline = input.deadline ? new Date(input.deadline) : null;
    }

    await prisma.opportunity.update({
      where: { id_cvId: { id, cvId } },
      data,
    });

    revalidatePath("/admin/opportunities");
    revalidatePath(`/admin/opportunities/${id}`);

    return { success: true, message: "Oportunidad actualizada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_OPPORTUNITY_ERROR]", error);
    return { success: false, error: "Error actualizando oportunidad" };
  }
};

