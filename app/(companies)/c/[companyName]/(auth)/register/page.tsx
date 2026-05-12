import * as React from "react";
import {Card} from "@/components/ui/card";
import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {InvitationStatus} from "@prisma/client";
import {
  RegisterForCompaniesForm
} from "@/features/authentication/components/register-for-companies-form";

interface RegisterPageProps {
  searchParams: Promise<{
    token?: string;
    code?: string;
  }>
}

export default async function RegisterPage({searchParams}: RegisterPageProps) {
  const {token, code} = await searchParams;
  if (!token || !code) {
    return notFound();
  }

  const invitation = await prisma.companyInvitation.findFirst({
    where: {token, code},
    include: {company: {select: {slug: true}}}
  })
  if (!invitation) {
    return notFound();
  }

  const status: InvitationStatus[] = [InvitationStatus.EXPIRED, InvitationStatus.ACCEPTED, InvitationStatus.CANCELLED]
  if (status.includes(invitation.status)) {
    return notFound();
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative z-10">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Crea tu <span className="text-gradient">nueva cuenta</span>
              </h1>
              <p className="text-muted-foreground">
                Empieza a construir tu CV profesional en minutos
              </p>
            </div>
            <Card className="p-8 bg-card shadow-glow">
              <RegisterForCompaniesForm
                token={token}
                code={code}
                slug={invitation.company.slug}
              />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
