import { User, Briefcase, GraduationCap, Award, Code, Languages } from "lucide-react"
import type { CVSection } from "@/types/cv"


export const personalSection: CVSection = {
  id: "personal",
  title: "Información Personal",
  icon: User,
  fields: [
    {
      name: "fullName",
      label: "Nombre Completo",
      type: "text",
      required: true,
      tip: "Usa tu nombre completo como aparece en documentos oficiales",
      example: "John Doe",
    },
    {
      name: "address",
      label: "Dirección (opcional)",
      type: "text",
      required: false,
      tip: "Incluye únicamente ciudad y país. Evita detalles específicos por privacidad",
      example: "Cusco, Perú",
    },
    {
      name: "linkedin",
      label: "LinkedIn (opcional, recomendado)",
      type: "text",
      required: false,
      tip: "Incluye el enlace completo a tu perfil de LinkedIn",
      example: "linkedin.com/in/john-doe",
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "tel",
      required: true,
      tip: "Incluye código de tu país si buscas oportunidades internacionales",
      example: "+51 912345678",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      tip: "Usa un email profesional, evita apodos o números innecesarios",
      example: "john.doe@example.com",
    },
    {
      name: "summary",
      label: "Resumen Profesional",
      type: "textarea",
      required: true,
      tip: "Describe en 2-3 líneas tu perfil, objetivos y valor único. Enfócate en lo que buscas lograr",
      example: "Profesional con experiencia en...",
    },
  ],
}

export const projectsSection: CVSection = {
  id: "projects",
  title: "Proyectos y Voluntariados",
  icon: Code,
  multiple: true,
  fields: [
    {
      name: "title",
      label: "Título del Proyecto",
      type: "text",
      required: true,
      tip: "Usa un título claro y descriptivo que refleje el objetivo del proyecto",
      example: "Sistema de Gestión de Inventario con IA",
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
      tip: "Explica qué hiciste, cómo lo hiciste y qué resultados obtuviste. Usa verbos de acción",
      example: "Desarrollé una aplicación web...",
    },
    {
      name: "technologies",
      label: "Tecnologías/Herramientas",
      type: "text",
      required: false,
      tip: "Lista las tecnologías principales separadas por comas",
      example: "Python, TensorFlow, React, PostgreSQL, Docker",
    },
    {
      name: "duration",
      label: "Duración",
      type: "text",
      required: false,
      tip: "Indica el tiempo que tomó el proyecto",
      example: "6 meses (Ago 2023 - Ene 2024)",
    },
  ],
}

export const experienceSection: CVSection = {
  id: "experience",
  title: "Experiencia Profesional",
  icon: Briefcase,
  multiple: true,
  fields: [
    {
      name: "company",
      label: "Empresa",
      type: "text",
      required: true,
      tip: "Nombre completo de la empresa u organización",
      example: "TechSolutions México S.A. de C.V.",
    },
    {
      name: "location",
      label: "Ubicación",
      type: "text",
      required: true,
      tip: "Ciudad y país donde se encuentra la empresa",
      example: "Lima, Perú",
    },
    {
      name: "position",
      label: "Cargo",
      type: "text",
      required: true,
      tip: "Usa el título oficial del puesto",
      example: "Desarrollador Frontend Junior",
    },
    {
      name: "duration",
      label: "Duración",
      type: "text",
      required: true,
      tip: "Formato: Mes Año - Mes Año o 'Presente' si continúas",
      example: "Enero 2023 - Presente",
    },
    {
      name: "responsibilities",
      label: "Responsabilidades",
      type: "textarea",
      required: true,
      tip: "Lista 3-5 logros específicos usando verbos de acción y métricas cuando sea posible.",
      example: "• Desarrollé 15+ componentes reutilizables en React...",
    },
  ],
}

