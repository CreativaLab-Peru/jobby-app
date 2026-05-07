"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Rocket } from "lucide-react";
import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MatchProcessingScreenProps {
  cvId: string;
}

export function MatchProcessingScreen({ cvId }: MatchProcessingScreenProps) {
  const router = useRouter();
  const { startQuickMatchTask } = useBackgroundTasks();
  const hasTask = useTaskStore((state) => state.tasks[cvId]);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!cvId || hasStartedRef.current) return;

    // Si no hay una tarea activa, la iniciamos o reanudamos el polling
    if (!hasTask || hasTask.status !== "IN_PROGRESS") {
      hasStartedRef.current = true;
      if (typeof startQuickMatchTask === "function") {
        startQuickMatchTask(cvId);
      }
    }
  }, [cvId, hasTask, startQuickMatchTask]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative">
          <Rocket className="w-12 h-12 text-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            Escaneando Oportunidades
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La IA está analizando tu perfil contra miles de vacantes en el mercado. Puedes seguir
            explorando la plataforma; te notificaremos cuando tengamos los resultados.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="rounded-2xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
          <p className="text-[10px] text-muted-foreground italic uppercase font-bold">
            Buscando coincidencias...
          </p>
        </div>
      </div>
    </div>
  );
}
