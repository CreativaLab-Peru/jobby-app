import {CvType, OpportunityType, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

import {
  technologyEngineeringEmployment
} from "../../features/cv/helpers/configs/technology-engineering/employment";
import {
  technologyEngineeringInternship
} from "../../features/cv/helpers/configs/technology-engineering/internship";
import {
  technologyEngineeringExchangeProgram
} from "../../features/cv/helpers/configs/technology-engineering/exchange-program";
import {
  technologyEngineeringScholarship
} from "../../features/cv/helpers/configs/technology-engineering/scholarship";
import {
  marketingStrategyEmployment
} from "../../features/cv/helpers/configs/marketing-strategy/employment";
import {
  marketingStrategyInternship
} from "../../features/cv/helpers/configs/marketing-strategy/internship";
import {
  marketingStrategyExchangeProgram
} from "../../features/cv/helpers/configs/marketing-strategy/exchange-program";
import {
  marketingStrategyScholarship
} from "../../features/cv/helpers/configs/marketing-strategy/scholarship";
import {financeProjectsEmployment} from "../../features/cv/helpers/configs/finance-projects/employment";
import {financeProjectsInternship} from "../../features/cv/helpers/configs/finance-projects/internship";
import {
  financeProjectsExchangeProgram
} from "../../features/cv/helpers/configs/finance-projects/exchange-program";
import {
  financeProjectsScholarship
} from "../../features/cv/helpers/configs/finance-projects/scholarship";
import {
  managementBusinessEmployment
} from "../../features/cv/helpers/configs/management-business/employment";
import {
  managementBusinessInternship
} from "../../features/cv/helpers/configs/management-business/internship";
import {
  managementBusinessExchangeProgram
} from "../../features/cv/helpers/configs/management-business/exchange-program";
import {
  managementBusinessScholarship
} from "../../features/cv/helpers/configs/management-business/scholarship";
import {scienceEmployment} from "../../features/cv/helpers/configs/science/employment";
import {scienceInternship} from "../../features/cv/helpers/configs/science/internship";
import {scienceExchangeProgram} from "../../features/cv/helpers/configs/science/exchange-program";
import {scienceScholarship} from "../../features/cv/helpers/configs/science/scholarship";
import {socialMediaEmployment} from "../../features/cv/helpers/configs/social-media/employment";
import {socialMediaInternship} from "../../features/cv/helpers/configs/social-media/internship";
import {
  socialMediaExchangeProgram
} from "../../features/cv/helpers/configs/social-media/exchange-program";
import {socialMediaScholarship} from "../../features/cv/helpers/configs/social-media/scholarship";
import {educationEmployment} from "../../features/cv/helpers/configs/education/employment";
import {educationInternship} from "../../features/cv/helpers/configs/education/internship";
import {educationExchangeProgram} from "../../features/cv/helpers/configs/education/exchange-program";
import {educationScholarship} from "../../features/cv/helpers/configs/education/scholarship";

// --- 1. MAPEO BASE DE SECCIONES (ESTRUCTURA GENERAL) ---
// --- 1. MAPEO BASE DE SECCIONES (Sincronizado con el Enum de la DB) ---
const baseSectionsMap: Record<string, any> = {
  CONTACT: {
    id: "CONTACT",
    title: "Información de Contacto",
    icon: "User",
    fields: [
      { name: "fullName", label: "Nombre Completo", type: "text", required: true, tip: "Usa tu nombre completo oficial", example: "Edward Melendez" },
      { name: "address", label: "Dirección", type: "text", required: false, tip: "Ciudad y País", example: "Cusco, Perú" },
      { name: "linkedin", label: "LinkedIn", type: "text", required: false, tip: "URL de perfil (sin https://)", example: "linkedin.com/in/edward" },
      { name: "phone", label: "Teléfono", type: "text", required: true, tip: "Incluye código de país", example: "+51 987654321" },
      { name: "email", label: "Email", type: "email", required: true, tip: "Usa un email profesional", example: "edward@example.com" },
      { name: "summary", label: "Resumen Profesional", tip: "2-3 líneas de tu perfil y valor", type: "textarea", example: "Ingeniero de software con más de 5 años de experiencia en desarrollo de aplicaciones web y móviles. Especializado en tecnologías de frontend y backend, con un enfoque en la creación de soluciones escalables y eficientes. Apasionado por la innovación y la mejora continua en el desarrollo de software.", required: false }
    ],
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    title: "Experiencia Profesional",
    icon: "Briefcase",
    multiple: true,
    fields: [
      { name: "company", label: "Empresa", type: "text", required: true, example: "TechCorp" },
      { name: "location", label: "Ubicación", type: "text", required: true, example: "Lima, Perú" },
      { name: "position", label: "Cargo", type: "text", required: true, example: "Senior Developer" },
      { name: "duration", label: "Duración", type: "text", required: true, example: "Ene 2023 - Presente" },
      { name: "responsibilities", label: "Responsabilidades", type: "textarea", required: true, example: "• Lideré la migración de microservicios..." },
    ],
  },
  EDUCATION: {
    id: "EDUCATION",
    title: "Educación",
    icon: "GraduationCap",
    multiple: true,
    fields: [
      { name: "title", label: "Título/Carrera", type: "text", required: true, example: "Ingeniería de Sistemas" },
      { name: "institution", label: "Institución", type: "text", required: true, example: "UNSAAC" },
      { name: "location", label: "Ubicación", type: "text", required: true, example: "Cusco, Perú" },
      { name: "year", label: "Año", type: "text", required: true, example: "2024" },
      { name: "honors", label: "Honores/Menciones", type: "text", required: false, example: "Tercio Superior" },
    ],
  },
  SKILLS: {
    id: "SKILLS",
    title: "Habilidades",
    icon: "Languages",
    fields: [
      { name: "technical", label: "Habilidades Técnicas", type: "tags", required: false, example: "React, Node.js, Prisma" },
      { name: "soft", label: "Habilidades Blandas", type: "tags", required: false, example: "Liderazgo, KISS Principle" },
    ],
  },
  PROJECTS: {
    id: "PROJECTS",
    title: "Proyectos",
    icon: "Code",
    multiple: true,
    fields: [
      { name: "title", label: "Título del Proyecto", type: "text", required: false, example: "AI CV Analyzer" },
      { name: "description", label: "Descripción", type: "textarea", required: false, example: "Plataforma para análisis automático de CVs..." },
      { name: "technologies", label: "Tecnologías", type: "text", required: false, example: "Next.js, OpenAI API" },
      { name: "duration", label: "Duración", type: "text", required: false, example: "3 meses" },
    ],
  },
  VOLUNTEERING: {
    id: "VOLUNTEERING",
    title: "Voluntariado",
    icon: "Heart",
    multiple: true,
    fields: [
      { name: "organization", label: "Organización", type: "text", required: false, example: "Tech For Good" },
      { name: "position", label: "Rol", type: "text", required: false, example: "Mentor" },
      { name: "responsibilities", label: "Actividades", type: "textarea", required: false, example: "• Apoyé en la formación de jóvenes..." },
    ],
  },
  CERTIFICATIONS: {
    id: "CERTIFICATIONS",
    title: "Certificaciones",
    icon: "Award",
    multiple: true,
    fields: [
      { name: "name", label: "Nombre", type: "text", required: false, example: "AWS Certified Developer" },
      { name: "issuer", label: "Emisor", type: "text", required: false, example: "Amazon" },
      { name: "date", label: "Fecha", type: "text", required: false, example: "Jun 2024" },
    ],
  },
  ACHIEVEMENTS: {
    id: "ACHIEVEMENTS",
    title: "Logros y Reconocimientos",
    icon: "Trophy",
    multiple: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: false, example: "1er Puesto Hackathon Regional" },
      { name: "description", label: "Descripción", type: "textarea", required: false, example: "Ganador entre 50 equipos..." },
    ],
  },
  INTERESTS: {
    id: "INTERESTS",
    title: "Intereses",
    icon: "Star",
    multiple: true,
    fields: [
      { name: "title", label: "Interés/Hobby", type: "text", required: false, example: "Ciclismo de Montaña" },
      { name: "description", label: "Detalles (opcional)", type: "textarea", required: false, example: "Participación en competencias regionales y rutas de fin de semana." },
    ],
  },

  // Ahora COMPLEMENTS permite múltiples entradas (ej. Disponibilidad, Licencia, Referencia corta)
  COMPLEMENTS: {
    id: "COMPLEMENTS",
    title: "Información Complementaria",
    icon: "PlusCircle",
    multiple: true,
    fields: [
      { name: "title", label: "Categoría", type: "text", required: false, example: "Disponibilidad" },
      { name: "description", label: "Descripción", type: "textarea", required: false, example: "Disponibilidad inmediata para reubicación y viajes internacionales." },
    ],
  },
};

