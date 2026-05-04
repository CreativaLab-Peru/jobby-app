import { notFound, redirect } from "next/navigation";

import { CompanyInvitationScreen } from "@/features/company/screens/company-invitation-screen";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

interface AdminCompanyInvitationsPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function AdminCompanyInvitationsPage({ params }: AdminCompanyInvitationsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { companyId } = await params;
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      slug: true,
      invitations: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          expiresAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <CompanyInvitationScreen
      companyId={company.id}
      companyName={company.name}
      companySlug={company.slug}
      invitations={company.invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt.toISOString(),
        createdAt: invitation.createdAt.toISOString(),
      }))}
    />
  );
}

