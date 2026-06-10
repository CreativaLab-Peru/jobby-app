import { z } from "zod";
import { ScholarshipType } from "@prisma/client";

export const scholarshipCreateSchema = z.object({
  countryId: z.string().uuid("Selecciona un país"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  type: z.nativeEnum(ScholarshipType, {
    message: "Selecciona un tipo de beca",
  }),
  requirements: z
    .array(z.string())
    .min(1, "Agrega al menos un requisito"),
  benefits: z.array(z.string()).min(1, "Agrega al menos un beneficio"),
  deadline: z
    .string()
    // .datetime({ message: "Formato de fecha inválido" })
    .optional()
    .or(z.literal("")),
  url: z.string().url("Ingresa una URL válida"),
  isActive: z.boolean().default(true),
});

export const scholarshipUpdateSchema = scholarshipCreateSchema.partial();

export type ScholarshipCreateInput = z.infer<typeof scholarshipCreateSchema>;
export type ScholarshipUpdateInput = z.infer<typeof scholarshipUpdateSchema>;
