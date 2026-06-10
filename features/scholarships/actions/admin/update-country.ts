"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { countryUpdateSchema, type CountryUpdateInput } from "@/features/scholarships/schemas/country.schema";

export interface UpdateCountryFormState {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof CountryUpdateInput, string>>;
}

const initialState: UpdateCountryFormState = { success: false };

export async function updateCountryAction(
  countryId: string,
  _prevState: UpdateCountryFormState,
  formData: FormData
): Promise<UpdateCountryFormState> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { ...initialState, message: admin.error };
  }

  const rawData: Record<string, string> = {
    name: formData.get("name") as string ?? "",
    code: formData.get("code") as string ?? "",
    flag: formData.get("flag") as string ?? "",
  };

  const parsed = countryUpdateSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CountryUpdateInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] as keyof CountryUpdateInput;
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
    // Check if country exists
    const existing = await prisma.country.findUnique({
      where: { id: countryId },
    });

    if (!existing) {
      return { success: false, message: "País no encontrado" };
    }

    // Check for duplicate code (if code changed)
    if (parsed.data.code && parsed.data.code !== existing.code) {
      const duplicate = await prisma.country.findUnique({
        where: { code: parsed.data.code },
      });

      if (duplicate) {
        return {
          success: false,
          fieldErrors: { code: "Este código ya existe" },
          message: "El código del país ya está en uso",
        };
      }
    }

    await prisma.country.update({
      where: { id: countryId },
      data: {
        name: parsed.data.name ?? existing.name,
        code: parsed.data.code ? parsed.data.code.toUpperCase() : existing.code,
        flag: parsed.data.flag ?? existing.flag,
      },
    });

    revalidatePath("/admin/countries");
    revalidatePath(`/admin/countries/${countryId}`);

    return {
      success: true,
      message: "País actualizado exitosamente",
    };
  } catch (error) {
    console.error("[updateCountryAction]", error);
    return {
      success: false,
      message: "Error al actualizar el país",
    };
  }
}