"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, CvType, Language, OpportunityType } from "@prisma/client";
import { getDefaultCvSections } from "@/features/cv/actions/admin/default-cv-sections";

export type AdminCreateCvResult =
  | { success: true; data: Cv }
  | { success: false, error: string };

export const createAdminCv = async (params: {
  userIdentifier: string;
  title: string;
  cvType: CvType;
  opportunityType: OpportunityType;
  language?: Language;
}): Promise<AdminCreateCvResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: params.userIdentifier },
          { email: params.userIdentifier },
        ],
      },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const defaultSections = getDefaultCvSections();

    const newCv = await prisma.cv.create({
      data: {
        title: params.title,
        cvType: params.cvType,
        opportunityType: params.opportunityType,
        language: params.language ?? Language.EN,
        userId: user.id,
        sections: {
          create: defaultSections.map((section) => ({
            sectionType: section.sectionType,
            title: section.title,
            contentJson: section.contentJson,
            order: section.order,
          })),
        },
      },
    });

    return { success: true, data: newCv };
  } catch (error) {
    console.error("[ADMIN_CREATE_CV_ERROR]", error);
    return { success: false, error: "Error creando CV" };
  }
};
