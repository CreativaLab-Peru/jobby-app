import {prisma} from "@/lib/prisma";
import {CompanyCreateInput} from "@/features/company/schemas/company.schema";
import { z } from "zod";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80) || "empresa";

export const normalizeOptional = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const parseFieldErrors = (issues: z.ZodIssue[]) => {
  const fieldErrors: Partial<Record<keyof CompanyCreateInput, string>> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key as keyof CompanyCreateInput]) {
      fieldErrors[key as keyof CompanyCreateInput] = issue.message;
    }
  }

  return fieldErrors;
};

export const ensureUniqueSlug = async (baseSlug: string) => {
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.company.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};