export const educationSection: CVSection = {
  id: "education",
  title: "Educación",
  icon: GraduationCap,
  multiple: true,
  fields: [
    {
      name: "level",
      label: "Nivel Educativo",
      type: "select",
      required: true,
      options: ["SECUNDARIA", "BACHILLER", "TECNICO", "LICENCIADO", "MAESTRIA", "DOCTORADO", "OTRO"],
      tip: "Selecciona el nivel más alto que estés cursando o hayas completado",
    },
    {
      name: "title",
      label: "Título/Carrera/Especialidad",
      type: "text",
      required: true,
      tip: "Usa el nombre oficial completo de tu carrera o programa",
      example: "Ingeniería Informática y de Sistemas",
    },
    {
      name: "institution",
      label: "Institución",
      type: "text",
      required: true,
      tip: "Nombre completo de la institución educativa",
      example: "Universidad Nacional de San Antonio Abad del Cusco",
    },
    {
      name: "location",
      label: "Ubicación",
      type: "text",
      required: true,
      tip: "Ciudad y país donde se encuentra la institución",
      example: "Cusco, Perú",
    },
    {
      name: "year",
      label: "Año de Graduación/Finalización",
      type: "text",
      required: true,
      tip: "Si estás estudiando, usa 'Esperado Mes 2025' o el año y mes que planeas graduarte",
      example: "Jul 2024",
    },
    {
      name: "honors",
      label: "Honores (opcional)",
      type: "text",
      required: false,
      tip: "Incluye menciones como 'Tercio Superior', 'Magna Cum Laude', concursos, becas, etc.",
      example: "Tercio Superior de la promoción",
    },
  ],
}

export const achievementsSection: CVSection = {
  id: "achievements",
  title: "Logros y Reconocimientos",
  icon: Award,
  multiple: true,
  fields: [
    {
      name: "title",
      label: "Título del Logro",
      type: "text",
      required: true,
      tip: "Sé específico sobre el reconocimiento o logro obtenido",
      example: "Primer lugar en Hackathon Nacional de Innovación Tecnológica",
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
      tip: "Explica el contexto, tu contribución y el impacto del logro",
      example: "Lideré un equipo de 4 personas para desarrollar una solución...",
    },
    {
      name: "date",
      label: "Fecha",
      type: "text",
      required: false,
      tip: "Mes y año del reconocimiento",
      example: "Marzo 2024",
    },
  ],
}

export const certificationsSection: CVSection = {
  id: "certifications",
  title: "Certificación",
  icon: Award,
  multiple: true,
  fields: [
    {
      name: "name",
      label: "Nombre de la Certificación",
      type: "text",
      required: true,
      tip: "Nombre oficial completo de la certificación",
      example: "AWS Certified Cloud Practitioner",
    },
    {
      name: "issuer",
      label: "Emisor",
      type: "text",
      required: true,
      tip: "Organización que otorgó la certificación",
      example: "Amazon Web Services",
    },
    {
      name: "date",
      label: "Fecha de Obtención",
      type: "text",
      required: false,
      tip: "Mes y año de obtención",
      example: "Junio 2024",
    },
  ],
}

export const skillsSection: CVSection = {
  id: "skills",
  title: "Habilidades",
  icon: Languages,
  fields: [
    {
      name: "technical",
      label: "Habilidades Técnicas",
      type: "tags",
      required: true,
      tip: "Lista tecnologías, herramientas y lenguajes que dominas. Ordena por nivel de experiencia",
      example: "JavaScript, Python, React, Node.js, SQL, Git",
    },
    {
      name: "soft",
      label: "Habilidades Blandas",
      type: "tags",
      required: true,
      tip: "Incluye habilidades interpersonales y de liderazgo relevantes para tu objetivo",
      example: "Liderazgo, Comunicación efectiva, Trabajo en equipo, Resolución de problemas",
    },
    {
      name: "languages",
      label: "Idiomas",
      type: "tags",
      required: false,
      tip: "Incluye nivel de dominio (Básico, Intermedio, Avanzado, Nativo)",
      example: "Español (Nativo), Inglés (Avanzado), Francés (Intermedio)",
    },
  ],
}

export const baseSectionsMap: Record<string, CVSection> = {
  personal: personalSection,
  projects: projectsSection,
  experience: experienceSection,
  education: educationSection,
  achievements: achievementsSection,
  certifications: certificationsSection,
  skills: skillsSection,
}
