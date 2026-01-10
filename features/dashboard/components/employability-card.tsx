"use client"

import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  score: number;
  sector: string | null;
}

export function EmployabilityCard({ score, sector }: Props) {
  const dashOffset = 364.4 - (364.4 * score) / 100;

  return (
    <Card className="md:col-span-2 border-border shadow-card overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Target className="w-32 h-32 text-primary" />
      </div>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Índice de Empleabilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/30" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                    className="text-secondary transition-all duration-1000"
                    strokeDasharray={364.4}
                    strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="absolute text-3xl font-black text-foreground">{score}%</span>
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Tu perfil es <span className="text-foreground font-bold italic">{score > 70 ? 'Altamente Competitivo' : 'En Crecimiento'}</span>
            {sector && <> en el sector de <span className="text-primary font-bold uppercase">{sector.replace('_', ' ')}</span></>}.
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none font-bold">Actualizado</Badge>
            <Badge variant="outline" className="font-bold border-2">Levely AI Verified</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
