import { prisma } from "@/lib/prisma";
import {
  InviteCandidate,
  sendCompanyInvitationEmail
} from "@/features/company/services/company-invitation.service";
import crypto from "node:crypto";
import {hmacSha256} from "@/utils/hmac";

const INVITATION_TTL_HOURS = 48;

export async function resendInvitationIfNeeded(invitationId: string) {
  const COOLDOWN_MINUTES = 2;
  const now = new Date();

  // Seleccionamos exactamente lo necesario para construir el InviteCandidate
  const invitation = await prisma.companyInvitation.findUnique({
    where: { id: invitationId },
    include: {
      company: {
        select: { name: true, slug: true }
      }
    }
  });

  if (!invitation) return false;

  // Update invitation with new code
  const token = crypto.randomUUID();
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = new Date(Date.now() + INVITATION_TTL_HOURS * 60 * 60 * 1000);
  const codeHash = hmacSha256(`${token}:${code}`);

  await prisma.companyInvitation.update({
    where: { id: invitationId},
    data: {
      code,
      token,
      codeHash,
      expiresAt
    }
  })

  // Lógica de Rate Limiting (2 minutos)
  const canSend = !invitation.lastSentAt ||
    (now.getTime() - invitation.lastSentAt.getTime()) > COOLDOWN_MINUTES * 60 * 1000;

  if (canSend) {
    // Mapeo al contrato InviteCandidate
    const candidate: InviteCandidate = {
      id: invitation.id,
      companyId: invitation.companyId,
      companyName: invitation.company.name,
      companySlug: invitation.company.slug,
      email: invitation.email,
      token,
      code,
      codeHash,
      expiresAt,
      role: invitation.role,
    };

    // 1. Enviar correo usando el método existente
    await sendCompanyInvitationEmail(candidate);

    // 2. Actualizar marca de tiempo de envío
    await prisma.companyInvitation.update({
      where: { id: invitationId },
      data: { lastSentAt: now }
    });

    return true;
  }

  return false;
}
