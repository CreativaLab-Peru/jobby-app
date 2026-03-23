import {
  Code2, Palette, Megaphone, BarChart3,
  Coins, Share2, GraduationCap, Microscope, FileText
} from "lucide-react";

export const CV_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
  TECHNOLOGY_ENGINEERING: { label: "Inteligencia Artificial, Ingeniería y Sistemas", icon: Code2, colorClass: "text-blue-500" },
  DESIGN_CREATIVITY: { label: "Creatividad Digital & Multimedia", icon: Palette, colorClass: "text-pink-500" },
  MARKETING_STRATEGY: { label: "Innovación & Estrategia de Negocios", icon: Megaphone, colorClass: "text-orange-500" },
  MANAGEMENT_BUSINESS: { label: "Gestión, Innovación y Emprendimiento", icon: BarChart3, colorClass: "text-emerald-500" },
  FINANCE_PROJECTS: { label: "Ciencia de Datos & Finanzas Cuantitativas", icon: Coins, colorClass: "text-cyan-600" },
  SOCIAL_MEDIA: { label: "Contenido Digital y Redes Sociales", icon: Share2, colorClass: "text-purple-500" },
  EDUCATION: { label: "Políticas Públicas y Desarrollo Humano", icon: GraduationCap, colorClass: "text-amber-500" },
  SCIENCE: { label: "Salud, BioTech y Sostenibilidad", icon: Microscope, colorClass: "text-indigo-500" },
  GENERAL: { label: "General", icon: FileText, colorClass: "text-muted-foreground bg-muted" },
};

export const OPPORTUNITY_CONFIG: Record<string, string> = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
  STARTUP: "Aceleradora",
};

// Map value and label for select options
export const cvTypeOptions = Object.entries(CV_TYPE_CONFIG).map(([value, { label }]) => ({ value, label }));

// Map CvType
export const CvSectionType = {
  SUMMARY: "Resumida",
  EXPERIENCE: "Experiencia",
  EDUCATION: "Educación",
  SKILLS: "Habilidades",
  PROJECTS: "Proyectos",
  VOLUNTEERING: "Voluntariado",
  CERTIFICATIONS: "Certificaciones",
  LANGUAGES: "Idiomas",
  CONTACT: "Contacto",
  COMPLEMENTS: "Complementos",
  ACHIEVEMENTS: "Logros",
  INTERESTS: "Intereses",
}
