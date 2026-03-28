"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CVData } from "@/types/cv";
import { CvSectionType } from "@prisma/client";

export const updateCvAndSections = async (id: string, cvData: CVData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Sesión expirada." };

    // 1. Verificar propiedad del CV
    const existingCv = await prisma.cv.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!existingCv) return { success: false, message: "CV no encontrado." };

    // 2. Preparar el lote de datos a sincronizar
    const sectionsToSync = buildSectionsPayload(cvData);

    // 3. Ejecutar Upserts masivos en una Transacción
    // Usamos el identificador compuesto cvId_sectionType definido en el schema
    await prisma.$transaction(
      sectionsToSync.map((section) =>
        prisma.cvSection.upsert({
          where: {
            cvId_sectionType: {
              cvId: id,
              sectionType: section.type,
            },
          },
          update: {
            contentJson: section.content as any,
            updatedAt: new Date(),
          },
          create: {
            cvId: id,
            sectionType: section.type,
            title: section.defaultTitle,
            contentJson: section.content as any,
          },
        })
      )
    );

    return { success: true, message: "Sincronización exitosa." };
  } catch (error) {
    console.error("[UPSERT_SECTIONS_ERROR]", error);
    return { success: false, message: "Error al guardar secciones." };
  }
};

/**
 * Transforma el objeto plano CVData a un array de operaciones para la DB
 */
function buildSectionsPayload(cvData: CVData) {
  const payload: Array<{ type: CvSectionType; content: any; defaultTitle: string }> = [];

  // CONTACT & SUMMARY (Vienen de cvData.personal)
  if (cvData.personal) {
    const { summary, ...contactInfo } = cvData.personal;

    payload.push({
      type: CvSectionType.CONTACT,
      content: contactInfo,
      defaultTitle: "Información de Contacto",
    });

    if (summary) {
      payload.push({
        type: CvSectionType.SUMMARY,
        content: { summary },
        defaultTitle: "Resumen Profesional",
      });
    }
  }

  // COLECCIONES (Education, Experience, etc.)
  // Mapeamos las llaves del DTO a los Enums de la DB
  const map: Record<string, { type: CvSectionType; title: string }> = {
    education: { type: CvSectionType.EDUCATION, title: "Educación" },
    experience: { type: CvSectionType.EXPERIENCE, title: "Experiencia Profesional" },
    projects: { type: CvSectionType.PROJECTS, title: "Proyectos" },
    achievements: { type: CvSectionType.ACHIEVEMENTS, title: "Logros" },
    certifications: { type: CvSectionType.CERTIFICATIONS, title: "Certificaciones" },
    volunteering: { type: CvSectionType.VOLUNTEERING, title: "Voluntariado" },
  };

  for (const [key, meta] of Object.entries(map)) {
    const sectionData = cvData[key as keyof CVData];
    if (sectionData && "items" in sectionData) {
      payload.push({
        type: meta.type,
        content: sectionData.items, // Guardamos directamente el array de items
        defaultTitle: meta.title,
      });
    }
  }

  // SKILLS (Habilidades e Idiomas)
  if (cvData.skills) {
    payload.push({
      type: CvSectionType.SKILLS,
      content: cvData.skills,
      defaultTitle: "Habilidades",
    });
  }

  return payload;
}
