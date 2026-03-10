"use client";

import { motion } from "framer-motion";
import {
  Calendar, ExternalLink, MapPin, Target,
  DollarSign, Briefcase, ArrowLeft, Building2, Sparkles,
  Share2
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  opportunity: any;
  matchValue: number;
  isHighMatch: boolean;
  requirements: {
    required: string | null;
    optional: string | null;
  };
  formattedDeadline: string | null;
}

// Sub-componente interno para limpieza visual
const StatCard = ({ icon: Icon, label, value }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-card/50 border border-border p-4 rounded-2xl flex flex-col items-center text-center gap-1"
  >
    <Icon className="w-4 h-4 text-primary/60" />
    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
    <span className="text-xs font-bold truncate w-full">{value}</span>
  </motion.div>
);

export function OpportunityDetailsScreen({
                                           opportunity,
                                           matchValue,
                                           isHighMatch,
                                           requirements,
                                           formattedDeadline
                                         }: Props) {

  const { required, optional } = requirements;

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header de navegación */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild className="rounded-xl font-bold text-muted-foreground group">
            <Link href="/opportunities">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl border-border/40">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border/40 relative overflow-hidden shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-black px-3 py-1 rounded-lg uppercase tracking-tighter text-[10px]">
                  {opportunity.type.replace(/_/g, ' ')}
                </Badge>
                {isHighMatch && (
                  <Badge variant="outline" className="font-black px-3 py-1 rounded-lg uppercase tracking-tighter text-[10px]">
                    <Sparkles className="w-3 h-3 mr-1.5 fill-current" /> High Match
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                  {opportunity.title}
                </h1>
                <div className="flex items-center gap-2 text-xl text-muted-foreground font-bold">
                  <Building2 className="w-5 h-5 text-primary/50" />
                  <span>{opportunity.company}</span>
                </div>
              </div>
            </div>

            {/* Match Indicator */}
            <div className={cn(
              "flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 min-w-[160px]",
              isHighMatch ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-secondary/30 border-border"
            )}>
              <Target className={cn("w-10 h-10 mb-2", isHighMatch ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-4xl font-black tracking-tighter", isHighMatch ? "text-primary" : "text-foreground")}>
                {matchValue}%
              </span>
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">Score de afinidad</span>
            </div>
          </div>
        </motion.header>

        {/* Quick Data Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard icon={MapPin} label="Ubicación" value={opportunity.location || "Remoto"} />
          <StatCard icon={Briefcase} label="Jornada" value={opportunity.modality || "Full-time"} />
          <StatCard icon={DollarSign} label="Salario" value={opportunity.salary || "A convenir"} />
          <StatCard icon={Calendar} label="Deadline" value={formattedDeadline} />
        </motion.div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[2.5rem] border-border/40 overflow-hidden bg-card">
            <CardContent className="p-8 md:p-14 space-y-12">

              {/* Descripción */}
              <section className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary/80">Descripción</h2>
                <p className="text-sm md:text-md text-foreground/90 font-medium leading-relaxed italic">
                  "{opportunity.description}"
                </p>
              </section>

              {/* Requisitos split */}
              <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary/80">Análisis de perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {required && (
                    <div className="p-6 rounded-3xl bg-primary/[0.03] border border-primary/10 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Requerido</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{required}</p>
                    </div>
                  )}
                  {optional && (
                    <div className="p-6 rounded-3xl bg-secondary/10 border border-dashed border-border/60 space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Deseable</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{optional}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Action Zone */}
              <div className="pt-8 flex flex-col items-center gap-6 border-t border-border/40">
                <div className="text-center space-y-1">
                  <p className="font-bold">¿Quieres postularte?</p>
                  <p className="text-xs text-muted-foreground">Haz clic abajo para ir al sitio oficial.</p>
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full md:w-auto px-16 py-8 rounded-2xl font-black text-xl shadow-xl shadow-accent/20 hover:scale-[1.02] transition-transform"
                  asChild
                >
                  <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
                    Postular ahora
                    <ExternalLink className="w-5 h-5 ml-4" />
                  </a>
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
