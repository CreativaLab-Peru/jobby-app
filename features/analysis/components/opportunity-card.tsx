"use client"

import { Opportunity } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, CalendarDays, Building2, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import { parseRequirements } from "@/utils/parse-requirements";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const matchPercentage = Number(opportunity.match) * 100 || 0;
  const deadlineFormatted = opportunity.deadline ? formatDate(opportunity.deadline) : null;

  const { required, optional } = opportunity.requirements
    ? parseRequirements(opportunity.requirements)
    : { required: null, optional: null };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group p-6 border border-border/50 rounded-[2rem] bg-card/40 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        {/* Lado Izquierdo: Info de la Vacante */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black tracking-tight text-foreground leading-none">
              {opportunity.title}
            </h3>
            {matchPercentage >= 85 && (
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            {opportunity.company && (
              <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-primary/60" />
                {opportunity.company}
              </p>
            )}
            {opportunity.location && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" />
                <span>{opportunity.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-none">
              {opportunity.type.replace(/_/g, ' ')}
            </Badge>
            {deadlineFormatted && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-destructive/80 uppercase tracking-widest bg-destructive/5 px-2 py-0.5 rounded-lg">
                <CalendarDays className="w-3 h-3" />
                <span>Cierra: {deadlineFormatted}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Badge de Match Circular (Desktop) / Linear (Mobile) */}
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-4 rounded-2xl bg-secondary/30 border border-border/40 min-w-[100px]">
          <div className="text-3xl font-black text-primary tracking-tighter">
            {Math.round(matchPercentage)}%
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Match Rate</p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-6 space-y-3 p-4 rounded-2xl bg-background/50 border border-border/30">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Stack Requerido</h4>
        <div className="space-y-2">
          {required ? (
            <p className="text-xs leading-relaxed text-foreground/80 font-medium">
              <span className="text-primary mr-1 opacity-70">●</span> {required}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground italic">Analizando habilidades técnicas...</p>
          )}
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Progress
            value={matchPercentage}
            className="h-1.5 bg-secondary"
          />
        </div>

        <div className="flex gap-3">
          <Link href={`/opportunities/${opportunity.id}/details`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest h-11 border-border/60 hover:bg-secondary transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver detalles
            </Button>
          </Link>

          <Button
            className={cn(
              "flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest h-11 shadow-lg transition-all",
              matchPercentage >= 70 ? "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20" : "bg-secondary text-secondary-foreground"
            )}
            asChild={!!opportunity.linkUrl}
            disabled={!opportunity.linkUrl}
          >
            {opportunity.linkUrl ? (
              <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
                Postular ahora
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            ) : (
              <span>Link no disponible</span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
