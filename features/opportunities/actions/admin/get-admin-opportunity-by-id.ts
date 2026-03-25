"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, Opportunity, User, InterviewSession } from "@prisma/client";

export type AdminOpportunityDetail = Opportunity & {
  cv: Cv & {
    user: Pick<User, "id" | "email" | "name"> | null;
  };
  interviewSessions: InterviewSession[];
};

export type AdminOpportunityByIdResult =
  | { success: true; data: AdminOpportunityDetail }
  | { success: false; error: string };

export const getAdminOpportunityById = async (
  id: string,
  cvId: string
): Promise<AdminOpportunityByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id_cvId: { id, cvId } },
      include: {
        cv: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
        interviewSessions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!opportunity) {
      return { success: false, error: "Oportunidad no encontrada" };
    }

    const parsedOpp = JSON.parse(JSON.stringify(opportunity));

    return { success: true, data: parsedOpp as AdminOpportunityDetail };
  } catch (error) {
    console.error("[ADMIN_GET_OPPORTUNITY_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo oportunidad" };
  }
};

