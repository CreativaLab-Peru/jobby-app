import crypto from "node:crypto";

import { render } from "@react-email/render";
import { InvitationStatus, type CompanyRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { routes } from "@/lib/routes";
import { hmacSha256, safeEq } from "@/utils/hmac";
import { CompanyInvitationEmail } from "@/features/emails/templates/company-invitation-email";

const INVITATION_TTL_HOURS = 48;

export interface CreateCompanyInvitationParams {
  companyId: string;
  email: string;
  role: CompanyRole;
}

export interface InviteCandidate {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  email: string;
  token: string;
  code: string;
  codeHash: string;
  expiresAt: Date;
  role: CompanyRole;
}

export const createInvitationCandidate = async ({
  companyId,
  email,
  role,
}: CreateCompanyInvitationParams): Promise<InviteCandidate> => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, name: true, slug: true },
  });

  if (!company) {
    throw new Error("La empresa no existe");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = crypto.randomUUID();
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = new Date(Date.now() + INVITATION_TTL_HOURS * 60 * 60 * 1000);

  return {
    id: crypto.randomUUID(),
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
    email: normalizedEmail,
    token,
    code,
    codeHash: hmacSha256(`${token}:${code}`),
    expiresAt,
    role,
  };
};

export const persistInvitationCandidate = async (
  candidate: InviteCandidate,
  invitedBy?: string,
) => {
  return prisma.companyInvitation.create({
    data: {
      companyId: candidate.companyId,
      email: candidate.email,
      role: candidate.role,
      token: candidate.token,
      code: candidate.codeHash,
      codeHash: candidate.codeHash,
      invitedBy: invitedBy ?? null,
      expiresAt: candidate.expiresAt,
    },
    select: { id: true, token: true },
  });
};

export const sendCompanyInvitationEmail = async (candidate: InviteCandidate) => {
  const joinUrl = routes.website.joinInvitation(candidate.token);
  const expiresLabel = candidate.expiresAt.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    dateStyle: "long",
    timeStyle: "short",
  });

  const html = await render(
    CompanyInvitationEmail({
      companyName: candidate.companyName,
      email: candidate.email,
      code: candidate.code,
      joinUrl,
      expiresLabel,
    })
  );

  const { error } = await resend.emails.send({
    from: "Levely Business <contacto@joinlevely.com>",
    to: [candidate.email],
    subject: `Invitación para unirte a ${candidate.companyName}`,
    html,
  });

  if (error) {
    throw new Error("No pudimos enviar el correo de invitación");
  }
};

export const verifyInvitationCode = (token: string, code: string, codeHash: string) => {
  return safeEq(hmacSha256(`${token}:${code}`), codeHash);
};

