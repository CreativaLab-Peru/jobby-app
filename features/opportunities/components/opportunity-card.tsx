"use client";

import { Calendar, ExternalLink, MapPin, Target, Eye, Building2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SerializableOpportunity } from "@/features/opportunities/get-opportunities";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  opportunity: SerializableOpportunity;
}

export default function OpportunityCard({ opportunity }: Props) {
  const rawMatch = opportunity.match ?? 0;
  const matchValue = Math.round(rawMatch > 1 ? rawMatch : rawMatch * 100);

  const isHighMatch = matchValue >= 80;

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-card rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      {/* Indicador de High Match */}
      {isHighMatch && (
        <div className="absolute top-0 right-0 p-3">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="font-bold rounded-lg text-[10px] uppercase tracking-wider">
            {opportunity.type.replace(/_/g, ' ')}
          </Badge>
          <div className={cn(
            "flex items-center gap-1 font-black text-sm px-2 py-1 rounded-lg",
            isHighMatch ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            <Target className="w-3.5 h-3.5" />
            <span>{matchValue}%</span>
          </div>
        </div>

        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {opportunity.title}
        </h3>

        {opportunity.company && (
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
            <Building2 className="w-4 h-4" />
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
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              <span>{opportunity.location}</span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cierra: {new Date(opportunity.deadline).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
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
          <Link href={`/opportunities/${opportunity.id}/details`}>
            Detalles
            <Eye className="w-3.5 h-3.5 ml-2" />
          </Link>
        </Button>

        <Button
          variant="accent"
          className="rounded-xl font-bold text-xs h-10 shadow-lg shadow-accent/10"
          asChild
        >
          <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
            Postular
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
