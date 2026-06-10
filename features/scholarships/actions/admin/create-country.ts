"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { countryCreateSchema, type CountryCreateInput } from "@/features/scholarships/schemas/country.schema";

export interface CreateCountryFormState {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof CountryCreateInput, string>>;
  data?: {
    id: string;
    name: string;
    code: string;
  };
}

const initialState: CreateCountryFormState = { success: false };

export async function createCountryAction(
  _prevState: CreateCountryFormState,
  formData: FormData
): Promise<CreateCountryFormState> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { ...initialState, message: admin.error };
  }

  const rawData: Record<string, string> = {
    name: formData.get("name") as string ?? "",
    code: formData.get("code") as string ?? "",
    flag: formData.get("flag") as string ?? "",
  };

  const parsed = countryCreateSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CountryCreateInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] as keyof CountryCreateInput;
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return {
      success: false,
      fieldErrors,
      message: "Revisa los campos marcados",
    };
  }

  try {
    // Check for duplicate code
    const existing = await prisma.country.findUnique({
      where: { code: parsed.data.code },
    });

    if (existing) {
      return {
        success: false,
        fieldErrors: { code: "Este código ya existe" },
        message: "El código del país ya está en uso",
      };
    }

    const country = await prisma.country.create({
      data: {
        name: parsed.data.name,
        code: parsed.data.code.toUpperCase(),
        flag: parsed.data.flag,
      },
    });

    revalidatePath("/admin/countries");

    return {
      success: true,
      message: "País creado exitosamente",
      data: {
        id: country.id,
        name: country.name,
        code: country.code,
      },
    };
  } catch (error) {
    console.error("[createCountryAction]", error);
    return {
      success: false,
      message: "Error al crear el país",
    };
  }
}