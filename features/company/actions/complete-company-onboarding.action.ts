"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CompanyOnboardingFormData,
  companyOnboardingSchema,
} from "../schemas/company-onboarding.schema";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CompanyRole, CompanyOnboardingStatus, InvitationStatus } from "@prisma/client";
import { generateNumericCode } from "@/utils/digicts";
import { randomBytes } from "crypto";

export async function completeCompanyOnboardingAction(companyId: string, data: CompanyOnboardingFormData) {
  console.log({
    companyId,
    data,
  })
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No se ha encontrado el usuario." };
    }

    // Verificar si el usuario ya pertenece a una empresa
    const existingMembership = await prisma.companyMember.findFirst({
      where: { userId: currentUser.id, companyId },
    });

    if (!existingMembership) {
      return { success: false, error: "No existe el usuario" };
    }

    // Validar los datos con el esquema
    const parsed = companyOnboardingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos de formulario inválidos." };
    }

    const { name, logoUrl, ruc, website, primaryColor, seekingTypes, students, generalMembers } =
      parsed.data;

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear la empresa y sus relaciones en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la empresa
      const company = await tx.company.update({
        where: {id: companyId},
        data: {
          name,
          slug,
          logoUrl: logoUrl || "",
          ruc: ruc || "",
          website: website || "",
          primaryColor: primaryColor || "",
          onboardingStep: CompanyOnboardingStatus.COMPLETED,
        },
      });

      // 2. Crear las preferencias de la empresa
      await tx.companyPreference.upsert({
        where: {companyId},
        update: {
          companyId,
          seekingTypes,
        },
        create: {
          companyId,
          seekingTypes,
        }
      });

      // 3. Crear invitaciones para el equipo
      // const allInvitations = [...students, ...generalMembers];
      // for (const invite of allInvitations) {
      //   const token = randomBytes(32).toString("hex");
      //   const code = generateNumericCode();
      //
      //   await tx.companyInvitation.create({
      //     data: {
      //       companyId: company.id,
      //       email: invite.email,
      //       role: invite.role,
      //       token,
      //       code,
      //       codeHash: code, // Deberías hashearlo idealmente
      //       invitedBy: currentUser.id,
      //       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      //     },
      //   });
      //
      //   // TODO: Aquí se enviaría el correo en segundo plano
      // }

      return company;
    });

    revalidatePath("/dashboard/company");
    return { success: true, companyId: result.id };
  } catch (error) {
    console.error("[COMPLETE_COMPANY_ONBOARDING_ERROR]", error);
    return { success: false, error: "Ocurrió un error al procesar el onboarding." };
  }
}
