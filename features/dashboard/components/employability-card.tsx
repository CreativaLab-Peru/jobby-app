"use client";

import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  score: number;
  sector: string | null;
}

export function EmployabilityCard({ score, sector }: Props) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);
    const getStatus = (score: number) => {
    if (score >= 85) return "Altamente Competitivo";
    if (score >= 70) return "Competitivo";
    if (score >= 50) return "esta en Desarrollo";
    return "Iniciando";
    };
    const getSectorType = (sector: string) => {
      if (sector === "TECHNOLOGY_ENGINEERING") return "Tecnología e Ingeniería";
      if (sector === "DESIGN_CREATIVITY") return "Diseño y Creatividad";
      if (sector === "MARKETING_STRATEGY") return "Marketing y Estrategia";
      if (sector === "MANAGEMENT_BUSINESS") return "Gestión y Negocios";
      if (sector === "FINANCE_PROJECTS") return "Finanzas y Proyectos";
      if (sector === "SOCIAL_MEDIA") return "Redes Sociales";
      if (sector === "EDUCATION") return "Educación";
      if (sector === "SCIENCE") return "Ciencia";
      return sector || "General";
    };


  return (
    <Card className="bg-card border border-border rounded-2xl p-6 hover:border-levely-blue/30 dark:hover:border-levely-green/30 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-levely-blue dark:text-levely-green" />
        <h3 className="font-semibold uppercase tracking-wide text-sm">Índice de Empleabilidad</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full transform -rotate-90" role="img" aria-label={`${score}% de empleabilidad`}>
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D2FF7D" />
                <stop offset="100%" stopColor="#3EC6FF" />
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r="58" stroke="hsl(var(--secondary))" strokeWidth="10" fill="none" />
            <circle
              cx="64" cy="64" r="58"
              stroke="url(#progress-gradient)"
              strokeWidth="10" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-levely-blue dark:text-levely-green">{score}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="text-xl font-bold text-levely-blue dark:text-levely-green uppercase tracking-wide mb-1">
            {getStatus(score)}
          </h4>
          <Badge variant="secondary" className="mb-3">{getSectorType(sector || "")}</Badge>
          <p className="text-sm text-muted-foreground mb-3">
            Tu perfil es <span className="font-medium text-foreground">{getStatus(score)}</span> en el sector de{" "}
            <span className="font-medium text-foreground">{getSectorType(sector || "")}</span>
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">Actualizado</Badge>
            <Badge variant="outline" className="text-xs border-levely-blue/50 text-levely-blue dark:border-levely-green/50 dark:text-levely-green">
              Levely AI Verified
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
