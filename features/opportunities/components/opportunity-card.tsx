"use client";

import {Calendar, ExternalLink, MapPin, Target, Eye, Building2, Sparkles} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Opportunity} from "@prisma/client";
import {useRouter} from "next/navigation";
import {RichTextViewer} from "@/components/rich-text/rich-text-viewer";
import {OPPORTUNITY_MAP} from "@/const";

interface Props {
  opportunity: Opportunity & {
    match: number;
    cv: {
      id: string;
      title: string;
    };
    isLocked?: boolean;
  };
}

export default function OpportunityCard({
                                          opportunity
                                        }: Props) {
  const rawMatch = opportunity.match ?? 0;
  const matchValue = Math.round(rawMatch > 1 ? rawMatch : rawMatch * 100);

  const isHighMatch = matchValue >= 80;

  const router = useRouter();

  const requirements = [
    ...(opportunity.requiredRequirements ?? []),
    ...(opportunity.optionalRequirements ?? []),
  ];

  return (
    <Card
      className="group relative overflow-hidden border-border/40 bg-card rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">

      {isHighMatch && (
        <div className="absolute top-0 right-0 p-3">
          <Sparkles className="h-5 w-5 text-primary animate-pulse"/>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2"> {/* Contenedor para los Badges */}
            <Badge variant="secondary"
                   className="w-fit font-bold rounded-lg text-[10px] uppercase tracking-wider">
              {OPPORTUNITY_MAP[opportunity.type]?.label || "Oportunidad"}
            </Badge>
          </div>
          {/*<div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium">*/}
          {/*  <span*/}
          {/*    className="line-clamp-1 max-w-[120px] italic text-primary transition-colors cursor-default hover:text-primary/80 cursor-pointer"*/}
          {/*    title={opportunity?.cv?.title} // Tooltip nativo para ver el nombre completo al pasar el mouse*/}
          {/*    onClick={()=>router.push('/cv?id=' + opportunity.cvId)}*/}
          {/*  >*/}
          {/*        {opportunity?.cv?.title || "Sin título"}*/}
          {/*      </span>*/}
          {/*</div>*/}

          <div className={cn(
            "flex items-center gap-1 font-black text-sm px-2 py-1 rounded-lg",
            isHighMatch ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            <Target className="w-3.5 h-3.5"/>
            <span>{matchValue}%</span>
          </div>
        </div>

        <h3
          className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {opportunity.title}
        </h3>

        {opportunity.company && (
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
            <Building2 className="w-4 h-4"/>
            <span className="text-sm font-medium">{opportunity.company}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Descripción con Rich Text (limitada a 3 líneas) */}
        <RichTextViewer
          lineClamp={3}
          value={opportunity.description || "No hay descripción disponible."}
          className="mb-2"
        />

        {/* Requerimientos como etiquetas limpias */}
        {requirements.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {requirements.slice(0, 4).map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="bg-primary/5 text-primary border-none text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
              </Badge>
            ))}
            {requirements.length > 4 && (
              <span className="text-[10px] text-muted-foreground/60 font-bold self-center">
          +{requirements.length - 4}
        </span>
            )}
          </div>
        )}

        {/* Metadatos (Ubicación y Fecha) empujados al final */}
        <div className="flex flex-wrap gap-4 mt-auto">
          {opportunity.location && (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase">
              <MapPin className="w-3.5 h-3.5 text-primary/60"/>
              <span>{opportunity.location}</span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase">
              <Calendar className="w-3.5 h-3.5"/>
              <span>Cierra: {new Date(opportunity.deadline).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short'
              })}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        {/* Botón de Detalles - Ahora pequeño (Icon-only) */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-xl border border-border/40 shrink-0 h-10 w-10"
          asChild={!opportunity.isLocked}
          disabled={opportunity.isLocked}
          onClick={() => {
            if (opportunity.isLocked) return;
          }}
        >
          {!opportunity.isLocked ? (
            <Link href={`/opportunities/${opportunity.id}/cv/${opportunity.cvId}/details`}>
              <Eye className="w-4 h-4" />
            </Link>
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>

        {/* Botón Principal: GENERAR ROADMAP */}
        <Button
          variant="default" // O el variant que uses para acciones principales
          className="flex-1 rounded-xl font-bold text-xs h-10 shadow-lg shadow-primary/10 gap-2"
          disabled={opportunity.isLocked}
          onClick={() => {
            if (opportunity.isLocked) return;
            // Tu lógica para generar el roadmap aquí
            router.push(`/my-roadmaps?openedModal=true&oppId=${opportunity.id}`);
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generar Roadmap</span>
        </Button>

        {/* Botón de Enlace Externo - Ahora pequeño (Icon-only) */}
        <Button
          variant="accent"
          size="icon"
          className="rounded-xl shrink-0 h-10 w-10 shadow-lg shadow-accent/10"
          asChild={!opportunity.isLocked}
          disabled={opportunity.isLocked}
        >
          {!opportunity.isLocked ? (
            <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
