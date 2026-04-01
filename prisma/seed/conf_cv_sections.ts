import { CvType, OpportunityType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// technology & engineering ES
import { technologyEngineeringEmployment as EStechnologyEngineeringEmployment } from "../../features/cv/helpers/configs/language/es/technology-engineering/employment";
import { technologyEngineeringInternship as EStechnologyEngineeringInternship } from "../../features/cv/helpers/configs/language/es/technology-engineering/internship";
import { technologyEngineeringExchangeProgram as EStechnologyEngineeringExchangeProgram } from "../../features/cv/helpers/configs/language/es/technology-engineering/exchange-program";
import { technologyEngineeringScholarship as EStechnologyEngineeringScholarship } from "../../features/cv/helpers/configs/language/es/technology-engineering/scholarship";
// technology & engineering EN
import { technologyEngineeringEmployment as ENtechnologyEngineeringEmployment } from "../../features/cv/helpers/configs/language/en/technology-engineering/employment";
import { technologyEngineeringInternship as ENtechnologyEngineeringInternship } from "../../features/cv/helpers/configs/language/en/technology-engineering/internship";
import { technologyEngineeringExchangeProgram as ENtechnologyEngineeringExchangeProgram } from "../../features/cv/helpers/configs/language/en/technology-engineering/exchange-program";
import { technologyEngineeringScholarship as ENtechnologyEngineeringScholarship } from "../../features/cv/helpers/configs/language/en/technology-engineering/scholarship";

// marketing & strategy ES
import { marketingStrategyEmployment as ESmarketingStrategyEmployment } from "../../features/cv/helpers/configs/language/es/marketing-strategy/employment";
import { marketingStrategyInternship as ESmarketingStrategyInternship } from "../../features/cv/helpers/configs/language/es/marketing-strategy/internship";
import { marketingStrategyExchangeProgram as ESmarketingStrategyExchangeProgram } from "../../features/cv/helpers/configs/language/es/marketing-strategy/exchange-program";
import { marketingStrategyScholarship as ESmarketingStrategyScholarship } from "../../features/cv/helpers/configs/language/es/marketing-strategy/scholarship";
// marketing & strategy EN
import { marketingStrategyEmployment as ENmarketingStrategyEmployment } from "../../features/cv/helpers/configs/language/en/marketing-strategy/employment";
import { marketingStrategyInternship as ENmarketingStrategyInternship } from "../../features/cv/helpers/configs/language/en/marketing-strategy/internship";
import { marketingStrategyExchangeProgram as ENmarketingStrategyExchangeProgram } from "../../features/cv/helpers/configs/language/en/marketing-strategy/exchange-program";
import { marketingStrategyScholarship as ENmarketingStrategyScholarship } from "../../features/cv/helpers/configs/language/en/marketing-strategy/scholarship";

// finance & consulting ES
import { financeProjectsEmployment as ESfinanceProjectsEmployment } from "../../features/cv/helpers/configs/language/es/finance-projects/employment";
import { financeProjectsInternship as ESfinanceProjectsInternship } from "../../features/cv/helpers/configs/language/es/finance-projects/internship";
import { financeProjectsExchangeProgram as ESfinanceProjectsExchangeProgram } from "../../features/cv/helpers/configs/language/es/finance-projects/exchange-program";
import { financeProjectsScholarship as ESfinanceProjectsScholarship } from "../../features/cv/helpers/configs/language/es/finance-projects/scholarship";
// finance & consulting EN
import { financeProjectsEmployment as ENfinanceProjectsEmployment } from "../../features/cv/helpers/configs/language/en/finance-projects/employment";
import { financeProjectsInternship as ENfinanceProjectsInternship } from "../../features/cv/helpers/configs/language/en/finance-projects/internship";
import { financeProjectsExchangeProgram as ENfinanceProjectsExchangeProgram } from "../../features/cv/helpers/configs/language/en/finance-projects/exchange-program";
import { financeProjectsScholarship as ENfinanceProjectsScholarship } from "../../features/cv/helpers/configs/language/en/finance-projects/scholarship";

// management & business ES
import { managementBusinessEmployment as ESmanagementBusinessEmployment } from "../../features/cv/helpers/configs/language/es/management-business/employment";
import { managementBusinessInternship as ESmanagementBusinessInternship } from "../../features/cv/helpers/configs/language/es/management-business/internship";
import { managementBusinessExchangeProgram as ESmanagementBusinessExchangeProgram } from "../../features/cv/helpers/configs/language/es/management-business/exchange-program";
import { managementBusinessScholarship as ESmanagementBusinessScholarship } from "../../features/cv/helpers/configs/language/es/management-business/scholarship";
// management & business EN
import { managementBusinessEmployment as ENmanagementBusinessEmployment } from "../../features/cv/helpers/configs/language/en/management-business/employment";
import { managementBusinessInternship as ENmanagementBusinessInternship } from "../../features/cv/helpers/configs/language/en/management-business/internship";
import { managementBusinessExchangeProgram as ENmanagementBusinessExchangeProgram } from "../../features/cv/helpers/configs/language/en/management-business/exchange-program";
import { managementBusinessScholarship as ENmanagementBusinessScholarship } from "../../features/cv/helpers/configs/language/en/management-business/scholarship";

// science ES
import { scienceEmployment as ESscienceEmployment } from "../../features/cv/helpers/configs/language/es/science/employment";
import { scienceInternship as ESscienceInternship } from "../../features/cv/helpers/configs/language/es/science/internship";
import { scienceExchangeProgram as ESscienceExchangeProgram } from "../../features/cv/helpers/configs/language/es/science/exchange-program";
import { scienceScholarship as ESscienceScholarship } from "../../features/cv/helpers/configs/language/es/science/scholarship";
// science EN
import { scienceEmployment as ENscienceEmployment } from "../../features/cv/helpers/configs/language/en/science/employment";
import { scienceInternship as ENscienceInternship } from "../../features/cv/helpers/configs/language/en/science/internship";
import { scienceExchangeProgram as ENscienceExchangeProgram } from "../../features/cv/helpers/configs/language/en/science/exchange-program";
import { scienceScholarship as ENscienceScholarship } from "../../features/cv/helpers/configs/language/en/science/scholarship";

// social media ES
import { socialMediaEmployment as ESsocialMediaEmployment } from "../../features/cv/helpers/configs/language/es/social-media/employment";
import { socialMediaInternship as ESsocialMediaInternship } from "../../features/cv/helpers/configs/language/es/social-media/internship";
import { socialMediaExchangeProgram as ESsocialMediaExchangeProgram } from "../../features/cv/helpers/configs/language/es/social-media/exchange-program";
import { socialMediaScholarship as ESsocialMediaScholarship } from "../../features/cv/helpers/configs/language/es/social-media/scholarship";
// social media EN
import { socialMediaEmployment as ENsocialMediaEmployment } from "../../features/cv/helpers/configs/language/en/social-media/employment";
import { socialMediaInternship as ENsocialMediaInternship } from "../../features/cv/helpers/configs/language/en/social-media/internship";
import { socialMediaExchangeProgram as ENsocialMediaExchangeProgram } from "../../features/cv/helpers/configs/language/en/social-media/exchange-program";
import { socialMediaScholarship as ENsocialMediaScholarship } from "../../features/cv/helpers/configs/language/en/social-media/scholarship";

// design & creativity ES
import { educationEmployment as ESeducationEmployment } from "../../features/cv/helpers/configs/language/es/education/employment";
import { educationInternship as ESeducationInternship } from "../../features/cv/helpers/configs/language/es/education/internship";
import { educationExchangeProgram as ESeducationExchangeProgram } from "../../features/cv/helpers/configs/language/es/education/exchange-program";
import { educationScholarship as ESeducationScholarship } from "../../features/cv/helpers/configs/language/es/education/scholarship";
// design & creativity EN
import { educationEmployment as ENeducationEmployment } from "../../features/cv/helpers/configs/language/en/education/employment";
import { educationInternship as ENeducationInternship } from "../../features/cv/helpers/configs/language/en/education/internship";
import { educationExchangeProgram as ENeducationExchangeProgram } from "../../features/cv/helpers/configs/language/en/education/exchange-program";
import { educationScholarship as ENeducationScholarship } from "../../features/cv/helpers/configs/language/en/education/scholarship";

// design & creativity ES
import { designCreativityEmployment as ESdesignCreativityEmployment } from "@/features/cv/helpers/configs/language/es/design-creativity/employment";
import { designCreativityInternship as ESdesignCreativityInternship } from "@/features/cv/helpers/configs/language/es/design-creativity/internship";
import { designCreativityExchangeProgram as ESdesignCreativityExchangeProgram } from "@/features/cv/helpers/configs/language/es/design-creativity/exchange-program";
import { designCreativityScholarship as ESdesignCreativityScholarship } from "@/features/cv/helpers/configs/language/es/design-creativity/scholarship";
// design & creativity EN
import { designCreativityEmployment as ENdesignCreativityEmployment } from "@/features/cv/helpers/configs/language/en/design-creativity/employment";
import { designCreativityInternship as ENdesignCreativityInternship } from "@/features/cv/helpers/configs/language/en/design-creativity/internship";
import { designCreativityExchangeProgram as ENdesignCreativityExchangeProgram } from "@/features/cv/helpers/configs/language/en/design-creativity/exchange-program";
import { designCreativityScholarship as ENdesignCreativityScholarship } from "@/features/cv/helpers/configs/language/en/design-creativity/scholarship";
import { en } from "zod/v4/locales";

// Función para fusionar configuraciones ES/EN en un solo objeto multi-idioma
function mergeLangSection(esConfig: any, enConfig: any) {
  // Devuelve los ejemplos y requiredFields de ambos idiomas
  return {
    sections: esConfig.sections || enConfig.sections || [],
    requiredFields: esConfig.requiredFields || {},
    requiredFieldsEn: enConfig.requiredFields || {},
    examples: esConfig.examples || {},
    examplesEn: enConfig.examples || {},
  };
}

const SECTION_ID_TO_CONFIG_KEY: Record<string, string> = {
  CONTACT: "personal",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  SKILLS: "skills",
  PROJECTS: "projects",
  VOLUNTEERING: "volunteering",
  CERTIFICATIONS: "certifications",
  ACHIEVEMENTS: "achievements",
  INTERESTS: "interests",
};

const CONFIG_KEY_TO_SECTION_ID: Record<string, string> = {
  personal: "CONTACT",
  experience: "EXPERIENCE",
  education: "EDUCATION",
  skills: "SKILLS",
  projects: "PROJECTS",
  volunteering: "VOLUNTEERING",
  certifications: "CERTIFICATIONS",
  achievements: "ACHIEVEMENTS",
  interests: "INTERESTS",
};

// --- 1. MAPEO BASE DE SECCIONES (ESTRUCTURA GENERAL) ---
const baseSectionsMap = {
  CONTACT: {
    id: "CONTACT",
    title: {
      es: "Información de Contacto",
      en: "Contact Information",
    },
    icon: "User",
    fields: [
      {
        name: "fullName",
        type: "text",
        required: true,
        label: {
          es: "Nombre Completo",
          en: "Full Name",
        },
        tip: {
          es: "Tu nombre tal como aparece en tu documento de identidad",
          en: "Your name as it appears on your ID document",
        },
        example: {
          es: "Alex J. Doe",
          en: "Alex J. Doe",
        },
      },
      {
        name: "address",
        type: "text",
        required: false,
        label: {
          es: "Ubicación",
          en: "Location",
        },
        tip: {
          es: "Ciudad y País",
          en: "City and Country",
        },
        example: {
          es: "Ciudad de México, México",
          en: "Mexico City, Mexico",
        },
      },
      {
        name: "linkedin",
        type: "text",
        required: false,
        label: {
          es: "LinkedIn",
          en: "LinkedIn",
        },
        tip: {
          es: "Enlace a tu perfil profesional (ej: linkedin.com/in/usuario)",
          en: "Link to your professional profile (e.g., linkedin.com/in/username)",
        },
        example: {
          es: "linkedin.com/in/alexdoe",
          en: "linkedin.com/in/jhondoe",
        },
      },
      {
        name: "phone",
        type: "text",
        required: true,
        label: {
          es: "Teléfono",
          en: "Phone",
        },
        tip: {
          es: "Número con código de país (+52...)",
          en: "Number with country code (+52...)",
        },
        example: {
          es: "+52 5512345678",
          en: "+52 5512345678",
        },
      },
      {
        name: "email",
        type: "email",
        required: true,
        label: {
          es: "Correo Electrónico",
          en: "Email",
        },
        tip: {
          es: "Usa una dirección de correo profesional",
          en: "Use a professional email address",
        },
        example: {
          es: "alex.doe@email.com",
          en: "alex.doe@email.com",
        },
      },
      {
        name: "summary",
        type: "textarea",
        required: false,
        label: {
          es: "Perfil Profesional",
          en: "Professional Profile",
        },
        tip: {
          es: "Breve resumen de 3-4 líneas sobre tu trayectoria y objetivos",
          en: "Brief summary of 3-4 lines about your career and goals",
        },
        example: {
          es: "Estratega digital con más de 8 años de experiencia liderando equipos multidisciplinarios. Especializado en optimización de procesos y transformación digital con un enfoque en resultados medibles y escalabilidad empresarial.",
          en: "Digital strategist with over 8 years of experience leading multidisciplinary teams. Specialized in process optimization and digital transformation with a focus on measurable results and business scalability.",
        },
      },
    ],
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    title: {
      es: "Experiencia Profesional",
      en: "Professional Experience",
    },
    icon: "Briefcase",
    multiple: true,
    fields: [
      {
        name: "company",
        type: "text",
        required: true,
        label: {
          es: "Empresa / Organización",
          en: "Company / Organization",
        },
        tip: {
          es: "Nombre legal de la empresa o nombre comercial conocido",
          en: "Legal name of the company or known trade name",
        },
        example: {
          es: "Tech Solutions S.A.",
          en: "Tech Solutions Inc.",
        },
      },
      {
        name: "location",
        type: "text",
        required: true,
        label: {
          es: "Ubicación",
          en: "Location",
        },
        tip: {
          es: "Ciudad y país (o especificar 'Remoto')",
          en: "City and Country (or specify 'Remote')",
        },
        example: {
          es: "Remoto / Madrid, España",
          en: "Remote / Madrid, Spain",
        },
      },
      {
        name: "position",
        type: "text",
        required: true,
        label: {
          es: "Cargo o Rol",
          en: "Position or Role",
        },
        tip: {
          es: "Nombre exacto de tu puesto",
          en: "Exact name of your position",
        },
        example: {
          es: "Project Manager Senior",
          en: "Senior Project Manager",
        },
      },
      {
        name: "duration",
        type: "text",
        required: true,
        label: {
          es: "Periodo",
          en: "Period",
        },
        tip: {
          es: "Mes/Año de inicio y fin (o 'Presente')",
          en: "Month/Year of start and end (or 'Present')",
        },
        example: {
          es: "Marzo 2021 - Actualidad",
          en: "March 2021 - Present",
        },
      },
      {
        name: "responsibilities",
        type: "textarea",
        required: true,
        label: {
          es: "Logros y Responsabilidades",
          en: "Achievements and Responsibilities",
        },
        tip: {
          es: "Usa viñetas para describir tus impactos cuantificables y tareas principales",
          en: "Use bullet points to describe your measurable impacts and main tasks",
        },
        example: {
          es: "• Incrementé la eficiencia operativa en un 20% mediante la implementación de metodologías ágiles.\n• Gestioné un presupuesto anual de $500k USD.",
          en: "• Increased operational efficiency by 20% through the implementation of agile methodologies.\n• Managed an annual budget of $500k USD.",
        },
      },
    ],
  },
  EDUCATION: {
    id: "EDUCATION",
    title: {
      es: "Formación Académica",
      en: "Education",
    },
    icon: "GraduationCap",
    multiple: true,
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
        label: {
          es: "Grado / Carrera",
          en: "Degree / Major",
        },
        tip: {
          es: "Nombre oficial de la licenciatura, grado o maestría",
          en: "Official name of the degree, major or master's program",
        },
        example: {
          es: "Licenciatura en Administración de Empresas",
          en: "Bachelor's Degree in Business Administration",
        },
      },
      {
        name: "institution",
        type: "text",
        required: true,
        label: {
          es: "Institución Educativa",
          en: "Educational Institution",
        },
        tip: {
          es: "Nombre completo de la universidad o centro de estudios",
          en: "Full name of the university or educational center",
        },
        example: {
          es: "Universidad Nacional Autónoma",
          en: "National Autonomous University",
        },
      },
      {
        name: "location",
        type: "text",
        required: true,
        label: {
          es: "Ubicación",
          en: "Location",
        },
        tip: {
          es: "Ciudad donde se ubica la institución",
          en: "City where the institution is located",
        },
        example: {
          es: "Santiago, Chile",
          en: "Santiago, Chile",
        },
      },
      {
        name: "year",
        type: "text",
        required: true,
        label: {
          es: "Año de Finalización",
          en: "Year of Completion",
        },
        tip: {
          es: "Año de egreso (o 'En curso / Esperado 202X')",
          en: "Year of graduation (or 'In progress / Expected 202X')",
        },
        example: {
          es: "2019",
          en: "2019",
        },
      },
      {
        name: "honors",
        type: "text",
        required: false,
        label: {
          es: "Distinciones (Opcional)",
          en: "Honors (Optional)",
        },
        tip: {
          es: "Menciones, tercio superior o premios académicos",
          en: "Mentions, top third or academic awards",
        },
        example: {
          es: "Mención Honorífica por Excelencia Académica",
          en: "Honorable Mention for Academic Excellence",
        },
      },
    ],
  },
  SKILLS: {
    id: "SKILLS",
    title: {
      es: "Competencias",
      en: "Skills",
    },
    icon: "Languages",
    fields: [
      {
        name: "technical",
        type: "tags",
        required: false,
        label: {
          es: "Habilidades Técnicas / Hard Skills",
          en: "Technical Skills / Hard Skills",
        },
        tip: {
          es: "Software, lenguajes, metodologías o herramientas específicas",
          en: "Software, languages, methodologies or specific tools",
        },
        example: {
          es: "Python, SQL, Análisis de Datos, AWS",
          en: "Python, SQL, Data Analysis, AWS",
        },
      },
      {
        name: "soft",
        type: "tags",
        required: false,
        label: {
          es: "Habilidades Blandas / Soft Skills",
          en: "Soft Skills",
        },
        tip: {
          es: "Habilidades interpersonales y de gestión",
          en: "Interpersonal and management skills",
        },
        example: {
          es: "Comunicación Asertiva, Trabajo en Equipo, Resolución de Problemas",
          en: "Assertive Communication, Teamwork, Problem Solving",
        },
      },
      {
        name: "languages",
        type: "tags",
        required: false,
        label: {
          es: "Idiomas",
          en: "Languages",
        },
        tip: {
          es: "Indica el idioma y tu nivel (A1-C2 o Nativo/Fluido)",
          en: "Indicate the language and your level (A1-C2 or Native/Fluent)",
        },
        example: {
          es: "Inglés (C1 - Avanzado), Francés (B2 - Intermedio)",
          en: "English (C1 - Advanced), French (B2 - Intermediate)",
        },
      },
    ],
  },
  PROJECTS: {
    id: "PROJECTS",
    title: {
      es: "Proyectos Destacados",
      en: "Featured Projects",
    },
    icon: "Code",
    multiple: true,
    fields: [
      {
        name: "title",
        type: "text",
        required: false,
        label: {
          es: "Nombre del Proyecto",
          en: "Project Name",
        },
        tip: {
          es: "Título descriptivo del proyecto",
          en: "Descriptive title of the project",
        },
        example: {
          es: "Sistema de Gestión de Inventarios E-commerce",
          en: "E-commerce Inventory Management System",
        },
      },
      {
        name: "description",
        type: "textarea",
        required: false,
        label: {
          es: "Descripción del Proyecto",
          en: "Project Description",
        },
        tip: {
          es: "Explica brevemente el objetivo y el resultado del proyecto",
          en: "Briefly explain the objective and outcome of the project",
        },
        example: {
          es: "Desarrollo de una solución integral para el control de stock en tiempo real utilizando arquitectura de microservicios.",
          en: "Development of an integrated solution for real-time inventory control using microservices architecture.",
        },
      },
      {
        name: "technologies",
        type: "text",
        required: false,
        label: {
          es: "Tecnologías Aplicadas",
          en: "Applied Technologies",
        },
        tip: {
          es: "Lista de herramientas principales usadas",
          en: "List of main tools used",
        },
        example: {
          es: "React, PostgreSQL, Docker",
          en: "React, PostgreSQL, Docker",
        },
      },
      {
        name: "duration",
        type: "text",
        required: false,
        label: {
          es: "Tiempo de Desarrollo",
          en: "Development Time",
        },
        tip: {
          es: "Meses o semanas de duración",
          en: "Months or weeks of duration",
        },
        example: {
          es: "6 meses (2023)",
          en: "6 months (2023)",
        },
      },
    ],
  },
  VOLUNTEERING: {
    id: "VOLUNTEERING",
    title: {
      es: "Voluntariado y Causas",
      en: "Volunteering and Causes",
    },
    icon: "Heart",
    multiple: true,
    fields: [
      {
        name: "organization",
        type: "text",
        required: false,
        label: {
          es: "Organización",
          en: "Organization",
        },
        tip: {
          es: "Nombre de la ONG o fundación",
          en: "Name of the NGO or foundation",
        },
        example: {
          es: "Alianza por la Alfabetización Digital",
          en: "Alliance for Digital Literacy",
        },
      },
      {
        name: "position",
        type: "text",
        required: false,
        label: {
          es: "Rol / Función",
          en: "Role / Function",
        },
        tip: {
          es: "Tu cargo dentro de la organización",
          en: "Your role within the organization",
        },
        example: {
          es: "Instructor Voluntario",
          en: "Volunteer Instructor",
        },
      },
      {
        name: "responsibilities",
        type: "textarea",
        required: false,
        label: {
          es: "Resumen de la labor",
          en: "Summary of the work",
        },
        tip: {
          es: "Describe brevemente tu aporte social",
          en: "Briefly describe your social contribution",
        },
        example: {
          es: "• Capacitación básica en herramientas ofimáticas para adultos mayores en zonas rurales.",
          en: "• Basic training in office tools for elderly people in rural areas.",
        },
      },
    ],
  },
  CERTIFICATIONS: {
    id: "CERTIFICATIONS",
    title: {
      es: "Certificaciones y Licencias",
      en: "Certifications and Licenses",
    },
    icon: "Award",
    multiple: true,
    fields: [
      {
        name: "name",
        type: "text",
        required: false,
        label: {
          es: "Nombre de la Certificación",
          en: "Certification Name",
        },
        tip: {
          es: "Nombre oficial del certificado",
          en: "Official name of the certificate",
        },
        example: {
          es: "Google Data Analytics Professional Certificate",
          en: "Google Data Analytics Professional Certificate",
        },
      },
      {
        name: "issuer",
        type: "text",
        required: false,
        label: {
          es: "Entidad Emisora",
          en: "Issuing Entity",
        },
        tip: {
          es: "Quién otorga la certificación (empresa o institución)",
          en: "Who issues the certification (company or institution)",
        },
        example: {
          es: "Coursera / Google",
          en: "Coursera / Google",
        },
      },
      {
        name: "date",
        type: "text",
        required: false,
        label: {
          es: "Fecha de Emisión",
          en: "Issue Date",
        },
        tip: {
          es: "Mes y año en que se obtuvo",
          en: "Month and year when it was obtained",
        },
        example: {
          es: "Agosto 2023",
          en: "August 2023",
        },
      },
    ],
  },
  ACHIEVEMENTS: {
    id: "ACHIEVEMENTS",
    title: {
      es: "Reconocimientos y Premios",
      en: "Awards and Recognitions",
    },
    icon: "Trophy",
    multiple: true,
    fields: [
      {
        name: "title",
        type: "text",
        required: false,
        label: {
          es: "Título del Reconocimiento",
          en: "Title of the Recognition",
        },
        tip: {
          es: "Nombre del premio o distinción",
          en: "Name of the award or distinction",
        },
        example: {
          es: "Empleado del Año 2022",
          en: "Employee of the Year 2022",
        },
      },
      {
        name: "description",
        type: "textarea",
        required: false,
        label: {
          es: "Detalles adicionales",
          en: "Additional Details",
        },
        tip: {
          es: "Contexto sobre por qué recibiste este logro",
          en: "Context about why you received this achievement",
        },
        example: {
          es: "Reconocimiento otorgado por superar los objetivos de ventas anuales en un 40%.",
          en: "Recognition given for exceeding annual sales targets by 40%.",
        },
      },
    ],
  },
  INTERESTS: {
    id: "INTERESTS",
    title: {
      es: "Pasatiempos e Intereses",
      en: "Hobbies and Interests",
    },
    icon: "Star",
    multiple: true,
    fields: [
      { 
        name: "title", 
        type: "text", 
        required: false,
        label: {
          es: "Actividad",
          en: "Activity",
        },
        tip: {
          es: "Hobby o interés personal",
          en: "Personal hobby or interest",
        },
        example: {
          es: "Fotografía de Paisajes",
          en: "Landscape Photography",
        }  
      },
      { 
        name: "description", 
        type: "textarea", 
        required: false,
        label: {
          es: "Comentario breve",
          en: "Brief Comment",
        }, 
        tip: {
          es: "Opcional: Detalla por qué te apasiona",
          en: "Optional: Detail why you are passionate about it",
        },
        example: {
          es: "Interés en la captura de entornos naturales y técnicas de post-procesado digital.",
          en: "Interest in capturing natural environments and digital post-processing techniques.",
        }
      },
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
];

// --- 2. FUNCIÓN CONSTRUCTORA DE JSON ---
function buildFullSectionJson(customConfig: any) {
  // Usar la lista de secciones específica si existe, si no la base
  const sectionIds = Array.isArray(customConfig.sections) && customConfig.sections.length > 0
    ? customConfig.sections
      .map((s: string) => CONFIG_KEY_TO_SECTION_ID[s.toLowerCase()] || s.toUpperCase())
      .filter((s: string) => Boolean(baseSectionsMap[s]))
    : ALL_SECTION_IDS;
  return sectionIds.map((id: string) => {
    const base = baseSectionsMap[id];
    if (!base) return null;

    // Mezclar requiredFields y examples de la data específica
    const requiredFields = customConfig.requiredFields || {};
    const examples = customConfig.examples || {};
    const examplesEn = customConfig.examplesEn || {};

    return {
      ...base,
      title: base.title, // Mantén el objeto multi-idioma
      fields: base.fields.map((field: any) => {
        const configSectionKey = SECTION_ID_TO_CONFIG_KEY[id] || id.toLowerCase();
        const fieldPath = `${configSectionKey}.${field.name}`;
        // Mezclar required
        let required = field.required;
        if (typeof requiredFields[fieldPath] === 'boolean') {
          required = requiredFields[fieldPath];
        } else if (typeof customConfig.requiredFieldsEn?.[fieldPath] === 'boolean') {
          required = customConfig.requiredFieldsEn[fieldPath];
        }
        // Mezclar example multi-idioma
        let example = field.example;
        if (examples[fieldPath] || examplesEn[fieldPath]) {
          const esValue = examples[fieldPath] || (typeof example === 'object' ? example.es : '');
          const enRawValue = examplesEn[fieldPath];
          const baseEnValue = typeof example === 'object' ? example.en : '';
          const enValue = enRawValue && enRawValue !== esValue ? enRawValue : baseEnValue;

          example = {
            es: esValue,
            en: enValue,
          };
        }
        return {
          ...field,
          label: field.label, // Mantén el objeto multi-idioma
          tip: field.tip,     // Mantén el objeto multi-idioma
          example,
          required,
        };
      }),
    };
  }).filter(Boolean);
}

// --- 3. IMPORTACIÓN DE CONFIGURACIONES ESPECÍFICAS (SIMULADO) ---
async function main() {
  const allConfigs = [
    // TECHNOLOGY & ENGINEERING
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.EMPLOYMENT,
      data: mergeLangSection(EStechnologyEngineeringEmployment, ENtechnologyEngineeringEmployment),
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.INTERNSHIP,
      data: mergeLangSection(EStechnologyEngineeringInternship, ENtechnologyEngineeringInternship),
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        EStechnologyEngineeringExchangeProgram, 
        ENtechnologyEngineeringExchangeProgram
      ),
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.SCHOLARSHIP,
      data: mergeLangSection(
        EStechnologyEngineeringScholarship, 
        ENtechnologyEngineeringScholarship),
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.STARTUP,
      data: mergeLangSection(
        EStechnologyEngineeringScholarship, 
        ENtechnologyEngineeringScholarship),
    },

    // MARKETING & STRATEGY
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.EMPLOYMENT,
      data: mergeLangSection(
        ESmarketingStrategyEmployment, 
        ENmarketingStrategyEmployment),
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.INTERNSHIP,
      data: mergeLangSection(
        ESmarketingStrategyInternship, 
        ENmarketingStrategyInternship),
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESmarketingStrategyExchangeProgram,
        ENmarketingStrategyExchangeProgram,
      ),
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.SCHOLARSHIP,
      data: mergeLangSection(
        ESmarketingStrategyScholarship, 
        ENmarketingStrategyScholarship),
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.STARTUP,
      data: mergeLangSection(
        ESmarketingStrategyScholarship, 
        ENmarketingStrategyScholarship),
    },

    // FINANCE & PROJECTS
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.EMPLOYMENT,
      data: mergeLangSection(
        ESfinanceProjectsEmployment, 
        ENfinanceProjectsEmployment),
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.INTERNSHIP,
      data: mergeLangSection(
        ESfinanceProjectsInternship, 
        ENfinanceProjectsInternship),
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESfinanceProjectsExchangeProgram,
        ENfinanceProjectsExchangeProgram,
      ),
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.SCHOLARSHIP,
      data: mergeLangSection(
        ESfinanceProjectsScholarship, 
        ENfinanceProjectsScholarship),
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.STARTUP,
      data: mergeLangSection(
        ESfinanceProjectsScholarship, 
        ENfinanceProjectsScholarship),
    },

    // MANAGEMENT & BUSINESS
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.EMPLOYMENT,
      data: mergeLangSection(
        ESmanagementBusinessEmployment,
        ENmanagementBusinessEmployment
      ),
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.INTERNSHIP,
      data: mergeLangSection(
        ESmanagementBusinessInternship,
        ENmanagementBusinessInternship
      ),
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESmanagementBusinessExchangeProgram,
        ENmanagementBusinessExchangeProgram
      ),
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.SCHOLARSHIP,
      data: mergeLangSection(
        ESmanagementBusinessScholarship,
        ENmanagementBusinessScholarship
      ),
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.STARTUP,
      data: mergeLangSection(
        ESmanagementBusinessScholarship,
        ENmanagementBusinessScholarship
      ),
    },

    // SCIENCE
    { 
      type: CvType.SCIENCE, 
      opp: OpportunityType.EMPLOYMENT, 
      data: mergeLangSection(
        ESscienceEmployment, 
        ENscienceEmployment) },
    { 
      type: CvType.SCIENCE, 
      opp: OpportunityType.INTERNSHIP, 
      data: mergeLangSection(
        ESscienceInternship, 
        ENscienceInternship
      ) },
    { 
      type: CvType.SCIENCE, 
      opp: OpportunityType.EXCHANGE_PROGRAM, 
      data: mergeLangSection(
        ESscienceExchangeProgram, 
        ENscienceExchangeProgram
      ) },
    { 
      type: CvType.SCIENCE, 
      opp: OpportunityType.SCHOLARSHIP, 
      data: mergeLangSection(
        ESscienceScholarship, 
        ENscienceScholarship
      ) },
    { 
      type: CvType.SCIENCE, 
      opp: OpportunityType.STARTUP, 
      data: mergeLangSection(
        ESscienceScholarship, 
        ENscienceScholarship
      ) },

    // SOCIAL MEDIA
    { 
      type: CvType.SOCIAL_MEDIA, 
      opp: OpportunityType.EMPLOYMENT, 
      data: mergeLangSection(
        ESsocialMediaEmployment, 
        ENsocialMediaEmployment) },
    { 
      type: CvType.SOCIAL_MEDIA, 
      opp: OpportunityType.INTERNSHIP, 
      data: mergeLangSection(
        ESsocialMediaInternship, 
        ENsocialMediaInternship) },
    {
      type: CvType.SOCIAL_MEDIA,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESsocialMediaExchangeProgram, 
        ENsocialMediaExchangeProgram
      ),
    },
    { 
      type: CvType.SOCIAL_MEDIA, 
      opp: OpportunityType.SCHOLARSHIP, 
      data: mergeLangSection(
        ESsocialMediaScholarship, 
        ENsocialMediaScholarship) },
    { 
      type: CvType.SOCIAL_MEDIA, 
      opp: OpportunityType.STARTUP, 
      data: mergeLangSection(
        ESsocialMediaScholarship, 
        ENsocialMediaScholarship
      ) },

    // EDUCATION
    { 
      type: CvType.EDUCATION, 
      opp: OpportunityType.EMPLOYMENT, 
      data: mergeLangSection(
        ESeducationEmployment, 
        ENeducationEmployment
      ) },
    { 
      type: CvType.EDUCATION, 
      opp: OpportunityType.INTERNSHIP, 
      data: mergeLangSection(
        ESeducationInternship, 
        ENeducationInternship
      ) },
    {
      type: CvType.EDUCATION,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESeducationExchangeProgram, 
        ENeducationExchangeProgram),
    },
    { 
      type: CvType.EDUCATION, 
      opp: OpportunityType.SCHOLARSHIP, 
      data: mergeLangSection(
        ESeducationScholarship, 
        ENeducationScholarship) },
    { 
      type: CvType.EDUCATION, 
      opp: OpportunityType.STARTUP, 
      data: mergeLangSection(
        ESeducationScholarship, 
        ENeducationScholarship
      ) },

    // DESIGN & CREATIVITY
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.EMPLOYMENT,
      data: mergeLangSection(
        ESdesignCreativityEmployment, 
        ENdesignCreativityEmployment),
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.INTERNSHIP,
      data: mergeLangSection(
        ESdesignCreativityInternship, 
        ENdesignCreativityInternship),
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: mergeLangSection(
        ESdesignCreativityExchangeProgram, 
        ENdesignCreativityExchangeProgram),
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.SCHOLARSHIP,
      data: mergeLangSection(
        ESdesignCreativityScholarship, 
        ENdesignCreativityScholarship),
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.STARTUP,
      data: mergeLangSection(
        ESdesignCreativityScholarship, 
        ENdesignCreativityScholarship),
    }, // Usando scholarship como fallback puesto que startup no tiene config específica aún
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
