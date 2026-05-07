import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyJoinScreen } from "@/features/company/screens/company-join-screen";
import { prisma } from "@/lib/prisma";
import {
  resendInvitationIfNeeded
} from "@/features/company/actions/admin/resend-invitation-if-needed";

interface JoinInvitationPageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: JoinInvitationPageProps): Promise<Metadata> {
  const { token } = await params;
  const invitation = await prisma.companyInvitation.findUnique({
    where: { token },
    select: {
      status: true,
      company: { select: { name: true } },
    },
  });

  const companyName = invitation?.company?.name ?? "Levely Business";

  return {
    title: `Unirse a ${companyName} | Levely`,
    description: `Confirma tu invitación para formar parte de ${companyName}.`,
    robots: invitation?.status === "PENDING" ? { index: false, follow: false } : { index: false, follow: false },
  };
}

export default async function JoinInvitationPage({ params }: JoinInvitationPageProps) {
  const { token } = await params;

  const invitation = await prisma.companyInvitation.findUnique({
    where: { token },
    include: {
      company: { select: { name: true, slug: true } },
    },
  });

  if (!invitation) {
    notFound();
  }

  // Lógica de Validación de Estado
  const isPending = invitation.status === "PENDING";
  const isNotExpired = invitation.expiresAt.getTime() > Date.now();

  // Acción automática al cargar la página
  if (isPending && isNotExpired) {
    // Esto se ejecuta en el servidor. Si pasaron +2min, se envía.
    await resendInvitationIfNeeded(invitation.id);
  }

  // Ofuscación Senior del email (ej: ed***@gmail.com)
  const [user, domain] = invitation.email.split("@");
  const maskedEmail = user.length > 2
    ? `${user.substring(0, 2)}***@${domain}`
    : `${user.charAt(0)}***@${domain}`;

  return (
    <CompanyJoinScreen
      token={invitation.token}
      companyName={invitation.company.name}
      inviteEmail={maskedEmail}
      expiresAt={invitation.expiresAt.toISOString()}
      expired={!isPending || !isNotExpired}
    />
  );
}
