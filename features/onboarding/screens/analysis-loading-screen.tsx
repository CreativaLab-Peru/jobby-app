"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Loader2 } from "lucide-react";

interface AnalysisLoadingScreenProps {
  temporalUserId: string;
  tempCvEvaluationId: string;
}

import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export function AnalysisLoadingScreen({
  tempCvEvaluationId,
  temporalUserId
}: AnalysisLoadingScreenProps) {
  const router = useRouter();
  const { startAnalysisTask } = useBackgroundTasks();
  const hasTask = useTaskStore(state => state.tasks[`ANALYSIS-${tempCvEvaluationId}`]);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    
    if (!hasTask || hasTask.status !== "IN_PROGRESS") {
        hasStartedRef.current = true;
        startAnalysisTask(tempCvEvaluationId, temporalUserId);
    }
  }, [tempCvEvaluationId, temporalUserId, hasTask, startAnalysisTask]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative">
            <Sparkles className="w-12 h-12 text-primary" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping" />
        </div>
        
        <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
                Migración en Segundo Plano
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Estamos analizando tu trayectoria y migrando tu perfil al sistema global. 
                Puedes ir al dashboard ahora mismo; el proceso continuará en segundo plano.
            </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
            <Button onClick={() => router.push("/dashboard")} variant="default" className="rounded-2xl gap-2 h-12">
                Ir al Dashboard
            </Button>
            <p className="text-[10px] text-muted-foreground italic uppercase font-bold">
                Progreso de Auditoría: {hasTask?.progress || 0}%
            </p>
        </div>
      </div>
    </div>
  );
}
