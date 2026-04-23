"use server";

import {prisma} from "@/lib/prisma";
import {parseRequirements} from "@/utils/parse-requirements";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import { getFirstUserPayment } from "@/features/billing/actions/get-first-user-payment";
import { UserRole } from "@prisma/client";

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

    // Revisión de permisos
    const userPayment = await getFirstUserPayment();
    const hasSubscription = Boolean(
      userPayment?.subscription && ["starter", "pro"].includes(userPayment.subscription.plan.slug),
    );
    const hasFullAccess = hasSubscription;

    let isLocked = false;
    if (!hasFullAccess) {
      // Busca la primera oportunidad para este CV/Ruta para comprobar si es la única permitida para los usuarios gratuitos
      const firstOpportunity = await prisma.opportunity.findFirst({
        where: { cvId: opportunity.cvId },
        orderBy: [{ match: "desc" }, { createdAt: "desc" }],
        select: { id: true }
      });
      
      if (firstOpportunity && firstOpportunity.id !== opportunity.id) {
        isLocked = true;
      }
    }

    // 1. Convertimos el Decimal a Number de JS inmediatamente
    const matchValue = Math.round(Number(opportunity.match) * 100);

    // 2. Creamos un objeto plano (Plain Old JavaScript Object)
    // Evitamos pasar el objeto 'opportunity' directamente para limpiar los Decimals y Dates
    const sanitizedOpportunity = {
      id: opportunity.id,
      routeId: opportunity.routeId ?? null,
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
      requiredRequirements: opportunity.requiredRequirements || [],
      optionalRequirements: opportunity.optionalRequirements || [],

      cv: {
        id: opportunity.cv.id,
        title: opportunity.cv.title,
      },
      isLocked
    };

    if (isLocked) {
      return {
        ...sanitizedOpportunity,
        title: "Contenido Bloqueado",
        company: "Empresa Protegida",
        description: "Actualiza tu plan para ver los detalles de esta oportunidad.",
        location: "Ubicación Oculta",
        linkUrl: "#",
        benefits: [],
        requiredRequirements: [],
        optionalRequirements: [],
      };
    }
    console.log(sanitizedOpportunity);

    return sanitizedOpportunity;

  } catch (error) {
    console.error("[GET_OPPORTUNITY_DETAILS_ERROR]", error);
    return null;
  }
}
