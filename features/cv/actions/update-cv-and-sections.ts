"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CVData } from "@/types/cv";
import { CvSectionType, Cv } from "@prisma/client";

export const updateCvAndSections = async (id: string, cvData: CVData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "User not found." };
    }

    const existingCv = await prisma.cv.findFirst({
      where: { id, userId: currentUser.id, deletedAt: null },
    });

    if (!existingCv) {
      return { success: false, message: "CV not found." };
    }

    // 2️⃣ Build new sections from data
    const newSections = buildSections(cvData);

    // 3️⃣ Fetch existing sections
    const existingSections = await prisma.cvSection.findMany({
      where: { cvId: existingCv.id },
    });

    // 4️⃣ Sync sections intelligently
    for (const section of newSections) {
      const existing = existingSections.find(
        (s) => s.sectionType === section.sectionType
      );

      if (existing) {
        // Update content if changed
        await prisma.cvSection.update({
          where: { id: existing.id },
          data: {
            title: section.title,
            contentJson: section.contentJson,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new section
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

    // 5️⃣ Delete sections that no longer exist in cvData
    const newTypes = newSections.map((s) => s.sectionType);
    const toDelete = existingSections.filter(
      (s) => !newTypes.includes(s.sectionType)
    );

    if (toDelete.length > 0) {
      await prisma.cvSection.deleteMany({
        where: { id: { in: toDelete.map((s) => s.id) } },
      });
    }

    return {
      success: true,
      message: "CV and sections updated successfully.",
      data: existingCv as Cv,
    };
  } catch (error) {
    console.error("[UPDATE_CV_ERROR]", error);
    return {
      success: false,
      message: error?.message || "Unexpected error while updating CV.",
    };
  }
};

/**
 * Transforms CVData → CvSection[] (each sectionType + contentJson)
 */
function buildSections(cvData: CVData) {
  const sections: { sectionType: CvSectionType; contentJson; title?: string }[] = [];

  if (cvData.personal?.summary) {
    sections.push({
      sectionType: CvSectionType.SUMMARY,
      title: "Summary",
      contentJson: { text: cvData.personal.summary },
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
    const { soft, technical, languages } = cvData.skills;
    const allSkills = [
      ...(soft ?? []).map((s) => ({ name: s, category: "SOFT" })),
      ...(technical ?? []).map((s) => ({ name: s, category: "TECHNICAL" })),
      ...(languages ?? []).map((s) => ({ name: s, category: "LANGUAGE" })),
    ];

    sections.push({
      sectionType: CvSectionType.SKILLS,
      title: "Skills",
      contentJson: allSkills,
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

  if (cvData.skills) {
    sections.push({
      sectionType: CvSectionType.SKILLS,
      title: "Skills",
      contentJson: cvData.skills
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
