import { DiagnosticStatus, ScholarshipType } from "@prisma/client";

export interface DiagnosticoCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
}

export interface DiagnosticoScholarshipType {
  id: ScholarshipType;
  label: string;
  description: string;
  icon: string;
}

export interface DiagnosticoArea {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface DiagnosticoSession {
  id: string;
  token: string;
  email: string;
  name?: string;
  status: DiagnosticStatus;
  countries: string[];
  scholarshipType?: ScholarshipType;
  area?: string;
  cvUrl?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface DiagnosticoResult {
  id: string;
  sessionId: string;
  email: string;
  name?: string;
  resultJson: object;
  overallScore?: number;
  profileType?: string;
  profileDescription?: string;
  recommendations?: object[];
  opportunities?: object[];
  emailSent: boolean;
  createdAt: Date;
}

export interface DiagnosticoOpportunity {
  id: string;
  name: string;
  country: DiagnosticoCountry;
  type: ScholarshipType;
  requirements: string[];
  benefits: string[];
  deadline?: Date;
  url: string;
  matchPercentage?: number;
}

// Constants for the onboarding flow
export const DIAGNOSTICO_COUNTRIES: DiagnosticoCountry[] = [
  { id: "UK", name: "Reino Unido", code: "UK", flag: "🇬🇧" },
  { id: "US", name: "Estados Unidos", code: "US", flag: "🇺🇸" },
  { id: "DE", name: "Alemania", code: "DE", flag: "🇩🇪" },
  { id: "EU", name: "Francia / Europa", code: "EU", flag: "🇫🇷" },
  { id: "JP", name: "Japón", code: "JP", flag: "🇯🇵" },
];

export const DIAGNOSTICO_SCHOLARSHIP_TYPES: DiagnosticoScholarshipType[] = [
  {
    id: "MASTER",
    label: "Maestría",
    description: "MSc / MA / MBA · 1–2 años · Fully funded disponibles",
    icon: "🎓",
  },
  {
    id: "PHD",
    label: "Doctorado / Investigación",
    description: "PhD · Investigación postdoctoral · DAAD, Fulbright Research",
    icon: "🔬",
  },
  {
    id: "FELLOWSHIP",
    label: "Fellowship académico",
    description: "Liderazgo con componente académico · Chevening, Mandela",
    icon: "🏛️",
  },
];

export const DIAGNOSTICO_AREAS: DiagnosticoArea[] = [
  {
    id: "TECH",
    label: "Tecnología e Innovación",
    icon: "💻",
    description: "Ingeniería, software, datos, IA, ciberseguridad",
  },
  {
    id: "SOCIAL",
    label: "Ciencias Sociales e Impacto",
    icon: "🌱",
    description: "Desarrollo, educación, salud pública, medio ambiente",
  },
  {
    id: "BUSINESS",
    label: "Negocios y Economía",
    icon: "📊",
    description: "Administración, finanzas, economía, gestión pública",
  },
  {
    id: "HEALTH",
    label: "Salud y Ciencias de la vida",
    icon: "⚕️",
    description: "Medicina, biología, biotecnología, nutrición",
  },
  {
    id: "LAW",
    label: "Derecho y Políticas públicas",
    icon: "⚖️",
    description: "Derecho internacional, relaciones exteriores, política",
  },
  {
    id: "ARTS",
    label: "Artes, Comunicación y Humanidades",
    icon: "🎨",
    description: "Diseño, periodismo, literatura, historia, cultura",
  },
];

export const DIAGNOSTICO_PRICE = 19.90;
export const DIAGNOSTICO_PRICE_CENTS = 1990;
