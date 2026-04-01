"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CVData } from "@/types/cv";
import { CvSectionType } from "@prisma/client";

export const updateCvAndSections = async (id: string, cvData: CVData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Sesión expirada." };

    // 1. Traemos las secciones que YA existen, incluyendo su orden actual
    // Suponiendo que tienes un campo 'position' o 'order'
    const existingCv = await prisma.cv.findFirst({
      where: { id, userId: currentUser.id, deletedAt: null },
      include: {
        sections: {
          select: { sectionType: true },
          orderBy: { order: 'asc' } // <--- Crucial: Respetar el orden definido
        }
      }
    });

    if (!existingCv) return { success: false, message: "CV no encontrado." };

    const allowedSectionTypes = existingCv.sections.map(s => s.sectionType);
    const allPayload = buildSectionsPayload(cvData);

    // 2. Filtramos el payload para que SOLO contenga lo que el CV permite
    const sectionsToUpdate = allPayload.filter(s =>
      allowedSectionTypes.includes(s.type) || s.type === CvSectionType.SUMMARY
    );

    // 3. Ejecutamos la transacción de actualización
    await prisma.$transaction(
      sectionsToUpdate.map((section) =>
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
            // IMPORTANTE: No enviamos 'position' ni 'title' para no sobreescribir
            // lo que el admin configuró originalmente.
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

    return { success: true, message: "Datos sincronizados manteniendo el orden original." };
  } catch (error) {
    console.error("[UPDATE_SECTIONS_ERROR]", error);
    return { success: false, message: "Error al guardar secciones." };
  }
};

/**
 * Transforma el objeto plano CVData a un array de operaciones para la DB
 */
function buildSectionsPayload(cvData: CVData) {
  const payload: Array<{ type: CvSectionType; content: any; defaultTitle: string }> = [];

  if (cvData.personal) {
    payload.push({
      type: CvSectionType.SUMMARY,
      content: { text: cvData.personal.summary ?? "" },
      defaultTitle: "Resumen",
    });
  }

  // CONTACT (Información Personal)
  if (cvData.personal) {
    payload.push({
      type: CvSectionType.CONTACT,
      content: cvData.personal,
      defaultTitle: "Información de Contacto",
    });
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
    complements: { type: CvSectionType.COMPLEMENTS, title: "Complementos" },
    interests: { type: CvSectionType.INTERESTS, title: "Intereses" },
    languages: { type: CvSectionType.LANGUAGES, title: "Idiomas" },
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
