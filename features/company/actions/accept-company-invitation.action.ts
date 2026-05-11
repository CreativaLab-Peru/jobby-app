"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { companyInvitationAcceptSchema } from "@/features/company/schemas/company-invitation.schema";
import { verifyInvitationCode } from "@/features/company/services/company-invitation.service";
import { InvitationStatus } from "@prisma/client";

type CompanyInvitationAcceptInput = z.infer<typeof companyInvitationAcceptSchema>;

export type AcceptCompanyInvitationState =
  | {
      success: true;
      message: string;
      companyId: string;
      fieldErrors?: Partial<Record<keyof CompanyInvitationAcceptInput, string>>;
    }
  | {
      success: false;
      error: string;
      requiresAuth?: boolean;
      fieldErrors?: Partial<Record<keyof CompanyInvitationAcceptInput, string>>;
    };

const parseFieldErrors = (issues: z.ZodIssue[]) => {
  const fieldErrors: Partial<Record<keyof CompanyInvitationAcceptInput, string>> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key as keyof CompanyInvitationAcceptInput]) {
      fieldErrors[key as keyof CompanyInvitationAcceptInput] = issue.message;
    }
  }

  return fieldErrors;
};

export const acceptCompanyInvitationAction = async (
  _prevState: AcceptCompanyInvitationState,
  formData: FormData,
): Promise<AcceptCompanyInvitationState> => {
  try {
    const parsed = companyInvitationAcceptSchema.safeParse({
      token: formData.get("token"),
      email: formData.get("email"),
      code: formData.get("code"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: "Revisa los campos marcados",
        fieldErrors: parseFieldErrors(parsed.error.issues as any),
      };
    }

    const invitation = await prisma.companyInvitation.findUnique({
      where: { token: parsed.data.token },
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    if (!invitation) {
      return { success: false, error: "La invitación no existe o ya no está disponible." };
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "Esta invitación ya fue utilizada o cancelada." };
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });

      return { success: false, error: "La invitación expiró." };
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    if (normalizedEmail !== invitation.email.toLowerCase()) {
      return { success: false, error: "El correo no coincide con la invitación." };
    }

    if (!verifyInvitationCode(parsed.data.token, parsed.data.code, invitation.codeHash)) {
      return { success: false, error: "El código es incorrecto." };
    }

    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session?.user) {
    //   return {
    //     success: false,
    //     error: "Debes iniciar sesión para aceptar la invitación.",
    //     requiresAuth: true,
    //   };
    // }
    //
    // const user = session.user;
    // if (user.email.toLowerCase() !== normalizedEmail) {
    //   return {
    //     success: false,
    //     error: "Debes iniciar sesión con el mismo correo de la invitación.",
    //     requiresAuth: true,
    //   };
    // }
    //
    // await prisma.$transaction(async (tx) => {
    //   await tx.companyMember.upsert({
    //     where: {
    //       companyId_userId: {
    //         companyId: invitation.companyId,
    //         userId: user.id,
    //       },
    //     },
    //     create: {
    //       companyId: invitation.companyId,
    //       userId: user.id,
    //       role: invitation.role,
    //       invitedBy: invitation.invitedBy,
    //       joinedAt: new Date(),
    //     },
    //     update: {
    //       status: "ACTIVE",
    //       role: invitation.role,
    //       joinedAt: new Date(),
    //     },
    //   });
    //
    //   await tx.companyInvitation.update({
    //     where: { id: invitation.id },
    //     data: {
    //       status: InvitationStatus.ACCEPTED,
    //       usedAt: new Date(),
    //     },
    //   });
    // });

    // await Promise.all([
    //   revalidatePath(routes.app.dashboard),
    //   revalidatePath(`${routes.app.admin.companies.root}/${invitation.companyId}/invitations`),
    // ]);

    return {
      success: true,
      message: `Ya formas parte de ${invitation.company.name}`,
      companyId: invitation.companyId,
    };
  } catch (error) {
    console.error("[ACCEPT_COMPANY_INVITATION_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No pudimos aceptar la invitación",
    };
  }
};

