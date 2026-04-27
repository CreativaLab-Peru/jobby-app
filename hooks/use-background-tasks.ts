"use client";

import { useCallback, startTransition } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { promoteTempAnalysisAction } from "@/features/onboarding/actions/promote-temp-analysis";
import { getPipelineStatus } from "@/features/onboarding/actions/get-pipeline-status";
import { getCvProcessingStatus } from "@/features/cv/actions/get-cv-processing-status";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouteStore } from "@/store/use-route-store";
import { generateRoadmapAction } from "@/features/roadmap/actions/generate-roadmap";
import { getRoadmapStatus } from "@/features/roadmap/actions/get-roadmap-status";
import { JobStatus } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addTransitionType } from "react";

const activeIntervals = new Map<string, NodeJS.Timeout>();

export function useBackgroundTasks() {
  const { addTask, updateTask } = useTaskStore();
  const { hydrate } = useRouteStore();
  const router = useRouter();

  const navigateWithTransition = useCallback((path: string, type?: string) => {
    startTransition(() => {
      if (type) addTransitionType(type);
      router.push(path);
    });
  }, [router]);

  const getOriginPath = () => typeof window !== "undefined" ? window.location.pathname : "/";

  const startAnalysisTask = useCallback(async (tempCvEvaluationId: string, temporalUserId: string) => {
    if (!tempCvEvaluationId || !temporalUserId) return;
    const taskId = `ANALYSIS-${tempCvEvaluationId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      scopeId: tempCvEvaluationId,
      type: "ANALYSIS",
      title: "Análisis de Perfil",
      description: "Iniciando protocolo de migración y auditoría IA...",
      originPath: "/onboarding",
      routeParams: { tempCvEvaluationId, temporalUserId },
      metadata: { tempCvEvaluationId, temporalUserId }
    });

    try {
      const result = await promoteTempAnalysisAction({ tempCvEvaluationId, temporalUserId });
      if (!result.success || !result.cvId) {
        updateTask(taskId, { status: "FAILED", description: "Error en la creación de estructura.", error: "Promotion failed" });
        return;
      }

      const pollInterval = setInterval(async () => {
        try {
          const res = await getPipelineStatus(result.cvId!);
          if (!res.success) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: (res as any).error || "Error de conexión.", error: (res as any).error });
            return;
          }

          const { steps } = res;
          if (steps.matches === JobStatus.FAILED || steps.analysis === JobStatus.FAILED || steps.config === JobStatus.FAILED) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: "El protocolo de auditoría ha fallado." });
            return;
          }

          let progress = 20;
          let description = "Analizando trayectoria...";
          if (steps.config === JobStatus.SUCCEEDED) progress = 40;
          if (steps.analysis === JobStatus.IN_PROGRESS) { progress = 60; description = "IA: Evaluando score..."; }
          if (steps.matches === JobStatus.IN_PROGRESS) { progress = 80; description = "Engine: Escaneando mercado..."; }

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
            if (routesResult.success) hydrate(routesResult.routes);
            toast.success("¡Análisis completado!");
          }
        } catch (e) {
          clearInterval(pollInterval);
          activeIntervals.delete(taskId);
          updateTask(taskId, { status: "FAILED", description: "Error de red." });
        }
      }, 3000);
      activeIntervals.set(taskId, pollInterval);
    } catch (error) {
      updateTask(taskId, { status: "FAILED", description: "Error inesperado." });
    }
  }, [addTask, updateTask, hydrate]);

  const startCvProcessingTask = useCallback(async (cvId: string) => {
    if (!cvId) return;
    const taskId = `CV_PROCESSING-${cvId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      scopeId: cvId,
      type: "CV_PROCESSING",
      title: "Procesando CV",
      description: "Extrayendo habilidades con IA...",
      originPath: `/cv/${cvId}/processing`,
      routeParams: { cvId },
      metadata: { cvId }
    });

    const pollInterval = setInterval(async () => {
        try {
            const result = await getCvProcessingStatus(cvId);
            if (!result.success) {
                updateTask(taskId, { status: "FAILED", description: (result as any).error || "Error de red." });
                clearInterval(pollInterval);
                activeIntervals.delete(taskId);
                return;
            }

            if (result.status === "SUCCEEDED") {
                updateTask(taskId, { 
                    status: "SUCCEEDED", 
                    progress: 100, 
                    description: "¡CV procesado!",
                    metadata: { cvId, onSuccessPath: `/cv/${cvId}/preview` }
                });
                const routesResult = await getRoutesForUser();
                if (routesResult.success) hydrate(routesResult.routes);
                clearInterval(pollInterval);
                activeIntervals.delete(taskId);
                toast.success("CV procesado");
            } else if (result.status === "FAILED") {
                updateTask(taskId, { status: "FAILED", description: "Fallo en el procesamiento." });
                clearInterval(pollInterval);
                activeIntervals.delete(taskId);
            } else {
                updateTask(taskId, { progress: 50, description: "IA está trabajando..." });
            }
        } catch (e) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: "Error de conexión." });
        }
    }, 3000);
    activeIntervals.set(taskId, pollInterval);
  }, [addTask, updateTask, hydrate]);

  const startProgressTimelineTask = useCallback(async (cvId: string) => {
    if (!cvId) return;
    const taskId = `PROGRESS_TIMELINE-${cvId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      scopeId: cvId,
      type: "PROGRESS_TIMELINE",
      title: "Evaluando Potencial",
      description: "Analizando fortalezas con IA...",
      originPath: `/process/${cvId}`,
      routeParams: { cvId },
      metadata: { cvId }
    });

    const pollInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/cv/${cvId}/status?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json());
            if (!res) return;

            if (res.status === "CV_EVALUATION_IN_PROGRESS") {
                updateTask(taskId, { progress: 70, description: "Generando reporte..." });
            }

            if (res.status === "CV_EVALUATION_FAILED" || res.status === "CV_FAILED") {
                clearInterval(pollInterval);
                activeIntervals.delete(taskId);
                updateTask(taskId, { status: "FAILED", description: "Fallo en evaluación." });
            }

            if (res.status === "CV_EVALUATION_SUCCEEDED" || res.status === "CV_EVALUATION_FINISHED") {
                clearInterval(pollInterval);
                activeIntervals.delete(taskId);
                updateTask(taskId, { 
                    status: "SUCCEEDED", 
                    progress: 100, 
                    description: "¡Evaluación finalizada!",
                    metadata: { cvId, onSuccessPath: `/my-evaluation/${res.evaluateId}` }
                });
                const routesResult = await getRoutesForUser();
                if (routesResult.success) hydrate(routesResult.routes);
                toast.success("Evaluación lista");
            }
        } catch (e) {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: "Error de red." });
        }
    }, 3000);
    activeIntervals.set(taskId, pollInterval);
  }, [addTask, updateTask, hydrate]);

  const startRoadmapTask = useCallback(async (opportunityId: string, cvId: string, routeId: string) => {
    if (!opportunityId || !cvId || !routeId) return;
    const taskId = `ROADMAP-${opportunityId}`;
    if (activeIntervals.has(taskId)) return;

    addTask({
      id: taskId,
      scopeId: opportunityId,
      type: "ROADMAP_GENERATION",
      title: "Diseñando Roadmap",
      description: "La IA está trazando tu plan de carrera...",
      originPath: `/opportunities/${opportunityId}`,
      routeParams: { opportunityId, cvId, routeId },
      metadata: { opportunityId, cvId, routeId }
    });

    try {
      const result = await generateRoadmapAction({ opportunityId, cvId, routeId });
      if (!result.success) {
        updateTask(taskId, { status: "FAILED", description: result.message || "Error al iniciar roadmap." });
        return;
      }

      // Si ya existe (200), terminamos de inmediato
      if (result.status === 200 && result.data?.roadmapId) {
          updateTask(taskId, { 
            status: "SUCCEEDED", 
            progress: 100, 
            description: "¡Roadmap listo!",
            metadata: { roadmapId: result.data.roadmapId, onSuccessPath: `/my-roadmaps/${result.data.roadmapId}` }
          });
          const routesResult = await getRoutesForUser();
          if (routesResult.success) hydrate(routesResult.routes);
          return;
      }

      const pollInterval = setInterval(async () => {
        try {
          const res = await getRoadmapStatus(opportunityId, cvId, routeId);
          
          if (res.status === "SUCCEEDED") {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { 
              status: "SUCCEEDED", 
              progress: 100, 
              description: "¡Roadmap generado con éxito!",
              metadata: { roadmapId: res.roadmapId, onSuccessPath: `/my-roadmaps/${res.roadmapId}` }
            });
            const routesResult = await getRoutesForUser();
            if (routesResult.success) hydrate(routesResult.routes);
            toast.success("¡Roadmap listo!");
          } else if (res.status === "FAILED") {
            clearInterval(pollInterval);
            activeIntervals.delete(taskId);
            updateTask(taskId, { status: "FAILED", description: "No se pudo generar el roadmap." });
          } else {
            updateTask(taskId, { progress: 60, description: "IA: Diseñando hitos y tareas..." });
          }
        } catch (e) {
          clearInterval(pollInterval);
          activeIntervals.delete(taskId);
          updateTask(taskId, { status: "FAILED", description: "Error de red." });
        }
      }, 3000);
      activeIntervals.set(taskId, pollInterval);
    } catch (error) {
      updateTask(taskId, { status: "FAILED", description: "Error inesperado." });
    }
  }, [addTask, updateTask, hydrate]);

  return {
    startAnalysisTask,
    startCvProcessingTask,
    startProgressTimelineTask,
    startRoadmapTask,
    navigateWithTransition
  };
}
