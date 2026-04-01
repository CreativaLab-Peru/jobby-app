"use client";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {ChevronLeft, Sparkles, Lightbulb, TrendingUp, Lock, ArrowRight} from "lucide-react";
import Link from "next/link";
import {CreditPackModal} from "@/features/credits/components/credit-pack-modal";
import {CreditPackOffer} from "@/features/credits/consts";
import {useCreditModal} from "@/features/credits/hooks/use-credit-modal";
import {EmailModal} from "@/components/email-modal";
import {useState} from "react";

interface AnalysisResultsScreenProps {
  initialData: any;
  score: number;
  id: string;
  packs: CreditPackOffer[];
}

export default function AnalysisResultsScreen({
                                                initialData,
                                                score,
                                                packs,
                                                id,
                                              }: AnalysisResultsScreenProps) {
  const evaluation = initialData?.evaluation;

  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);
  const [temporalUserId, setTemporalUserId] = useState<string | null>(null);

  const {onOpen} = useCreditModal();

  const handleOpenCreditPackModal = () => {
    setIsOpenEmailModal(true);
  }

  const handleEmailSuccess = (tempUserId: string) => {
    setTemporalUserId(tempUserId);
    setIsOpenEmailModal(false);
    onOpen();
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Botón Volver - Usa text-muted-foreground y hover:text-primary */}
        <Link href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
          <ChevronLeft className="w-4 h-4"/> Volver a CV Builder
        </Link>

        {/* HEADER: Score de Empleabilidad */}
        <Card className="p-8 rounded-[2.5rem] border-border/50 shadow-xl bg-card">
          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-secondary rounded-2xl">
                <TrendingUp className="w-8 h-8 text-secondary-foreground"/>
              </div>
              <div>
                <p
                  className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Score
                  de Empleabilidad</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-foreground">{Math.round(score)}</span>
                  <span className="text-xl text-muted-foreground font-bold">/100</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary"
                   className="rounded-full px-4 py-2 bg-secondary text-secondary-foreground border-none gap-2 font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary"/> Análisis IA completado
            </Badge>
          </div>

          <div className="space-y-4">
            <Progress value={score} className="h-3 bg-secondary"/>
            <div
              className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              <span>Bajo</span>
              <span className="text-primary/60">Promedio</span>
              <span>Excelente</span>
            </div>
          </div>
        </Card>

        {/* GRID: Insights y Áreas de Mejora */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Insight Card */}
          <Card className="p-8 rounded-[2.5rem] border-border/50 shadow-lg bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Lightbulb className="w-5 h-5"/>
              </div>
              <h3 className="font-black text-lg tracking-tight">Insight de tu perfil</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm font-medium line-clamp-5">
              {evaluation?.summary || "Cargando análisis estratégico..."}
            </p>
          </Card>

          {/* Área de Mejora Card */}
          <Card className="p-8 rounded-[2.5rem] border-border/50 shadow-lg bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-destructive/10 rounded-xl text-destructive">
                <TrendingUp className="w-5 h-5"/>
              </div>
              <h3 className="font-black text-lg tracking-tight">Área de mejora</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm font-medium">
              {evaluation?.weaknesses?.[0] || "Identificando puntos críticos..."}
            </p>
          </Card>
        </div>

        {/* SECCIÓN PREMIUM: Oportunidades y Bloqueo */}
        <div className="space-y-8 pt-10">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-center">Oportunidades que hacen
              Match</h2>
            <div className="h-1 w-12 bg-primary rounded-full"/>
          </div>

          {/* Simulación de contenido bloqueado */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 select-none pointer-events-none grayscale blur-[1px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}
                    className="p-8 rounded-[2rem] border-dashed border-2 border-border flex flex-col items-center justify-center gap-4 bg-secondary/20">
                <Lock className="w-6 h-6 text-muted-foreground"/>
                <div className="h-3 w-20 bg-muted rounded-full"/>
                <div className="h-3 w-16 bg-muted/50 rounded-full"/>
              </Card>
            ))}
          </div>

          {/* CTA FINAL: Desbloquear */}
          <Card
            className="p-12 rounded-[3.5rem] bg-secondary/40 border border-border/40 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"/>

            <div className="p-4 bg-background rounded-3xl shadow-inner">
              <Sparkles className="w-10 h-10 text-primary animate-pulse"/>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black tracking-tight">Tu CV fue analizado con IA</h3>
              <p className="text-muted-foreground max-w-sm font-medium">
                Desbloquea el reporte completo para acceder a recomendaciones personalizadas y el
                match de oportunidades.
              </p>
            </div>

            <Button
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 px-10 py-7 h-auto text-lg font-black gap-3 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              onClick={handleOpenCreditPackModal}
            >
              Desbloquear Reporte Completo <ArrowRight className="w-5 h-5"/>
            </Button>
          </Card>
        </div>
      </div>
      <EmailModal
        isOpen={isOpenEmailModal}
        closeModal={() => setIsOpenEmailModal(false)}
        onSuccess={handleEmailSuccess}
        newEvaluationId={id}
      />
      <CreditPackModal
        packs={packs}
        tempUserId={temporalUserId}
      />
    </>
  );
}
