"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { InterviewSession, User, Cv, Opportunity } from "@prisma/client";

export type AdminInterviewDetail = InterviewSession & {
  user: Pick<User, "id" | "email" | "name" | "image" | "role" | "createdAt">;
  cv: Pick<Cv, "id" | "title" | "opportunityType" | "cvType" | "userId" | "createdAt">;
  opportunity: Pick<Opportunity, "id" | "cvId" | "title" | "company" | "type" | "match" | "location" | "modality">;
};

export type AdminInterviewByIdResult =
  | { success: true; data: AdminInterviewDetail }
  | { success: false; error: string };

export const getAdminInterviewById = async (
  sessionId: string
): Promise<AdminInterviewByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const interview = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true, email: true, name: true, image: true,
            role: true, createdAt: true,
          },
        },
        cv: {
          select: {
            id: true, title: true, opportunityType: true, cvType: true,
            userId: true, createdAt: true,
          },
        },
        opportunity: {
          select: {
            id: true, cvId: true, title: true, company: true, type: true,
            match: true, location: true, modality: true,
          },
        },
      },
    });

    if (!interview) {
      return { success: false, error: "Entrevista no encontrada" };
    }

    const interviewParsed = JSON.parse(JSON.stringify(interview));

    return { success: true, data: interviewParsed as AdminInterviewDetail };
  } catch (error) {
    console.error("[ADMIN_GET_INTERVIEW_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo entrevista" };
  }
};