const ALL_SECTION_IDS = [
  "CONTACT",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "PROJECTS",
  "VOLUNTEERING",
  "CERTIFICATIONS",
  "ACHIEVEMENTS",
  "INTERESTS",
  "COMPLEMENTS"
];

// --- 2. FUNCIÓN CONSTRUCTORA DE JSON ---
function buildFullSectionJson(customConfig: any) {
  // Mapeamos sobre la lista MAESTRA para asegurar que estén TODAS
  return ALL_SECTION_IDS.map((id) => {
    const base = baseSectionsMap[id];
    if (!base) return null;

    return {
      ...base,
      fields: base.fields.map((field: any) => {
        const fieldPath = `${id}.${field.name}`;
        return {
          ...field,
          // Si el config específico tiene data para este campo, la usa.
          // Si no, se queda con el default del baseSectionsMap.
          required: customConfig.requiredFields?.[fieldPath] ?? field.required,
          example: customConfig.examples?.[fieldPath] ?? field.example,
          tip: customConfig.tips?.[fieldPath] ?? field.tip,
        };
      }),
    };
  }).filter(Boolean);
}

// --- 3. IMPORTACIÓN DE CONFIGURACIONES ESPECÍFICAS (SIMULADO) ---
// Aquí asumo que tienes acceso a los objetos que me pasaste antes.
// Para el script completo, los agrupo en una gran lista.

