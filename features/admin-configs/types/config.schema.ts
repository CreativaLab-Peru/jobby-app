import { z } from "zod";

export const configSchema = z.object({
  key: z.string().min(1, "La clave es requerida"),
  value: z.string().min(1, "El valor es requerido"),
});

export type ConfigInput = z.infer<typeof configSchema>;
