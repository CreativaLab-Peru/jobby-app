"use client";

import { motion } from "framer-motion";
import {
  Calendar, ExternalLink, MapPin, Target,
  DollarSign, Briefcase, ArrowLeft, Building2, Sparkles,
  CheckCircle2, PlusCircle
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RoadmapSection } from "@/features/roadmap/components/roadmap-section";
import type { RoadmapData } from "@/features/roadmap/actions/get-roadmap-for-opportunity";
import { RichTextViewer } from "@/components/rich-text/rich-text-viewer";
import { MODALITIES_MAP } from "@/const";

interface Props {
  opportunity: any;
  matchValue: number;
  isHighMatch: boolean;
  requirements: {
    required: string[] | string | null;
    optional: string[] | string | null;
  };
  formattedDeadline: string | null;
  roadmap?: RoadmapData;
  canViewFullRoadmap?: boolean;
  canGenerateRoadmap?: boolean;
  roadmapBlockedMessage?: string | null;
}

const StatCard = ({ icon: Icon, label, value, colorClass = "text-primary/60" }: any) => (
  <div className="bg-card/30 border border-border/40 p-5 rounded-[2rem] flex flex-col gap-1.5 transition-all hover:border-primary/20">
    <div className={cn("p-2 rounded-xl bg-background w-fit", colorClass)}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">{label}</span>
    <span className="text-sm font-bold text-foreground truncate">{value}</span>
  </div>
);

export function OpportunityDetailsScreen({
                                           opportunity,
                                           matchValue,
                                           isHighMatch,
                                           requirements,
                                           formattedDeadline,
                                           roadmap = null,
                                           canViewFullRoadmap = false,
                                           canGenerateRoadmap = true,
                                           roadmapBlockedMessage = null,
                                         }: Props) {

  // Normalización de requisitos (Array para badges)
  const renderRequirements = (data: any, type: 'required' | 'optional') => {
    if (!data) return null;
    const items = Array.isArray(data) ? data : data.split(',').map((s: string) => s.trim());
    const isReq = type === 'required';

    return (
      <div className={cn(
        "p-8 rounded-[2.5rem] space-y-4 h-full",
        isReq ? "bg-primary/[0.02] border border-primary/10" : "bg-secondary/5 border border-dashed border-border"
      )}>
        <div className="flex items-center gap-2 mb-4">
          {isReq ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <PlusCircle className="w-4 h-4 text-muted-foreground" />}
          <span className="text-md font-bold text-primary">
            {isReq ? "Requisitos Clave" : "Extras Deseables"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item: string, i: number) => (
            <Badge key={i} variant={isReq ? "default" : "secondary"} className={cn(
              "rounded-full px-4 py-1 font-bold text-[11px]",
              isReq ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border-border"
            )}>
              {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const salaryLabel = opportunity.minSalary && opportunity.maxSalary
    ? `${opportunity.minSalary} - ${opportunity.maxSalary}`
    : opportunity.minSalary ? `${opportunity.minSalary}+` : (opportunity.salary || "A convenir");

  return (
    <main className="min-h-screen p-4 md:p-12 bg-background/50">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* Top Nav */}
        <div className="flex justify-between items-center px-2">
          <Button variant="ghost" asChild className="rounded-2xl font-bold text-muted-foreground hover:bg-card">
            <Link href="/opportunities">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista
            </Link>
          </Button>
        </div>

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[3rem] border-none bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Left side: Info */}
                <div className="p-8 md:p-14 flex-1 space-y-8">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1 rounded-full text-[10px] uppercase">
                      {opportunity.type}
                    </Badge>
                    {isHighMatch && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-1 rounded-full text-[10px] uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 fill-current" /> Match Perfecto
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] text-foreground">
                      {opportunity.title}
                    </h1>
                    <div className="flex items-center gap-3 text-2xl font-bold text-muted-foreground/70">
                      <Building2 className="w-6 h-6" />
                      <span>{opportunity.company}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <StatCard icon={MapPin} label="Ubicación" value={opportunity.location || "Remoto"} />
                    <StatCard icon={Briefcase} label="Modalidad" value={MODALITIES_MAP[opportunity.modality] || "Full-time"} colorClass="text-blue-500/60" />
                    { salaryLabel && salaryLabel.trim() !== "" && (
                      <StatCard icon={DollarSign} label="Salario" value={salaryLabel} colorClass="text-emerald-500/60" />
                    )}
                    <StatCard icon={Calendar} label="Deadline" value={formattedDeadline || "Abierta"} colorClass="text-orange-500/60" />
                  </div>
                </div>

                {/* Right side: Match Circle */}
                <div className={cn(
                  "lg:w-72 p-8 flex flex-col items-center justify-center text-center gap-2",
                  isHighMatch ? "bg-primary/5" : "bg-secondary/20"
                )}>
                  <div className="relative">
                    <Target className={cn("w-20 h-20", isHighMatch ? "text-primary" : "text-muted-foreground/40")} />
                    <div className="absolute inset-0 flex items-center justify-center pt-1">
                      <span className="text-xl font-black">{matchValue}%</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Score de afinidad</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-border/40 bg-card p-8 md:p-12">
              <h2 className="text-md text-primary mb-8">Descripción del Puesto</h2>
              <RichTextViewer
                value={opportunity.description || "No hay descripción disponible."}
                className="text-lg leading-relaxed text-foreground/80"
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.required.length > 0 && renderRequirements(requirements.required, 'required')}
              {requirements.optional.length > 0 && renderRequirements(requirements.optional, 'optional')}
            </div>
          </div>

          {/* Sticky Actions (Right) */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none bg-primary p-8 text-primary-foreground sticky top-8">
              <h3 className="text-xl font-black mb-2 italic">¿Listo para el siguiente nivel?</h3>
              <p className="text-sm text-primary-foreground/80 mb-8 leading-snug">
                Hemos analizado tu perfil contra esta oportunidad. Tu CV {opportunity.cv?.title} es una excelente base.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-2xl h-16 font-black text-lg shadow-2xl shadow-black/20"
                asChild
              >
                <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
                  Postular Ahora
                  <ExternalLink className="w-5 h-5 ml-3" />
                </a>
              </Button>
              <p className="text-[10px] text-center mt-4 font-bold opacity-60 uppercase tracking-widest">
                Serás redirigido al sitio oficial
              </p>
            </Card>
          </div>
        </div>

        {/* Hidden roadmap into details of opportunities */}        
        {/* Roadmap (Full Width) */}
        {/* {opportunity.cv?.id && (
          <div className="pt-10">
            <h2 className="text-2xl font-black tracking-tight mb-6 px-4">Tu Roadmap de Preparación</h2>
            <Card className="rounded-[3rem] border-border/40 bg-card/50 backdrop-blur-sm p-2">
              <RoadmapSection
                opportunityId={opportunity.id}
                cvId={opportunity.cv.id}
                routeId={opportunity.routeId}
                initialRoadmap={roadmap}
                canViewFull={canViewFullRoadmap}
                canGenerate={canGenerateRoadmap}
                blockedMessage={roadmapBlockedMessage}
              />
            </Card>
          </div>
        )} */}
      </div>
    </main>
  );
}
