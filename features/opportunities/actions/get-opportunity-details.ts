"use server";

import {prisma} from "@/lib/prisma";
import {parseRequirements} from "@/utils/parse-requirements";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export async function getOpportunityDetails(opportunityId: string, cvId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        cvId,
        cv: {
          userId: currentUser.id,
        }
      },
      include: {
        cv: true
      },
    });

    if (!opportunity) {
      return null;
    }

    // 1. Convertimos el Decimal a Number de JS inmediatamente
    const matchValue = Math.round(Number(opportunity.match) * 100);

    // 2. Creamos un objeto plano (Plain Old JavaScript Object)
    // Evitamos pasar el objeto 'opportunity' directamente para limpiar los Decimals y Dates
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
      requiredRequirements: opportunity.requiredRequirements,
      optionalRequirements: opportunity.optionalRequirements,

      cv: {
        id: opportunity.cv.id,
        title: opportunity.cv.title,
      }
    };
    console.log(sanitizedOpportunity);

    return sanitizedOpportunity;

  } catch (error) {
    console.error("[GET_OPPORTUNITY_DETAILS_ERROR]", error);
    return null;
  }
}
