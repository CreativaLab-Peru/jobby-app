import { z } from "zod";

export const updateUsernameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
});

export type UpdateUsernameValues = z.infer<typeof updateUsernameSchema>;
