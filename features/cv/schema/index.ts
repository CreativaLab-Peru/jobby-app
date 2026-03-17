import { CvType, OpportunityType, Language } from "@prisma/client";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const cvFormSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(50, "Título demasiado largo"),
  cvType: z.enum(CvType, "Selecciona un perfil profesional válido"),
  opportunityType: z.enum(OpportunityType,"Selecciona un tipo de oportunidad"),
  templateId: z.string().optional(),
  language: z.enum(Language, "Selecciona un idioma"),
}).refine((data) => {
  if (["INTERNSHIP", "SCHOLARSHIP"].includes(data.opportunityType)) {
    return !!data.templateId;
  }
  return true;
}, {
  message: "Debes seleccionar un diseño para este tipo de oportunidad",
  path: ["templateId"],
});

export const uploadCvSchema = z.object({
  file: z.instanceof(File, { message: "El archivo es requerido" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "El archivo excede los 5MB")
    .refine((file) => file.type === "application/pdf", "Solo se permiten archivos PDF"),
  title: z.string().min(1, "El título es requerido").max(100, "Título demasiado largo"),
  cvType: z.enum(CvType, "Selecciona un tipo de oportunidad"),
  opportunityType: z.enum(OpportunityType),
  templateId: z.string().default("harvard"),
});

export type CVFormData = z.infer<typeof cvFormSchema>;
export type UploadCvFormValues = z.infer<typeof uploadCvSchema>;
