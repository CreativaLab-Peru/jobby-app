"use client";

import { useCallback } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { promoteTempAnalysisAction } from "@/features/onboarding/actions/promote-temp-analysis";
import { getPipelineStatus } from "@/features/onboarding/actions/get-pipeline-status";
import { getCvProcessingStatus } from "@/features/cv/actions/get-cv-processing-status";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouteStore } from "@/store/use-route-store";
import { JobStatus } from "@prisma/client";
import { toast } from "sonner";

const activeIntervals = new Map<string, NodeJS.Timeout>();

export function useBackgroundTasks() {
  const { tasks, addTask, updateTask } = useTaskStore();
  const { hydrate } = useRouteStore();

  const startAnalysisTask = useCallback(async (tempCvEvaluationId: string, temporalUserId: string) => {
    const taskId = `analysis-${tempCvEvaluationId}`;
    
    // Si ya hay un intervalo corriendo para esta tarea, no hacer nada
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      type: "ANALYSIS",
      title: "Análisis de Perfil",
      description: "Iniciando protocolo de migración y auditoría IA...",
      metadata: { tempCvEvaluationId, temporalUserId }
    });

    try {
      const result = await promoteTempAnalysisAction({ tempCvEvaluationId, temporalUserId });

      if (!result.success || !result.cvId) {
        updateTask(taskId, { status: "FAILED", description: "Error crítico: No se pudo crear la estructura.", error: "Promotion failed" });
        return;
      }

      updateTask(taskId, { description: "Estructura de CV creada. Iniciando auditoría...", progress: 20 });

      const pollInterval = setInterval(async () => {
        try {
          const res = await getPipelineStatus(result.cvId!);
          if (!res.success) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: res.error || "Error al obtener el estado de la migración.", error: res.error });
            return;
          }

          const { steps } = res;
          
          if (steps.matches === JobStatus.FAILED || steps.analysis === JobStatus.FAILED || steps.config === JobStatus.FAILED) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: "El protocolo de auditoría ha fallado.", error: "Pipeline failed" });
            return;
          }

          let progress = 20;
          let description = "Analizando trayectoria...";

          if (steps.config === JobStatus.SUCCEEDED) progress = 40;
          if (steps.analysis === JobStatus.IN_PROGRESS) {
              progress = 60;
              description = "IA: Evaluando score y habilidades...";
          }
          if (steps.matches === JobStatus.IN_PROGRESS) {
              progress = 80;
              description = "Engine: Escaneando mercado global...";
          }

          updateTask(taskId, { progress, description });

          if (steps.matches === JobStatus.SUCCEEDED) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { 
              status: "SUCCEEDED", 
              progress: 100, 
              description: "¡Análisis completado con éxito!",
              metadata: { ...res, onSuccessPath: "/dashboard" }
            });
            
            const routesResult = await getRoutesForUser();
            if (routesResult.success) {
              hydrate(routesResult.routes);
            }
            toast.success("¡Análisis de perfil completado!");
          }
        } catch (e) {
          clearInterval(pollInterval);
          activeIntervals.delete(taskId);
          updateTask(taskId, { 
            status: "FAILED", 
            description: "Se perdió la conexión con el servidor de monitoreo.",
            error: String(e)
          });
        }
      }, 3000);

      activeIntervals.set(taskId, pollInterval);

    } catch (error) {
      updateTask(taskId, { status: "FAILED", description: "Ocurrió un error inesperado.", error: String(error) });
    }
  }, [addTask, updateTask, hydrate]);

  const startQuickMatchTask = useCallback(async (cvId: string) => {
    const taskId = `quick-match-${cvId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      type: "QUICK_MATCH",
      title: "Sincronizando Perfil",
      description: "Buscando oportunidades compatibles...",
      metadata: { cvId }
    });

    let progress = 0;
    const duration = 10000;
    const interval = 100;
    const stepIncrement = (interval / duration) * 100;

    const progressTimer = setInterval(async () => {
      progress += stepIncrement;
      if (progress >= 100) {
        clearInterval(progressTimer);
        activeIntervals.delete(taskId);
        updateTask(taskId, { 
            status: "SUCCEEDED", 
            progress: 100, 
            description: "¡Sincronización completada!",
            metadata: { cvId, onSuccessPath: "/my-opportunities" }
        });

        const routesResult = await getRoutesForUser();
        if (routesResult.success) {
          hydrate(routesResult.routes);
        }
        toast.success("¡Match rápido completado!");
        return;
      }
      updateTask(taskId, { progress });
    }, interval);

    activeIntervals.set(taskId, progressTimer);
  }, [addTask, updateTask, hydrate]);

  const startCvProcessingTask = useCallback(async (cvId: string) => {
    const taskId = `cv-processing-${cvId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      type: "CV_PROCESSING",
      title: "Procesando CV",
      description: "Extrayendo habilidades y estructurando secciones...",
      metadata: { cvId }
    });

    const poll = async () => {
      try {
        const result = await getCvProcessingStatus(cvId);
        if (!result.success) {
           updateTask(taskId, { status: "FAILED", description: result.error || "Error de conexión con el servidor." });
           return true;
        }

        if (result.status === "SUCCEEDED") {
          updateTask(taskId, { 
              status: "SUCCEEDED", 
              progress: 100, 
              description: "¡CV procesado con éxito!",
              metadata: { cvId, onSuccessPath: `/cv/${cvId}/preview` }
          });
          
          const routesResult = await getRoutesForUser();
          if (routesResult.success) {
            hydrate(routesResult.routes);
          }
          toast.success("¡CV procesado!");
          return true;
        } else if (result.status === "FAILED") {
          updateTask(taskId, { 
            status: "FAILED", 
            description: result.error || "La IA no pudo procesar este archivo. Revisa que no tenga contraseña.",
            error: result.error
          });
          return true;
        }
        
        updateTask(taskId, { progress: 50, description: "La IA está trabajando en tu perfil..." });
        return false;
      } catch (e) {
        updateTask(taskId, { status: "FAILED", description: "Error al consultar estado del proceso." });
        return true;
      }
    };

    const intervalId = setInterval(async () => {
      const finished = await poll();
      if (finished) {
        clearInterval(intervalId);
        activeIntervals.delete(taskId);
      }
    }, 3000);

    activeIntervals.set(taskId, intervalId);
  }, [addTask, updateTask, hydrate]);

  const startProgressTimelineTask = useCallback(async (cvId: string) => {
    const taskId = `timeline-${cvId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      type: "PROGRESS_TIMELINE",
      title: "Evaluando Potencial",
      description: "Analizando fortalezas y mejoras con IA...",
      metadata: { cvId }
    });

    let step = 0;
    updateTask(taskId, { progress: 10 });

    const timeoutId = setTimeout(() => {
        step = 1;
        updateTask(taskId, { progress: 40, description: "Evaluando perfil..." });
    }, 3000);

    const pollInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/cv/${cvId}/status`).then(r => r.json());
            if (!res) return;

            // Mapeo exhaustivo de estados según progress-timeline.tsx original
            if (res.status === "CV_EVALUATION_IN_PROGRESS" || res.status === "CV_EVALUATION_PENDING_EVALUATION") {
                updateTask(taskId, { progress: 70, description: "Generando reporte de IA..." });
            }

            if (res.status === "CV_EVALUATION_FAILED" || res.status === "CV_FAILED") {
                clearInterval(pollInterval);
                clearTimeout(timeoutId);
                activeIntervals.delete(taskId);
                updateTask(taskId, { 
                    status: "FAILED", 
                    description: res.error || "La evaluación ha fallado. Reintenta más tarde.",
                    error: res.error
                });
            }

            if (res.status === "CV_EVALUATION_SUCCEEDED" || res.status === "CV_EVALUATION_FINISHED") {
                clearInterval(pollInterval);
                clearTimeout(timeoutId);
                activeIntervals.delete(taskId);
                
                updateTask(taskId, { 
                    status: "SUCCEEDED", 
                    progress: 100, 
                    description: "¡Evaluación finalizada!",
                    metadata: { cvId, onSuccessPath: `/my-evaluation/${res.evaluateId}` }
                });

                const routesResult = await getRoutesForUser();
                if (routesResult.success) {
                  hydrate(routesResult.routes);
                }
                toast.success("¡Evaluación completada!");
            }
        } catch (e) {
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            activeIntervals.delete(taskId);
            updateTask(taskId, { 
                status: "FAILED", 
                description: "Se perdió la conexión con el servidor de evaluación.",
                error: String(e)
            });
        }
    }, 3000);

    activeIntervals.set(taskId, pollInterval);
  }, [addTask, updateTask, hydrate]);

  return {
    startAnalysisTask,
    startQuickMatchTask,
    startCvProcessingTask,
    startProgressTimelineTask
  };
}
