import { z } from "zod";

export const countryCreateSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(3, "El código debe tener máximo 3 caracteres")
    .regex(/^[A-Z]+$/, "Código en mayúsculas (ej: UK, US, PE)"),
  flag: z.string().min(1, "Agrega una bandera (emoji o URL)"),
});

export const countryUpdateSchema = countryCreateSchema.partial();

export type CountryCreateInput = z.infer<typeof countryCreateSchema>;
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>;