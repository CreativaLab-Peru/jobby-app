import { CvType, OpportunityType, Language } from "@prisma/client";
import * as z from "zod";

export const cvFormSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(50, "Título demasiado largo"),
  cvType: z.enum(CvType, "Selecciona un perfil profesional válido"),
  opportunityType: z.enum(OpportunityType,"Selecciona un tipo de oportunidad"),
  templateId: z.string().optional(),
  language: z.enum(Language, "Selecciona un tipo de oportunidad"),
}).refine((data) => {
  if (["INTERNSHIP", "SCHOLARSHIP"].includes(data.opportunityType)) {
    return !!data.templateId;
  }
  return true;
}, {
  message: "Debes seleccionar un diseño para este tipo de oportunidad",
  path: ["templateId"],
});

export type CVFormData = z.infer<typeof cvFormSchema>;
