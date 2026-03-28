"use server";

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CvType, Language, OpportunityType, CvSectionType, CreditBalanceType, RouteStatus } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { consumeCredits } from "@/features/credits/actions/consume-credits";

export interface CreateCvBody {
  title: string;
  cvType: CvType;
  opportunityType: OpportunityType;
  templateId: string;
  language: Language;
  sections: CvSectionType[]; // Las secciones elegidas por el usuario
}

// Diccionario de títulos para mantener el código limpio
const SECTION_TITLES: Record<CvSectionType, { ES: string; EN: string }> = {
  SUMMARY: { ES: "Resumen", EN: "Summary" },
  CONTACT: { ES: "Contacto", EN: "Contact" },
  EXPERIENCE: { ES: "Experiencia Laboral", EN: "Work Experience" },
  EDUCATION: { ES: "Educación", EN: "Education" },
  SKILLS: { ES: "Habilidades", EN: "Skills" },
  PROJECTS: { ES: "Proyectos", EN: "Projects" },
  CERTIFICATIONS: { ES: "Certificaciones", EN: "Certifications" },
  LANGUAGES: { ES: "Idiomas", EN: "Languages" },
  VOLUNTEERING: { ES: "Voluntariado", EN: "Volunteer Work" }, // Añadida por si acaso
  INTERESTS: { ES: "Intereses", EN: "Interests" },
  ACHIEVEMENTS: { ES: "Logros", EN: "Achievements" },
  COMPLEMENTS: { ES: "Complements", EN: "Complements" },
};

export const createCVByTitleAndType = async (body: CreateCvBody) => {
  const { title, cvType, opportunityType, templateId, language, sections } = body;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Usuario no encontrado." };

    // 1. Verificar créditos (Mejorado: usando findFirst por tipo)
    const balance = await prisma.userCreditBalance.findFirst({
      where: { userId: currentUser.id, type: CreditBalanceType.MANAGE_CVS },
    });

    if (!balance || balance.amount <= 0) {
      return { success: false, message: "Créditos insuficientes." };
    }

    // 2. Preparar secciones dinámicas basadas en la selección del usuario
    const isEs = language === Language.ES;

    // Mapeamos solo las secciones que el usuario envió desde el modal
    const sectionsToCreate = sections.map((sectionType, index) => {
      console.log("[sectionType_to_create]", sectionType)
      const titles = SECTION_TITLES[sectionType] || { ES: sectionType, EN: sectionType };

      return {
        sectionType,
        title: isEs ? titles.ES : titles.EN,
        order: index,
        // Inicializamos contenido vacío según el tipo
        contentJson: (sectionType === "CONTACT"
          ? { fullName: "", email: "", phone: "", linkedin: "", address: "" }
          : sectionType === "SUMMARY" ? { text: "" } : []) as JsonObject,
      };
    });

    // 3. Operación Atómica: Crear CV y Secciones
    const newCv = await prisma.cv.create({
      data: {
        title,
        cvType,
        opportunityType,
        templateId,
        language,
        userId: currentUser.id,
        sections: {
          create: sectionsToCreate,
        },
      },
      include: {
        sections: true,
      }
    });

    console.log("[SECCIONES CREADAS]")
    for (const section of newCv.sections) {
      console.log("[SECTION]", section.sectionType);
    }

    // 4. Consumir crédito
    await consumeCredits({
      userId: currentUser.id,
      type: CreditBalanceType.MANAGE_CVS,
      amount: 1,
      description: `Creación de CV: ${title}`,
    });

    // 5. Vincular a la ruta activa y actualizar progreso
    const activeRoute = await prisma.route.findFirst({
      where: { userId: currentUser.id, isActive: true, cvId: null },
    });

    if (activeRoute) {
      await prisma.route.update({
        where: { id: activeRoute.id },
        data: {
          cvId: newCv.id,
          status: RouteStatus.CV_CREATED // Esto moverá la barra de progreso al 25%
        },
      });
    }

    return { success: true, data: newCv };

  } catch (error) {
    console.error("[ERROR_CREATE_CV]", error);
    return { success: false, message: "Error interno al crear el CV." };
  }
};
