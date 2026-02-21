"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  score: number;
  sector: string | null;
}

// Helper de Ingeniería: Mover fuera del componente para evitar re-cargas
const SECTOR_LABELS: Record<string, string> = {
  TECHNOLOGY_ENGINEERING: "Tecnología e Ingeniería",
  DESIGN_CREATIVITY: "Diseño y Creatividad",
  MARKETING_STRATEGY: "Marketing y Estrategia",
  MANAGEMENT_BUSINESS: "Gestión y Negocios",
  FINANCE_PROJECTS: "Finanzas y Proyectos",
  SOCIAL_MEDIA: "Redes Sociales",
  EDUCATION: "Educación",
  SCIENCE: "Ciencia",
};

const getStatus = (score: number) => {
  if (score >= 85) return "Altamente Competitivo";
  if (score >= 70) return "Competitivo";
  if (score >= 50) return "En Desarrollo";
  return "Iniciando";
};

export function EmployabilityCard({ score, sector }: Props) {
  const radius = 54; // Reducido un poco para dar aire
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  const displaySector = sector ? (SECTOR_LABELS[sector] || sector) : "General";
  const status = getStatus(score);

  return (
    <Card className="bg-card border-border/40 rounded-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      <CardContent className="p-2 md:p-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Circular Progress Container */}
          <div className="">
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(var(--primary),0.2)]">
                <circle
                  cx="80" cy="80" r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-secondary/50"
                />
                <circle
                  cx="80" cy="80" r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-tighter text-foreground">
                {score}%
              </span>
                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Score</span>
              </div>

            </div>
            <div className="text-xs text-primary">
              Indice de Empleabilidad
            </div>
          </div>

          {/* Info & Insights */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h4 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                {status}
              </h4>
              <Badge variant="secondary" className="font-bold text-xs px-4 py-1.5 rounded-full">
                {displaySector}
              </Badge>
            </div>

            <p className="text-muted-foreground leading-relaxed text-xs md:text-base font-medium max-w-sm">
              Tu perfil destaca en <span className="text-foreground font-bold">{displaySector}</span>.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/50 border border-border/40 text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Actualizado
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/5 border border-primary/20 text-[10px] font-bold uppercase tracking-tight text-primary">
                Levely AI Verified
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
