"use client";

import {Calendar, ExternalLink, MapPin, Target, Eye, Building2, Sparkles} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Opportunity} from ".prisma/client";
import {useRouter} from "next/navigation";

const opportunityMapped = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
} as const;

interface Props {
  opportunity: Opportunity & {
    match: number;
    cv: {
      id: string;
      title: string;
    }
  };
}

export default function OpportunityCard({
                                          opportunity
                                        }: Props) {
  const rawMatch = opportunity.match ?? 0;
  const matchValue = Math.round(rawMatch > 1 ? rawMatch : rawMatch * 100);

  const isHighMatch = matchValue >= 80;

  const router = useRouter();

  return (
    <Card
      className="group relative overflow-hidden border-border/40 bg-card rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      {/* Indicador de High Match */}
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
              {opportunityMapped[opportunity.type] || "Oportunidad"}
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

      <CardContent className="flex-1">
        {opportunity.requirements && (
          <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed mb-6">
            {opportunity.requirements}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-auto">
          {opportunity.location && (
            <div
              className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-primary/60"/>
              <span>{opportunity.location}</span>
            </div>
          )}
          {opportunity.deadline && (
            <div
              className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
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
    </Card>
  );
}
