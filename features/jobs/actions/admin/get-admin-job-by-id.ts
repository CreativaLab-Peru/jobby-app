"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { QueueJob, Cv } from "@prisma/client";

export type AdminJobDetail = QueueJob & {
  cv: Pick<Cv, "id" | "title" | "opportunityType" | "cvType" | "userId" | "createdAt"> | null;
};

export type AdminJobByIdResult =
  | { success: true; data: AdminJobDetail }
  | { success: false; error: string };

export const getAdminJobById = async (
  jobDbId: string
): Promise<AdminJobByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const job = await prisma.queueJob.findUnique({
      where: { id: jobDbId },
      include: {
        cv: {
          select: {
            id: true,
            title: true,
            opportunityType: true,
            cvType: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!job) {
      return { success: false, error: "Job no encontrado" };
    }

    return { success: true, data: job as AdminJobDetail };
  } catch (error) {
    console.error("[ADMIN_GET_JOB_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo job" };
  }
};

