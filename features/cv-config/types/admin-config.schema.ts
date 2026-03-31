import { z } from "zod";

const langObject = z.object({ es: z.string(), en: z.string() });

export const CvSectionFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "textarea", "email", "number", "tags", "date"]),
  label: langObject,
  placeholder: z.string().optional(),
  tip: langObject.optional(),
  example: langObject.optional(),
  required: z.boolean().default(false),
});


export const CvSectionConfigItemSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: langObject,
  multiple: z.boolean().optional(),
  fields: z.array(CvSectionFieldSchema),
});

export const UpdateCvConfigSchema = z.object({
  id: z.string(),
  sections: z.array(CvSectionConfigItemSchema),
});

export type CvSectionConfigItem = z.infer<typeof CvSectionConfigItemSchema>;
