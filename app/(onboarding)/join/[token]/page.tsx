import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyJoinScreen } from "@/features/company/screens/company-join-screen";
import { prisma } from "@/lib/prisma";
import {hexToHslComponents} from "@/lib/utils/colors";
import {
  InviteCandidate,
  sendCompanyInvitationEmail
} from "@/features/company/services/company-invitation.service";

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
      company: { select: { name: true, slug: true, primaryColor: true, secondaryColor: true, } },
    },
  });

  if (!invitation) {
    notFound();
  }

  const primaryHsl = hexToHslComponents(invitation.company.primaryColor);
  const secondaryHsl = hexToHslComponents(invitation.company.secondaryColor);

  // Lógica de Validación de Estado
  const isPending = invitation.status === "PENDING";
  const isNotExpired = invitation.expiresAt.getTime() > Date.now();

  // Acción automática al cargar la página
  if (isPending && isNotExpired) {
    const candidate: InviteCandidate = {
      id: invitation.id,
      companyId: invitation.companyId,
      companyName: invitation.company.name,
      companySlug: invitation.company.slug,
      email: invitation.email,
      token: invitation.token,
      code: invitation.code,
      codeHash: invitation.codeHash,
      expiresAt: invitation.expiresAt,
      role: invitation.role,
    };
    // Esto se ejecuta en el servidor. Si pasaron +2min, se envía.
    await sendCompanyInvitationEmail(candidate);
  }

  // Ofuscación Senior del email (ej: ed***@gmail.com)
  const [user, domain] = invitation.email.split("@");
  const maskedEmail = user.length > 2
    ? `${user.substring(0, 2)}***@${domain}`
    : `${user.charAt(0)}***@${domain}`;
  const inviteEmail = invitation.email;

  return (
    <div
      style={{
        // Sobreescribimos las variables base de tu globals.css
        "--primary": primaryHsl,
        "--accent": primaryHsl,
        "--sidebar-primary": primaryHsl,

        "--secondary": secondaryHsl,
        "--sidebar-accent": secondaryHsl,

        // Opcional: Si quieres que el ring también cambie
        "--ring": primaryHsl,
      } as React.CSSProperties}
    >
      <CompanyJoinScreen
        token={invitation.token}
        slug={invitation.company.slug}
        companyName={invitation.company.name}
        inviteEmail={inviteEmail}
        maskedEmail={maskedEmail}
        expiresAt={invitation.expiresAt.toISOString()}
        expired={!isPending || !isNotExpired}
      />
    </div>
  );
}
