import {
  Code2, Palette, Megaphone, BarChart3,
  Coins, Share2, GraduationCap, Microscope, FileText
} from "lucide-react";

export const CV_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
  TECHNOLOGY_ENGINEERING: { label: "Ingeniería", icon: Code2, colorClass: "text-blue-500" },
  DESIGN_CREATIVITY: { label: "Diseño", icon: Palette, colorClass: "text-pink-500" },
  MARKETING_STRATEGY: { label: "Marketing", icon: Megaphone, colorClass: "text-orange-500" },
  MANAGEMENT_BUSINESS: { label: "Gestión", icon: BarChart3, colorClass: "text-emerald-500" },
  FINANCE_PROJECTS: { label: "Finanzas", icon: Coins, colorClass: "text-cyan-600" },
  SOCIAL_MEDIA: { label: "Social Media", icon: Share2, colorClass: "text-purple-500" },
  EDUCATION: { label: "Educación", icon: GraduationCap, colorClass: "text-amber-500" },
  SCIENCE: { label: "Ciencia", icon: Microscope, colorClass: "text-indigo-500" },
  GENERAL: { label: "General", icon: FileText, colorClass: "text-muted-foreground bg-muted" },
};

export const OPPORTUNITY_CONFIG: Record<string, string> = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
};

// Map value and label for select options
export const CV_TYPE_OPTIONS = Object.entries(CV_TYPE_CONFIG).map(([value, { label }]) => ({ value, label }));
