"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Map } from "lucide-react";
import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface RoadmapProcessingScreenProps {
  roadmapId: string;
  opportunityId: string;
  cvId: string;
  routeId: string;
}

export function RoadmapProcessingScreen({
  roadmapId,
  opportunityId,
  cvId,
  routeId,
}: RoadmapProcessingScreenProps) {
  const router = useRouter();
  const { startRoadmapTask } = useBackgroundTasks();
  const hasTask = useTaskStore((state) => state.tasks[opportunityId]);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!opportunityId || hasStartedRef.current) return;

    // Si no hay una tarea activa, la iniciamos (o reiniciamos el polling)
    if (!hasTask || hasTask.status !== "IN_PROGRESS") {
      hasStartedRef.current = true;
      startRoadmapTask(opportunityId, cvId, routeId);
    }
  }, [opportunityId, cvId, routeId, hasTask, startRoadmapTask]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative">
          <Map className="w-12 h-12 text-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            Diseñando Roadmap
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nuestro motor de IA está trazando tu plan de carrera paso a paso. Puedes seguir
            explorando la plataforma; te notificaremos cuando esté listo.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="rounded-2xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Button>
          <p className="text-[10px] text-muted-foreground italic uppercase font-bold">
            Progreso actual: {hasTask?.progress || 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
