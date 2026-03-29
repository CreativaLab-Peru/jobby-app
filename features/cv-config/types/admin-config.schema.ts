import { z } from "zod";

export const CvSectionFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "textarea", "email", "number", "tags", "date"]),
  label: z.string(),
  placeholder: z.string().optional(),
  tip: z.string().optional(),
  example: z.string().optional(),
  required: z.boolean().default(false),
});

export const CvSectionConfigItemSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  multiple: z.boolean().optional(),
  fields: z.array(CvSectionFieldSchema),
});

export const UpdateCvConfigSchema = z.object({
  id: z.string(),
  sections: z.array(CvSectionConfigItemSchema),
});

export type CvSectionConfigItem = z.infer<typeof CvSectionConfigItemSchema>;
