"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { CVData } from "@/types/cv";
import { Cv, CvSectionType } from "@prisma/client";

export type AdminUpdateCvResult =
  | { success: true; data: Cv }
  | { success: false; error: string };

export const updateAdminCvAndSections = async (
  id: string,
  cvData: CVData
): Promise<AdminUpdateCvResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      }
    }

    const existingCv = await prisma.cv.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingCv) {
      return { success: false, error: "CV no encontrado" };
    }

    const newSections = buildSections(cvData);

    const existingSections = await prisma.cvSection.findMany({
      where: { cvId: existingCv.id },
    });

    for (const section of newSections) {
      const existing = existingSections.find(
        (s) => s.sectionType === section.sectionType
      );

      if (existing) {
        await prisma.cvSection.update({
          where: { id: existing.id },
          data: {
            title: section.title,
            contentJson: section.contentJson,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.cvSection.create({
          data: {
            cvId: existingCv.id,
            sectionType: section.sectionType,
            title: section.title,
            contentJson: section.contentJson,
          },
        });
      }
    }

    const newTypes = newSections.map((s) => s.sectionType);
    const toDelete = existingSections.filter(
      (s) => !newTypes.includes(s.sectionType)
    );

    if (toDelete.length > 0) {
      await prisma.cvSection.deleteMany({
        where: { id: { in: toDelete.map((s) => s.id) } },
      });
    }

    return { success: true, data: existingCv };
  } catch (error) {
    console.error("[ADMIN_UPDATE_CV_ERROR]", error);
    return { success: false, error: "Error actualizando CV" };
  }
};

function buildSections(cvData: CVData) {
  const sections: { sectionType: CvSectionType; contentJson; title?: string }[] = [];

  if (cvData.personal) {
    sections.push({
      sectionType: CvSectionType.SUMMARY,
      title: "Resumen",
      contentJson: { text: cvData.personal.summary ?? "" },
    });
  }

  if (cvData.experience?.items?.length) {
    sections.push({
      sectionType: CvSectionType.EXPERIENCE,
      title: "Experience",
      contentJson: cvData.experience.items,
    });
  }

  if (cvData.education?.items?.length) {
    sections.push({
      sectionType: CvSectionType.EDUCATION,
      title: "Education",
      contentJson: cvData.education.items,
    });
  }

  if (cvData.skills) {
    sections.push({
      sectionType: CvSectionType.SKILLS,
      title: "Skills",
      contentJson: cvData.skills,
    });
  }

  if (cvData.projects?.items?.length) {
    sections.push({
      sectionType: CvSectionType.PROJECTS,
      title: "Projects",
      contentJson: cvData.projects.items,
    });
  }

  if (cvData.certifications?.items?.length) {
    sections.push({
      sectionType: CvSectionType.CERTIFICATIONS,
      title: "Certifications",
      contentJson: cvData.certifications.items,
    });
  }

  if (cvData.volunteering?.items?.length) {
    sections.push({
      sectionType: CvSectionType.VOLUNTEERING,
      title: "Volunteering",
      contentJson: cvData.volunteering.items,
    });
  }

  if (cvData.achievements?.items?.length) {
    sections.push({
      sectionType: CvSectionType.ACHIEVEMENTS,
      title: "Achievements",
      contentJson: cvData.achievements.items,
    });
  }

  if (cvData.personal) {
    sections.push({
      sectionType: CvSectionType.CONTACT,
      title: "Contact Info",
      contentJson: {
        fullName: cvData.personal.fullName,
        email: cvData.personal.email,
        phone: cvData.personal.phone,
        address: cvData.personal.address,
        linkedin: cvData.personal.linkedin,
      },
    });
  }

  return sections;
}

