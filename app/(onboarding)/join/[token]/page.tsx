import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyJoinScreen } from "@/features/company/screens/company-join-screen";
import { prisma } from "@/lib/prisma";

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
      company: {
        select: { name: true, slug: true },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  const firstsLetterOfEmail = invitation.email.charAt(0).toLowerCase();
  const secondLetterOfEmail = invitation.email.charAt(1).toLowerCase();
  const finalEmail = firstsLetterOfEmail + secondLetterOfEmail + "*****@****"

  return (
    <CompanyJoinScreen
      token={invitation.token}
      companyName={invitation.company.name}
      inviteEmail={finalEmail}
      expiresAt={invitation.expiresAt.toISOString()}
      expired={invitation.status !== "PENDING" || invitation.expiresAt.getTime() < Date.now()}
    />
  );
}

