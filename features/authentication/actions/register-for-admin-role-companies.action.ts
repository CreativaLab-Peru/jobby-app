"use server";

import {authClient} from "@/lib/auth-client";
import {
  registerForCompaniesSchema,
} from "@/features/authentication/schemas/register-schema";
import {prisma} from "@/lib/prisma";
import {CompanyRole, InvitationStatus} from "@prisma/client";

export interface RegisterForAdminRoleCompaniesAction {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  code: string;
  token: string;
  slug: string;
}

export async function registerForCompaniesAction(data: RegisterForAdminRoleCompaniesAction) {
  console.log("[data]:", data)
  const parsed = await registerForCompaniesSchema.safeParseAsync(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      formError: "Por favor corrige los errores en el formulario.",
    };
  }

  const {email, password, name, code, token} = parsed.data;

  const invitation = await prisma.companyInvitation.findFirst({
    where: {token, code},
    include: {company: {select: {id: true, slug: true}}}
  })
  if (!invitation) {
    return {
      success: false,
      formError: "Error al encontrar la invitacion",
    }
  }

  const status: InvitationStatus[] = [InvitationStatus.EXPIRED, InvitationStatus.ACCEPTED, InvitationStatus.CANCELLED];
  if (status.includes(invitation.status)) {
    return {
      success: false,
      formError: "El estado de invitacion es invalido",
    }
  }

  const response = await authClient.signUp.email({
    email,
    password,
    name,
  });
  if (response.error) {
    return {
      success: false,
      formError: response.error.message,
    };
  }

  // New member
  const newMember = await prisma.companyMember.create({
    data: {
      companyId: invitation.companyId,
      userId: response.data.user.id,
      role: CompanyRole.ENCARGADO,
      invitedBy: 'admin',
    }
  })

  if (!newMember) {
    return {
      success: false,
      formError: "No se pudo crear el nuevo miembro",
    }
  }

  await prisma.companyInvitation.update({
    where: {id: invitation.id},
    data: {
      status: InvitationStatus.ACCEPTED,
      expiresAt: new Date(),
      usedAt: new Date(),
    }
  })

  return {success: true, formError: null};
}
