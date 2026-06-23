export const MENTORIA_PRICE = 250;

export const CHEVENING_OPTIONS = [
  "Sí, en la convocatoria de este año (ago–nov 2026)",
  "Sí, el próximo año",
  "Estoy evaluando otras becas (Fulbright, DAAD, Erasmus)",
  "Aún no lo tengo claro",
] as const;

export type CheveningOption = (typeof CHEVENING_OPTIONS)[number];

export interface MentoriaRequestData {
  name: string;
  email: string;
  whatsapp: string;
  cheveningPlan: CheveningOption | string;
}

export type MentoriaStep = "landing" | "form" | "sent";
