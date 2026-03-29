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
import {
  designCreativityEmployment
} from "@/features/cv/helpers/configs/design-creativity/employment";
import {
  designCreativityInternship
} from "@/features/cv/helpers/configs/design-creativity/internship";
import {
  designCreativityExchangeProgram
} from "@/features/cv/helpers/configs/design-creativity/exchange-program";
import {
  designCreativityScholarship
} from "@/features/cv/helpers/configs/design-creativity/scholarship";

// --- 1. MAPEO BASE DE SECCIONES (ESTRUCTURA GENERAL) ---
// --- 1. MAPEO BASE DE SECCIONES (Sincronizado con el Enum de la DB) ---
const baseSectionsMap = {
  CONTACT: {
    id: "CONTACT",
    title: "Información de Contacto",
    icon: "User",
    fields: [
      { name: "fullName", label: "Nombre Completo", type: "text", required: true, tip: "Tu nombre tal como aparece en tu documento de identidad", example: "Alex J. Doe" },
      { name: "address", label: "Ubicación", type: "text", required: false, tip: "Ciudad y País", example: "Ciudad de México, México" },
      { name: "linkedin", label: "LinkedIn", type: "text", required: false, tip: "Enlace a tu perfil profesional (ej: linkedin.com/in/usuario)", example: "linkedin.com/in/alexdoe" },
      { name: "phone", label: "Teléfono", type: "text", required: true, tip: "Número con código de país (+52...)", example: "+52 5512345678" },
      { name: "email", label: "Correo Electrónico", type: "email", required: true, tip: "Usa una dirección de correo profesional", example: "alex.doe@email.com" },
      { name: "summary", label: "Perfil Profesional", tip: "Breve resumen de 3-4 líneas sobre tu trayectoria y objetivos", type: "textarea", example: "Estratega digital con más de 8 años de experiencia liderando equipos multidisciplinarios. Especializado en optimización de procesos y transformación digital con un enfoque en resultados medibles y escalabilidad empresarial.", required: false }
    ],
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    title: "Experiencia Profesional",
    icon: "Briefcase",
    multiple: true,
    fields: [
      { name: "company", label: "Empresa / Organización", type: "text", required: true, tip: "Nombre legal de la empresa o nombre comercial conocido", example: "Global Solutions Inc." },
      { name: "location", label: "Ubicación", type: "text", required: true, tip: "Ciudad y país (o especificar 'Remoto')", example: "Remoto / Madrid, España" },
      { name: "position", label: "Cargo o Rol", type: "text", required: true, tip: "Nombre exacto de tu puesto", example: "Project Manager Senior" },
      { name: "duration", label: "Periodo", type: "text", required: true, tip: "Mes/Año de inicio y fin (o 'Presente')", example: "Marzo 2021 - Actualidad" },
      { name: "responsibilities", label: "Logros y Responsabilidades", type: "textarea", required: true, tip: "Usa viñetas para describir tus impactos cuantificables y tareas principales", example: "• Incrementé la eficiencia operativa en un 20% mediante la implementación de metodologías ágiles.\n• Gestioné un presupuesto anual de $500k USD." },
    ],
  },
  EDUCATION: {
    id: "EDUCATION",
    title: "Formación Académica",
    icon: "GraduationCap",
    multiple: true,
    fields: [
      { name: "title", label: "Grado / Carrera", type: "text", required: true, tip: "Nombre oficial de la licenciatura, grado o maestría", example: "Licenciatura en Administración de Empresas" },
      { name: "institution", label: "Institución Educativa", type: "text", required: true, tip: "Nombre completo de la universidad o centro de estudios", example: "Universidad Nacional Autónoma" },
      { name: "location", label: "Ubicación", type: "text", required: true, tip: "Ciudad donde se ubica la institución", example: "Santiago, Chile" },
      { name: "year", label: "Año de Finalización", type: "text", required: true, tip: "Año de egreso (o 'En curso / Esperado 202X')", example: "2019" },
      { name: "honors", label: "Distinciones (Opcional)", type: "text", required: false, tip: "Menciones, tercio superior o premios académicos", example: "Mención Honorífica por Excelencia Académica" },
    ],
  },
  SKILLS: {
    id: "SKILLS",
    title: "Competencias",
    icon: "Languages",
    fields: [
      { name: "technical", label: "Habilidades Técnicas / Hard Skills", type: "tags", required: false, tip: "Software, lenguajes, metodologías o herramientas específicas", example: "Python, SQL, Análisis de Datos, AWS" },
      { name: "soft", label: "Habilidades Blandas / Soft Skills", type: "tags", required: false, tip: "Habilidades interpersonales y de gestión", example: "Comunicación Asertiva, Trabajo en Equipo, Resolución de Problemas" },
      { name: "languages", label: "Idiomas", type: "tags", required: false, tip: "Indica el idioma y tu nivel (A1-C2 o Nativo/Fluido)", example: "Inglés (C1 - Avanzado), Francés (B2 - Intermedio)" },
    ],
  },
  PROJECTS: {
    id: "PROJECTS",
    title: "Proyectos Destacados",
    icon: "Code",
    multiple: true,
    fields: [
      { name: "title", label: "Nombre del Proyecto", type: "text", required: false, tip: "Título descriptivo del proyecto", example: "Sistema de Gestión de Inventarios E-commerce" },
      { name: "description", label: "Descripción del Proyecto", type: "textarea", required: false, tip: "Explica brevemente el objetivo y el resultado del proyecto", example: "Desarrollo de una solución integral para el control de stock en tiempo real utilizando arquitectura de microservicios." },
      { name: "technologies", label: "Tecnologías Aplicadas", type: "text", required: false, tip: "Lista de herramientas principales usadas", example: "React, PostgreSQL, Docker" },
      { name: "duration", label: "Tiempo de Desarrollo", type: "text", required: false, tip: "Meses o semanas de duración", example: "6 meses (2023)" },
    ],
  },
  VOLUNTEERING: {
    id: "VOLUNTEERING",
    title: "Voluntariado y Causas",
    icon: "Heart",
    multiple: true,
    fields: [
      { name: "organization", label: "Organización", type: "text", required: false, tip: "Nombre de la ONG o fundación", example: "Alianza por la Alfabetización Digital" },
      { name: "position", label: "Rol / Función", type: "text", required: false, tip: "Tu cargo dentro de la organización", example: "Instructor Voluntario" },
      { name: "responsibilities", label: "Resumen de la labor", type: "textarea", required: false, tip: "Describe brevemente tu aporte social", example: "• Capacitación básica en herramientas ofimáticas para adultos mayores en zonas rurales." },
    ],
  },
  CERTIFICATIONS: {
    id: "CERTIFICATIONS",
    title: "Certificaciones y Licencias",
    icon: "Award",
    multiple: true,
    fields: [
      { name: "name", label: "Nombre de la Certificación", type: "text", required: false, tip: "Nombre oficial del certificado", example: "Google Data Analytics Professional Certificate" },
      { name: "issuer", label: "Entidad Emisora", type: "text", required: false, tip: "Quién otorga la certificación (empresa o institución)", example: "Coursera / Google" },
      { name: "date", label: "Fecha de Emisión", type: "text", required: false, tip: "Mes y año en que se obtuvo", example: "Agosto 2023" },
    ],
  },
  ACHIEVEMENTS: {
    id: "ACHIEVEMENTS",
    title: "Reconocimientos y Premios",
    icon: "Trophy",
    multiple: true,
    fields: [
      { name: "title", label: "Título del Reconocimiento", type: "text", required: false, tip: "Nombre del premio o distinción", example: "Empleado del Año 2022" },
      { name: "description", label: "Detalles adicionales", type: "textarea", required: false, tip: "Contexto sobre por qué recibiste este logro", example: "Reconocimiento otorgado por superar los objetivos de ventas anuales en un 40%." },
    ],
  },
  INTERESTS: {
    id: "INTERESTS",
    title: "Pasatiempos e Intereses",
    icon: "Star",
    multiple: true,
    fields: [
      { name: "title", label: "Actividad", type: "text", required: false, tip: "Hobby o interés personal", example: "Fotografía de Paisajes" },
      { name: "description", label: "Comentario breve", type: "textarea", required: false, tip: "Opcional: Detalla por qué te apasiona", example: "Interés en la captura de entornos naturales y técnicas de post-procesado digital." },
    ],
  }
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
        const fieldPath = `${id.toLowerCase()}.${field.name}`;
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

    // DESIGN & CREATIVITY
    { type: CvType.DESIGN_CREATIVITY, opp: OpportunityType.EMPLOYMENT, data: designCreativityEmployment },
    { type: CvType.DESIGN_CREATIVITY, opp: OpportunityType.INTERNSHIP, data: designCreativityInternship },
    { type: CvType.DESIGN_CREATIVITY, opp: OpportunityType.EXCHANGE_PROGRAM, data: designCreativityExchangeProgram },
    { type: CvType.DESIGN_CREATIVITY, opp: OpportunityType.SCHOLARSHIP, data: designCreativityScholarship },
    { type: CvType.DESIGN_CREATIVITY, opp: OpportunityType.STARTUP, data: designCreativityScholarship }, // Usando scholarship como fallback si no tienes startup aún
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
