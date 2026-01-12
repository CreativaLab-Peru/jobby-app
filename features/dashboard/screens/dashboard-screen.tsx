"use client";

import { Rocket, FileText, TrendingUp, AlertCircle, Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { EmployabilityCard } from "@/features/dashboard/components/employability-card";
import { StatsResourceCard } from "@/features/dashboard/components/stats-resource-card";
import { DashboardStats } from "../actions/get-statistics-for-user";

interface DashboardScreenProps {
  score: number;
  stats: DashboardStats | null;
  recommendations: any[];
  subscription: any;
}

export default function DashboardScreen({
                                          score,
                                          stats,
                                          recommendations,
                                          subscription
                                        }: DashboardScreenProps) {

  return (
    <div className="pb-10 px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Hola, <span className="ai-gradient-text">Explorador</span>
            </h1>
            <p className="text-muted-foreground font-medium">Esto es lo que la IA de Levely tiene para ti.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-bold border-2" asChild>
              <Link href="/cv"><FileText className="w-4 h-4 mr-2" /> Mis CVs</Link>
            </Button>
            <Button className="ai-gradient shadow-glow font-bold border-none text-white">
              <Zap className="w-4 h-4 mr-2 fill-current" /> Nueva Evaluación
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmployabilityCard score={score} sector={stats?.userSector || "General"} />

          <Card className="border-border shadow-card bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary fill-primary" /> Recursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StatsResourceCard
                label="Evaluaciones"
                used={subscription?.manualCvsUsed || 0}
                limit={subscription?.plan?.manualCvLimit || 5}
                colorClass="text-primary"
              />
              <StatsResourceCard
                label="CVs Creados"
                used={stats?.totalCvs || 0}
                limit={subscription?.plan?.uploadCvLimit || 3}
                colorClass="text-secondary"
              />
              <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary hover:no-underline">
                Mejorar Plan <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Recomendaciones */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Áreas de Crecimiento
            </h2>
            <div className="grid gap-3">
              {recommendations.length > 0 ? recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border border-border bg-card flex gap-4 items-start hover:border-primary transition-colors">
                  <div className={`p-2 rounded-lg ${rec.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-[10px] tracking-widest text-muted-foreground">{rec.sectionType}</h4>
                    <p className="text-sm font-medium text-muted-foreground">{rec.text}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-xl">Analiza un CV para recibir recomendaciones.</p>
              )}
            </div>
          </div>

          {/* Top Matches */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Rocket className="w-5 h-5 text-secondary" /> Top Matches
            </h2>
            <div className="space-y-3">
              {stats?.topOpportunities && stats.topOpportunities.length > 0 ? (
                stats.topOpportunities.map((opt) => (
                  <div key={opt.id} className="group p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-black text-primary group-hover:bg-primary/10 transition-colors">
                        {Math.round(Number(opt.match))}%
                      </div>
                      <div>
                        <h4 className="font-bold text-sm ">{opt.title}</h4>
                        <p className="text-[12px] text-muted-foreground uppercase">{opt.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full" asChild>
                      <a href={opt.linkUrl} target="_blank" rel="noopener noreferrer">
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-xl">No hay oportunidades emparejadas aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
