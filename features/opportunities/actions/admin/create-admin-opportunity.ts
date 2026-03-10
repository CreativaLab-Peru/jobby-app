"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { OpportunityType } from "@prisma/client";
import { randomUUID } from "crypto";

export type CreateAdminOpportunityResult =
  | { success: true; id: string; message: string }
  | { success: false; error: string };

export interface CreateAdminOpportunityInput {
  cvId: string;
  title: string;
  type: OpportunityType;
  requirements: string;
  linkUrl: string;
  description?: string | null;
  company?: string | null;
  location?: string | null;
  modality?: string | null;
  salary?: string | null;
  benefits?: string | null;
  deadline?: string | null;
}

export const createAdminOpportunity = async (
  input: CreateAdminOpportunityInput
): Promise<CreateAdminOpportunityResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const cvExists = await prisma.cv.findUnique({
      where: { id: input.cvId },
      select: { id: true },
    });

    if (!cvExists) {
      return { success: false, error: "El CV seleccionado no existe." };
    }

    const id = randomUUID();

    await prisma.opportunity.create({
      data: {
        id,
        cvId: input.cvId,
        title: input.title,
        type: input.type,
        requirements: input.requirements,
        linkUrl: input.linkUrl,
        match: 0,
        description: input.description ?? null,
        company: input.company ?? null,
        location: input.location ?? null,
        modality: input.modality ?? null,
        salary: input.salary ?? null,
        benefits: input.benefits ?? null,
        deadline: input.deadline ? new Date(input.deadline) : null,
      },
    });

    revalidatePath("/admin/opportunities");

    return { success: true, id, message: "Oportunidad creada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_CREATE_OPPORTUNITY_ERROR]", error);
    return { success: false, error: "Error al crear la oportunidad" };
  }
};
