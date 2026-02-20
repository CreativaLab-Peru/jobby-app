"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/authentication/actions/get-session";
import { parseRequirements } from "@/utils/parse-requirements";

export async function getOpportunityDetails(id: string) {
  try {
    const session = await getSession();

    if (!session.success || !session.user?.id) {
      return { error: "No autorizado", status: 401 };
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: { id },
      include: { cv: true },
    });

    if (!opportunity) {
      return { error: "Oportunidad no encontrada", status: 404 };
    }

    if (opportunity.cv.userId !== session.user.id) {
      return { error: "No tienes permiso", status: 403 };
    }

    const matchValue = Math.round(Number(opportunity.match) * 100);

    const sanitizedOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      company: opportunity.company,
      location: opportunity.location,
      modality: opportunity.modality,
      salary: opportunity.salary,
      description: opportunity.description,
      benefits: opportunity.benefits,
      linkUrl: opportunity.linkUrl,
      type: opportunity.type,
      // Convertimos fechas a string para evitar errores de serialización
      createdAt: opportunity.createdAt.toISOString(),
      // Mapeamos los campos calculados
      matchValue,
      isHighMatch: matchValue >= 80,
      formattedDeadline: opportunity.deadline
        ? new Date(opportunity.deadline).toLocaleDateString('es-ES')
        : null,
      requirements: opportunity.requirements
        ? parseRequirements(opportunity.requirements)
        : { required: null, optional: null },
    };

    return {
      success: true,
      data: sanitizedOpportunity
    };

  } catch (error) {
    console.error("[GET_OPPORTUNITY_DETAILS_ERROR]", error);
    return { error: "Error interno", status: 500 };
  }
}
