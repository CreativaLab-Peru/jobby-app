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
    }
  };
  blurred?: boolean;
}

export default function OpportunityCard({
                                          opportunity
                                          , blurred
                                        }: Props) {
  const rawMatch = opportunity.match ?? 0;
  const matchValue = Math.round(rawMatch > 1 ? rawMatch : rawMatch * 100);

  const isHighMatch = matchValue >= 80;

  const router = useRouter();
  const blurClass = blurred ? "filter blur-sm grayscale-[40%]" : "";

  const requirements = [
    ...(opportunity.requiredRequirements ?? []),
    ...(opportunity.optionalRequirements ?? []),
  ];

  return (
    <Card
      className={`group relative overflow-hidden border-border/40 bg-card rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col ${blurClass}`}>

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
              {OPPORTUNITY_MAP[opportunity.type] || "Oportunidad"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium">
            <span
              className="line-clamp-1 max-w-[120px] italic text-primary transition-colors cursor-default hover:text-primary/80 cursor-pointer"
              title={opportunity?.cv?.title} // Tooltip nativo para ver el nombre completo al pasar el mouse
              onClick={()=>router.push('/cv?id=' + opportunity.cvId)}
            >
                  {opportunity?.cv?.title || "Sin título"}
                </span>
          </div>

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

      <CardFooter className="grid grid-cols-2 gap-3 pt-4">
        <Button
          variant="secondary"
          className="rounded-xl font-bold text-xs h-10 border border-border/40"
          asChild
        >
          <Link href={`/opportunities/${opportunity.id}/cv/${opportunity.cvId}/details`}>
            Detalles
            <Eye className="w-3.5 h-3.5 ml-2"/>
          </Link>
        </Button>

        <Button
          variant="accent"
          className="rounded-xl font-bold text-xs h-10 shadow-lg shadow-accent/10"
          asChild
        >
          <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
            Postular
            <ExternalLink className="w-3.5 h-3.5 ml-2"/>
          </a>
        </Button>
      </CardFooter>
      {blurred && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70">
          <div className="text-center p-6 rounded-2xl">
            <p className="font-bold text-foreground mb-2">Contenido bloqueado</p>
            <p className="text-sm text-muted-foreground mb-4">Actualiza a Starter o Pro para ver todas las oportunidades.</p>
            <div className="flex justify-center">
              <Button size="sm" onClick={() => router.push('/billing')}>
                Ver planes
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
