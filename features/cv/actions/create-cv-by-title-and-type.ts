"use server";

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CvType, Language, OpportunityType, CvSectionType, CreditBalanceType, RouteStatus } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { consumeCredits } from "@/features/credits/actions/consume-credits";

// Definimos la interfaz del body para mejor tipado
export interface CreateCvBody {
  title: string;
  cvType: CvType;
  opportunityType: OpportunityType;
  templateId: string;
  language: Language;
}

export const createCVByTitleAndType = async (body: CreateCvBody) => {
  const { title, cvType, opportunityType, templateId, language } = body;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Usuario no encontrado." };
    }

    // Verificar balance de créditos
    const creditLimits = await prisma.userCreditBalance.findUnique({
      where: {
        userId_type: {
          userId: currentUser.id,
          type: CreditBalanceType.MANAGE_CVS
        }
      },
    });

    if (!creditLimits || creditLimits.amount <= 0) {
      return { success: false, message: "Créditos insuficientes para crear un CV." };
    }

    // Traducción básica de títulos de secciones según el idioma seleccionado
    const isEs = language === Language.ES;

    const defaultSections = [
      { sectionType: CvSectionType.SUMMARY, title: isEs ? "Resumen" : "Summary", order: 0, contentJson: { text: "" } },
      {
        sectionType: CvSectionType.CONTACT,
        title: isEs ? "Contacto" : "Contact",
        order: 1,
        contentJson: { fullName: "", email: "", phone: "", linkedin: "", address: "" }
      },
      { sectionType: CvSectionType.EXPERIENCE, title: isEs ? "Experiencia Laboral" : "Work Experience", order: 2, contentJson: [] },
      { sectionType: CvSectionType.EDUCATION, title: isEs ? "Educación" : "Education", order: 3, contentJson: [] },
      { sectionType: CvSectionType.SKILLS, title: isEs ? "Habilidades" : "Skills", order: 4, contentJson: [] },
      { sectionType: CvSectionType.PROJECTS, title: isEs ? "Proyectos" : "Projects", order: 5, contentJson: [] },
      { sectionType: CvSectionType.CERTIFICATIONS, title: isEs ? "Certificaciones" : "Certifications", order: 6, contentJson: [] },
      { sectionType: CvSectionType.LANGUAGES, title: isEs ? "Idiomas" : "Languages", order: 7, contentJson: [] },
    ];

    // Operación Atómica
    const newCv = await prisma.cv.create({
      data: {
        title,
        cvType,
        opportunityType,
        templateId,
        language, // Ahora dinámico
        userId: currentUser.id,
        sections: {
          create: defaultSections.map((s) => ({
            sectionType: s.sectionType,
            title: s.title,
            contentJson: s.contentJson as JsonObject,
            order: s.order,
          })),
        },
      }
    });

    // Consumir crédito
    await consumeCredits({
      userId: currentUser.id,
      type: CreditBalanceType.MANAGE_CVS,
      amount: 1,
      description: `Creación de CV: ${title}`,
    });

    // Vincular a la ruta activa si existe
    const activeRoute = await prisma.route.findFirst({
      where: { userId: currentUser.id, isActive: true, cvId: null },
    });

    if (activeRoute) {
      await prisma.route.update({
        where: { id: activeRoute.id },
        data: { cvId: newCv.id, status: RouteStatus.CV_CREATED },
      });
    }

    return { success: true, data: newCv };

  } catch (error) {
    console.error("[ERROR_CREATE_CV]", error);
    return { success: false, message: "Error interno al crear el CV." };
  }
};