async function main() {
  const allConfigs = [
    // TECHNOLOGY & ENGINEERING
    { type: CvType.TECHNOLOGY_ENGINEERING, opp: OpportunityType.EMPLOYMENT, data: technologyEngineeringEmployment },
    { type: CvType.TECHNOLOGY_ENGINEERING, opp: OpportunityType.INTERNSHIP, data: technologyEngineeringInternship },
    { type: CvType.TECHNOLOGY_ENGINEERING, opp: OpportunityType.EXCHANGE_PROGRAM, data: technologyEngineeringExchangeProgram },
    { type: CvType.TECHNOLOGY_ENGINEERING, opp: OpportunityType.SCHOLARSHIP, data: technologyEngineeringScholarship },
    { type: CvType.TECHNOLOGY_ENGINEERING, opp: OpportunityType.STARTUP, data: technologyEngineeringScholarship },

    // MARKETING & STRATEGY
    { type: CvType.MARKETING_STRATEGY, opp: OpportunityType.EMPLOYMENT, data: marketingStrategyEmployment },
    { type: CvType.MARKETING_STRATEGY, opp: OpportunityType.INTERNSHIP, data: marketingStrategyInternship },
    { type: CvType.MARKETING_STRATEGY, opp: OpportunityType.EXCHANGE_PROGRAM, data: marketingStrategyExchangeProgram },
    { type: CvType.MARKETING_STRATEGY, opp: OpportunityType.SCHOLARSHIP, data: marketingStrategyScholarship },
    { type: CvType.MARKETING_STRATEGY, opp: OpportunityType.STARTUP, data: marketingStrategyScholarship },

    // FINANCE & PROJECTS
    { type: CvType.FINANCE_PROJECTS, opp: OpportunityType.EMPLOYMENT, data: financeProjectsEmployment },
    { type: CvType.FINANCE_PROJECTS, opp: OpportunityType.INTERNSHIP, data: financeProjectsInternship },
    { type: CvType.FINANCE_PROJECTS, opp: OpportunityType.EXCHANGE_PROGRAM, data: financeProjectsExchangeProgram },
    { type: CvType.FINANCE_PROJECTS, opp: OpportunityType.SCHOLARSHIP, data: financeProjectsScholarship },
    { type: CvType.FINANCE_PROJECTS, opp: OpportunityType.STARTUP, data: financeProjectsScholarship },

    // MANAGEMENT & BUSINESS
    { type: CvType.MANAGEMENT_BUSINESS, opp: OpportunityType.EMPLOYMENT, data: managementBusinessEmployment },
    { type: CvType.MANAGEMENT_BUSINESS, opp: OpportunityType.INTERNSHIP, data: managementBusinessInternship },
    { type: CvType.MANAGEMENT_BUSINESS, opp: OpportunityType.EXCHANGE_PROGRAM, data: managementBusinessExchangeProgram },
    { type: CvType.MANAGEMENT_BUSINESS, opp: OpportunityType.SCHOLARSHIP, data: managementBusinessScholarship },
    { type: CvType.MANAGEMENT_BUSINESS, opp: OpportunityType.STARTUP, data: managementBusinessScholarship },

    // SCIENCE
    { type: CvType.SCIENCE, opp: OpportunityType.EMPLOYMENT, data: scienceEmployment },
    { type: CvType.SCIENCE, opp: OpportunityType.INTERNSHIP, data: scienceInternship },
    { type: CvType.SCIENCE, opp: OpportunityType.EXCHANGE_PROGRAM, data: scienceExchangeProgram },
    { type: CvType.SCIENCE, opp: OpportunityType.SCHOLARSHIP, data: scienceScholarship },
    { type: CvType.SCIENCE, opp: OpportunityType.STARTUP, data: scienceScholarship },

    // SOCIAL MEDIA
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.EMPLOYMENT, data: socialMediaEmployment },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.INTERNSHIP, data: socialMediaInternship },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.EXCHANGE_PROGRAM, data: socialMediaExchangeProgram },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.SCHOLARSHIP, data: socialMediaScholarship },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.STARTUP, data: socialMediaScholarship },

    // EDUCATION
    { type: CvType.EDUCATION, opp: OpportunityType.EMPLOYMENT, data: educationEmployment },
    { type: CvType.EDUCATION, opp: OpportunityType.INTERNSHIP, data: educationInternship },
    { type: CvType.EDUCATION, opp: OpportunityType.EXCHANGE_PROGRAM, data: educationExchangeProgram },
    { type: CvType.EDUCATION, opp: OpportunityType.SCHOLARSHIP, data: educationScholarship },
    { type: CvType.EDUCATION, opp: OpportunityType.STARTUP, data: educationScholarship },
  ];

  console.log("🚀 Iniciando carga de configuraciones de CV...");



  for (const item of allConfigs) {
    const fullSectionsJson = buildFullSectionJson(item.data);

    await prisma.cvSectionConfiguration.upsert({
      where: {
        cvType_opportunityType: {
          cvType: item.type,
          opportunityType: item.opp,
        },
      },
      update: {
        sections: fullSectionsJson as any,
      },
      create: {
        cvType: item.type,
        opportunityType: item.opp,
        sections: fullSectionsJson as any,
      },
    });
  }

  console.log("✅ Proceso completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
