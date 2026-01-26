"use client";

import { Rocket, FileText, TrendingUp, AlertCircle, Zap, ArrowUpRight, Search } from "lucide-react";
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
    <div className="pb-10 px-4 py-8 bg-[#fafbfa] dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 min-h-screen">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-800 dark:text-white uppercase">
              HOLA, <span className="text-blue-500 dark:text-blue-400">EXPLORADOR</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Esto es lo que la IA de Levely tiene para ti.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline" className="font-bold border-2 border-blue-400 text-blue-700 dark:text-blue-200 dark:border-blue-500 bg-white dark:bg-[#23272f] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <Link href="/cv"><FileText className="w-4 h-4 mr-2" /> Crear CV</Link>
            </Button>
            <Button asChild variant="outline" className="font-bold border-2 border-green-400 text-green-700 dark:text-green-200 dark:border-green-500 bg-white dark:bg-[#23272f] hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
              <Link href="/evaluations"><Zap className="w-4 h-4 mr-2" /> Evaluar Perfil</Link>
            </Button>
            <Button asChild variant="outline" className="font-bold border-2 border-gray-400 text-gray-700 dark:text-gray-200 dark:border-gray-500 bg-white dark:bg-[#23272f] hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors">
              <Link href="/opportunities"><Rocket className="w-4 h-4 mr-2" /> Ver Oportunidades</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmployabilityCard score={score} sector={stats?.userSector || "General"} />

          <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white/90 dark:bg-[#23272f]">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 dark:text-blue-300" /> RECURSOS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StatsResourceCard
                label="Evaluaciones"
                used={subscription?.manualCvsUsed || 0}
                limit={subscription?.plan?.manualCvLimit || 5}
                colorClass="text-blue-500"
              />
              <StatsResourceCard
                label="CVs Creados"
                used={stats?.totalCvs || 0}
                limit={subscription?.plan?.uploadCvLimit || 3}
                colorClass="text-green-500"
              />
              <Button variant="link" className="p-0 h-auto text-xs font-bold text-blue-500 dark:text-blue-300 hover:underline">
                Mejorar Plan <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Áreas de Crecimiento */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#23272f] relative overflow-hidden">
            {/* Fondo decorativo sutil */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-coral-100 to-transparent opacity-20 dark:from-blue-900 dark:via-coral-950 dark:to-transparent dark:opacity-20 z-0 blur-sm" />
            <CardHeader>
              <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2 text-gray-700 dark:text-gray-100">
                <Search className="w-5 h-5 text-blue-400 dark:text-blue-300" /> ÁREAS DE CRECIMIENTO
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? recommendations.map((rec) => (
                <div key={rec.id} className="flex gap-4 items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm border ${rec.severity === 'high' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'}`}>{rec.severity === 'high' ? 'ALTA' : 'MEDIA'}</span>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">{rec.sectionType}</h4>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-100">{rec.text}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic">
                  Analiza tu CV para recibir recomendaciones.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Matches */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#23272f] relative overflow-hidden">
            {/* Fondo decorativo sutil */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-coral-100 to-transparent opacity-20 dark:from-blue-900 dark:via-coral-950 dark:to-transparent dark:opacity-20 z-0 blur-sm" />
            <CardHeader>
              <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2 text-gray-700 dark:text-gray-100">
                <Rocket className="w-5 h-5 text-blue-400 dark:text-blue-300" /> TOP MATCHES
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topOpportunities && stats.topOpportunities.length > 0 ? (
                stats.topOpportunities.map((opt) => (
                  <div key={opt.id} className="group flex items-center justify-between mb-3">
                    <div className="flex gap-4 items-center">
                      <span className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-blue-500 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700 bg-blue-100 dark:bg-blue-900 text-lg shadow-sm">{Math.round(Number(opt.match))}%</span>
                      <div>
                        <h4 className="font-bold text-base text-gray-700 dark:text-gray-100">{opt.title}</h4>
                        <p className="text-xs text-gray-400 dark:text-gray-400 uppercase">{opt.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full border-blue-400 text-blue-500 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-200 dark:hover:bg-blue-900/60 transition-colors font-bold" asChild>
                      <a href={opt.linkUrl} target="_blank" rel="noopener noreferrer">
                        Buscar Empleo <ArrowUpRight className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic">
                  No hay oportunidades emparejadas aún.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
