import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

interface CompanyPublicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CompanyPublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true, website: true },
  });

  if (!company) {
    return {
      title: "Empresa no encontrada | Levely",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${company.name} | Levely Business`,
    description: `Perfil público de ${company.name} en Levely Business.`,
    alternates: {
      canonical: `${routes.website.companies}/${slug}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CompanyPublicPage({ params }: CompanyPublicPageProps) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      logoUrl: true,
      website: true,
      primaryColor: true,
      isActive: true,
      onboardingStep: true,
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Building2 data-icon="inline-start" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                Levely Business
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-balance">{company.name}</h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-6">
            Perfil público de la empresa dentro de Levely. Los accesos y membresías se gestionan
            con invitaciones individuales para mantener el flujo simple y seguro.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck data-icon="inline-start" /> Estado
              </CardTitle>
              <CardDescription>Disponibilidad de la empresa.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              {company.isActive ? "Activa" : "Inactiva"}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users data-icon="inline-start" /> Onboarding
              </CardTitle>
              <CardDescription>Etapa actual de configuración.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">{company.onboardingStep}</CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 data-icon="inline-start" /> Web
              </CardTitle>
              <CardDescription>Más información de la empresa.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              {company.website ? (
                <a className="text-primary underline underline-offset-4" href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              ) : (
                "No hay sitio web registrado"
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Acceso al equipo</CardTitle>
            <CardDescription>
              Si recibiste una invitación por correo, usa el enlace con token para validar tu código.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              El enlace público sirve como referencia de la empresa y punto de partida para el
              onboarding B2B.
            </p>
            <Button asChild>
              <a href={routes.website.companies}>Volver a empresas</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

