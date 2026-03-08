"use client";

import { Calendar, Target, Award, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import {InterviewWithRelations} from "@/features/interview/actions/get-interviews";

interface Props {
  session: InterviewWithRelations;
}

export default function InterviewCard({ session }: Props) {
  // Simulación de KPIs si no existen (v1.1.23 standard)
  const score = session.overallScore ?? 0;

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-primary";
    if (val >= 50) return "text-orange-500";
    return "text-destructive";
  };

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-card rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="font-bold rounded-lg text-[10px] uppercase tracking-wider">
            Simulación AI
          </Badge>
          <div className="flex items-center gap-1.5 font-black text-sm px-2 py-1 rounded-lg bg-secondary/50">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] uppercase">{formatDate(session.createdAt, "dd MMM")}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {session.opportunity?.title || "Entrevista General"}
        </h3>
        <p className="text-xs text-muted-foreground font-medium italic">
          Usando: {session.cv?.title || "CV por defecto"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* KPI: Overall Score */}
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Puntaje Global</span>
            </div>
            <span className={cn("font-black text-lg", getScoreColor(score))}>{score}%</span>
          </div>
          <Progress value={score} className="h-1.5" />
        </div>

        {/* Mini Metricas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-secondary/20">
            <span className="text-[9px] font-bold uppercase text-muted-foreground">Confianza</span>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-sm font-bold">{session.confidence ?? 0}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-secondary/20">
            <span className="text-[9px] font-bold uppercase text-muted-foreground">Alineación</span>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-primary" />
              <span className="text-sm font-bold">{session.alignment ?? 0}%</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full rounded-xl font-bold text-xs h-10 border-border/60 hover:bg-primary hover:text-white transition-all group"
        >
          Ver Análisis Detallado
          <BarChart3 className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
