"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { FileText } from "lucide-react";

interface CvProcessingScreenProps {
  cvId: string;
}

import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CvProcessingScreen({ cvId }: CvProcessingScreenProps) {
  const router = useRouter();
  const { startCvProcessingTask } = useBackgroundTasks();
  const hasTask = useTaskStore(state => state.tasks[`CV_PROCESSING-${cvId}`]);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!cvId || hasStartedRef.current) return;
    
    // Si no hay una tarea activa, la iniciamos
    if (!hasTask || hasTask.status !== "IN_PROGRESS") {
        hasStartedRef.current = true;
        startCvProcessingTask(cvId);
        // Opcional: router.replace("/cv") si quieres salida inmediata
    }
  }, [cvId, hasTask, startCvProcessingTask]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative">
            <FileText className="w-12 h-12 text-primary" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping" />
        </div>
        
        <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
                Proceso en Segundo Plano
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Este CV se está procesando mediante nuestro protocolo de IA. 
                Puedes seguir explorando la plataforma; te notificaremos en el panel superior cuando termine.
            </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
            <Button onClick={() => router.push("/my-cvs")} variant="outline" className="rounded-2xl gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a mis CVs
            </Button>
            <p className="text-[10px] text-muted-foreground italic uppercase font-bold">
                Progreso actual: {hasTask?.progress || 0}%
            </p>
        </div>
      </div>
    </div>
  );
}
