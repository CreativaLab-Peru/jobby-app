import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Calendar, 
  ExternalLink, 
  MapPin, 
  Target, 
  DollarSign,
  Briefcase,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
  });

  if (!opportunity) {
    notFound();
  }

  const matchValue = Math.round(Number(opportunity.match) * 100);

  const parseRequirements = (text: string) => {
    const lines = text.split('\n');
    let required: string | null = null;
    let optional: string | null = null;

    lines.forEach(line => {
      if (line.startsWith('Habilidades requeridas:')) {
        required = line.replace('Habilidades requeridas:', '').trim();
      } else if (line.startsWith('Habilidades opcionales:')) {
        optional = line.replace('Habilidades opcionales:', '').trim();
      }
    });

    return { required, optional };
  };

  const { required, optional } = opportunity.requirements 
    ? parseRequirements(opportunity.requirements) 
    : { required: null, optional: null };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/opportunities">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a oportunidades
        </Button>
      </Link>

      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="space-y-2 flex-1">
              <Badge variant="outline" className="font-bold border-2 text-sm">
                {opportunity.type.replace(/_/g, ' ')}
              </Badge>
              <h1 className="font-black text-3xl leading-tight">
                {opportunity.title}
              </h1>
              {opportunity.company && (
                <p className="text-lg text-muted-foreground font-semibold">
                  {opportunity.company}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-primary font-black text-2xl">
              <Target className="w-6 h-6 dark:text-levely-green text-levely-blue" />
              <span>{matchValue}% Match</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunity.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Ubicación</p>
                  <p className="text-muted-foreground">{opportunity.location}</p>
                </div>
              </div>
            )}

            {opportunity.deadline && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Fecha límite</p>
                  <p className="text-muted-foreground">
                    {new Date(opportunity.deadline).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {opportunity.modality && (
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Modalidad</p>
                  <p className="text-muted-foreground">{opportunity.modality}</p>
                </div>
              </div>
            )}

            {opportunity.salary && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Compensación</p>
                  <p className="text-muted-foreground">{opportunity.salary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          {opportunity.description && (
            <div className="space-y-2">
              <h2 className="font-bold text-xl">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>
          )}

          {/* Requerimientos */}
          {opportunity.requirements && (
            <div className="space-y-2">
              <h2 className="font-bold text-xl">Requisitos</h2>
              {required || optional ? (
                <div className="space-y-4">
                  {required && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Habilidades requeridas</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{required}</p>
                    </div>
                  )}
                  {optional && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Habilidades opcionales</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{optional}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {opportunity.requirements}
                </p>
              )}
            </div>
          )}

          {/* Beneficios */}
          {opportunity.benefits && (
            <div className="space-y-2">
              <h2 className="font-bold text-xl">Beneficios</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {opportunity.benefits}
              </p>
            </div>
          )}

          {/* Botón de postulación */}
          <div className="pt-4">
            <Button
              className="w-full ai-gradient text-white dark:text-levely-dark bg-levely-blue dark:bg-levely-green font-bold border-none shadow-glow hover:opacity-90"
              size="lg"
              asChild
            >
              <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
                Postular a esta oportunidad
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
