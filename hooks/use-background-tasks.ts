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
import { startQuickMatchAction } from "@/features/opportunities/actions/start-quick-match";
import { JobStatus } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setActiveRoute as setActiveRouteAction } from "@/features/routes/actions/set-active-route";

const activeIntervals = new Map<string, NodeJS.Timeout>();

export function useBackgroundTasks() {
  const { addTask, updateTask } = useTaskStore();
  const { hydrate, activeRoute, setActiveRoute: setStoreActive, routes } = useRouteStore();
  const router = useRouter();

  const navigateWithTransition = useCallback(
    async (path: string, routeId?: string) => {
      // 1. Immediate client update for instant feedback
      if (routeId) {
        const targetRoute = routes.find((r) => r.id === routeId);
        if (targetRoute) {
          setStoreActive(targetRoute);
        }

        try {
          // 2. Server-side persistence
          const result = await setActiveRouteAction(routeId);
          if (result.success) {
            // 3. Full sync
            const routesResult = await getRoutesForUser();
            if (routesResult.success && routesResult.routes) {
              hydrate(routesResult.routes);

              // Buscar la ruta actualizada para asegurar que tiene todos los datos (cv, etc)
              const updatedRoute = routesResult.routes.find((r) => r.id === routeId);
              if (updatedRoute) {
                setStoreActive(updatedRoute);
              }

              router.refresh();
            }
          }
        } catch (error) {
          console.error("Error switching route during navigation:", error);
        }
      }

      startTransition(() => {
        router.push(path);
      });
    },
    [router, hydrate, routes, setStoreActive],
  );

  const startAnalysisTask = useCallback(
    async (tempCvEvaluationId: string, temporalUserId: string, routeId?: string) => {
      if (!tempCvEvaluationId || !temporalUserId) return;
      const scopeId = tempCvEvaluationId;
      if (activeIntervals.has(scopeId)) return;

      addTask({
        id: `ANALYSIS-${scopeId}`,
        scopeId,
        contextName: "Onboarding",
        type: "ANALYSIS",
        title: "Análisis de Perfil",
        description: "Iniciando protocolo de migración y auditoría IA...",
        originPath: "/onboarding",
        routeParams: { tempCvEvaluationId, temporalUserId },
        metadata: { tempCvEvaluationId, temporalUserId, routeId },
      });

      try {
        const result = await promoteTempAnalysisAction({ tempCvEvaluationId, temporalUserId });
        if (!result.success || !result.cvId) {
          updateTask(scopeId, {
            status: "FAILED",
            description: "Error en la creación de estructura.",
            error: "Promotion failed",
          });
          return;
        }

        const pollInterval = setInterval(async () => {
          try {
            const res = await getPipelineStatus(result.cvId as string);
            if (!res.success) {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              const errorMsg = (res as { error?: string }).error || "Error de conexión.";
              updateTask(scopeId, {
                status: "FAILED",
                description: errorMsg,
                error: errorMsg,
              });
              return;
            }

            const { steps } = res;
            if (
              steps.matches === JobStatus.FAILED ||
              steps.analysis === JobStatus.FAILED ||
              steps.config === JobStatus.FAILED
            ) {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "FAILED",
                description: "El protocolo de auditoría ha fallado.",
              });
              return;
            }

            let progress = 20;
            let description = "Analizando trayectoria...";
            if (steps.config === JobStatus.SUCCEEDED) progress = 40;
            if (steps.analysis === JobStatus.IN_PROGRESS) {
              progress = 60;
              description = "IA: Evaluando score...";
            }
            if (steps.matches === JobStatus.IN_PROGRESS) {
              progress = 80;
              description = "Engine: Escaneando mercado...";
            }

            updateTask(scopeId, { progress, description });

            if (steps.matches === JobStatus.SUCCEEDED) {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "SUCCEEDED",
                progress: 100,
                description: "¡Análisis completado con éxito!",
                metadata: { ...res, onSuccessPath: "/dashboard" },
              });
              const routesResult = await getRoutesForUser();
              if (routesResult.success) hydrate(routesResult.routes);
              toast.success("¡Análisis completado!");
              router.refresh();
            }
          } catch (e) {
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            updateTask(scopeId, { status: "FAILED", description: "Error de red." });
          }
        }, 3000);
        activeIntervals.set(scopeId, pollInterval);
      } catch (error) {
        updateTask(scopeId, { status: "FAILED", description: "Error inesperado." });
      }
    },
    [addTask, updateTask, hydrate],
  );

  const startCvProcessingTask = useCallback(
    async (cvId: string, routeId?: string) => {
      if (!cvId) return;
      const scopeId = cvId;
      if (activeIntervals.has(scopeId)) return;

      const targetRouteId = routeId || activeRoute?.id;

      addTask({
        id: `CV_PROCESSING-${scopeId}`,
        scopeId,
        contextName: activeRoute?.name || "CV",
        type: "CV_PROCESSING",
        title: "Procesando CV",
        description: "Extrayendo habilidades con IA...",
        originPath: `/cv/${cvId}/processing`,
        routeParams: { cvId },
        metadata: { cvId, routeId: targetRouteId },
      });

      const pollInterval = setInterval(async () => {
        try {
          const result = await getCvProcessingStatus(cvId);
          if (!result.success) {
            const errorMsg = (result as { error?: string }).error || "Error de red.";
            updateTask(scopeId, {
              status: "FAILED",
              description: errorMsg,
            });
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            return;
          }

          if (result.status === "SUCCEEDED") {
            updateTask(scopeId, {
              status: "SUCCEEDED",
              progress: 100,
              description: "¡CV procesado!",
              metadata: { cvId, onSuccessPath: `/cv/${cvId}/preview` },
            });
            const routesResult = await getRoutesForUser();
            if (routesResult.success) hydrate(routesResult.routes);
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            toast.success("CV procesado");
            router.refresh();
          } else if (result.status === "FAILED") {
            updateTask(scopeId, { status: "FAILED", description: "Fallo en el procesamiento." });
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
          } else {
            updateTask(scopeId, { progress: 50, description: "IA está trabajando..." });
          }
        } catch (e) {
          clearInterval(pollInterval);
          activeIntervals.delete(scopeId);
          updateTask(scopeId, { status: "FAILED", description: "Error de conexión." });
        }
      }, 3000);
      activeIntervals.set(scopeId, pollInterval);
    },
    [addTask, updateTask, hydrate, activeRoute],
  );

  const startProgressTimelineTask = useCallback(
    async (cvId: string, routeId?: string) => {
      if (!cvId) return;
      const scopeId = cvId;
      if (activeIntervals.has(scopeId)) return;

      const targetRouteId = routeId || activeRoute?.id;

      addTask({
        id: `PROGRESS_TIMELINE-${scopeId}`,
        scopeId,
        contextName: activeRoute?.name || "Evaluación",
        type: "PROGRESS_TIMELINE",
        title: "Evaluando Potencial",
        description: "Analizando fortalezas con IA...",
        originPath: `/process/${cvId}`,
        routeParams: { cvId },
        metadata: { cvId, routeId: targetRouteId },
      });

      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/cv/${cvId}/status?t=${Date.now()}`, {
            cache: "no-store",
          }).then((r) => r.json());
          if (!res) return;

          if (res.status === "CV_EVALUATION_IN_PROGRESS") {
            updateTask(scopeId, { progress: 70, description: "Generando reporte..." });
          }

          if (res.status === "CV_EVALUATION_FAILED" || res.status === "CV_FAILED") {
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            updateTask(scopeId, { status: "FAILED", description: "Fallo en evaluación." });
          }

          if (res.status === "CV_EVALUATION_SUCCEEDED" || res.status === "CV_EVALUATION_FINISHED") {
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            updateTask(scopeId, {
              status: "SUCCEEDED",
              progress: 100,
              description: "¡Evaluación finalizada!",
              metadata: { cvId, onSuccessPath: `/my-evaluation/${res.evaluateId}` },
            });
            const routesResult = await getRoutesForUser();
            if (routesResult.success) hydrate(routesResult.routes);
            toast.success("Evaluación lista");
            router.refresh();
          }
        } catch (e) {
          clearInterval(pollInterval);
          activeIntervals.delete(scopeId);
          updateTask(scopeId, { status: "FAILED", description: "Error de red." });
        }
      }, 3000);
      activeIntervals.set(scopeId, pollInterval);
    },
    [addTask, updateTask, hydrate, activeRoute],
  );

  const startRoadmapTask = useCallback(
    async (opportunityId: string, cvId: string, routeId: string) => {
      if (!opportunityId || !cvId || !routeId) return;
      const scopeId = opportunityId;
      if (activeIntervals.has(scopeId)) return;

      addTask({
        id: `ROADMAP-${scopeId}`,
        scopeId,
        contextName: activeRoute?.name || "Oportunidad",
        type: "ROADMAP_GENERATION",
        title: "Diseñando Roadmap",
        description: "La IA está trazando tu plan de carrera...",
        originPath: `/opportunities/${opportunityId}`,
        routeParams: { opportunityId, cvId, routeId },
        metadata: { opportunityId, cvId, routeId },
      });

      try {
        const result = await generateRoadmapAction({ opportunityId, cvId, routeId });
        if (!result.success) {
          updateTask(scopeId, {
            status: "FAILED",
            description: result.message || "Error al iniciar roadmap.",
          });
          return;
        }

        if (result.status === 200 && result.data?.roadmapId) {
          updateTask(scopeId, {
            status: "SUCCEEDED",
            progress: 100,
            description: "¡Roadmap listo!",
            metadata: {
              roadmapId: result.data.roadmapId,
              onSuccessPath: `/my-roadmaps/${result.data.roadmapId}`,
            },
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
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "SUCCEEDED",
                progress: 100,
                description: "¡Roadmap generado con éxito!",
                metadata: {
                  roadmapId: res.roadmapId,
                  onSuccessPath: `/my-roadmaps/${res.roadmapId}`,
                },
              });
              const routesResult = await getRoutesForUser();
              if (routesResult.success) hydrate(routesResult.routes);
              toast.success("¡Roadmap listo!");
              router.refresh();
            } else if (res.status === "FAILED") {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "FAILED",
                description: "No se pudo generar el roadmap.",
              });
            } else {
              updateTask(scopeId, { progress: 60, description: "IA: Diseñando hitos y tareas..." });
            }
          } catch (e) {
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            updateTask(scopeId, { status: "FAILED", description: "Error de red." });
          }
        }, 3000);
        activeIntervals.set(scopeId, pollInterval);
      } catch (error) {
        updateTask(scopeId, { status: "FAILED", description: "Error inesperado." });
      }
    },
    [addTask, updateTask, hydrate, activeRoute],
  );

  const startQuickMatchTask = useCallback(
    async (cvId: string, routeId?: string) => {
      if (!cvId) return;
      const scopeId = cvId;
      if (activeIntervals.has(scopeId)) return;

      const targetRouteId = routeId || activeRoute?.id;

      addTask({
        id: `QUICK_MATCH-${scopeId}`,
        scopeId,
        contextName: activeRoute?.name || "Oportunidades",
        type: "QUICK_MATCH",
        title: "Buscando Oportunidades",
        description: "Escaneando el mercado laboral para ti...",
        originPath: `/opportunities/cv/${cvId}/analysis`,
        routeParams: { cvId },
        metadata: { cvId, routeId: targetRouteId },
      });

      try {
        const result = await startQuickMatchAction(cvId);

        if (!result.success) {
          updateTask(scopeId, {
            status: "FAILED",
            description: result.message || "Error al iniciar búsqueda.",
          });
          return;
        }

        const pollInterval = setInterval(async () => {
          try {
            const res = await getPipelineStatus(cvId);
            if (!res.success) {
              updateTask(scopeId, { status: "FAILED", description: "Error al obtener estado." });
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              return;
            }

            const { steps } = res;
            if (steps.matches === JobStatus.SUCCEEDED) {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "SUCCEEDED",
                progress: 100,
                description: "¡Oportunidades encontradas!",
                metadata: { cvId, onSuccessPath: "/my-opportunities" },
              });
              const routesResult = await getRoutesForUser();
              if (routesResult.success) hydrate(routesResult.routes);
              toast.success("Oportunidades listas");
              router.refresh();
            } else if (steps.matches === JobStatus.FAILED) {
              clearInterval(pollInterval);
              activeIntervals.delete(scopeId);
              updateTask(scopeId, {
                status: "FAILED",
                description: "Fallo al buscar oportunidades.",
              });
            } else {
              updateTask(scopeId, {
                progress: 80,
                description: "IA: Filtrando mejores matches...",
              });
            }
          } catch (e) {
            clearInterval(pollInterval);
            activeIntervals.delete(scopeId);
            updateTask(scopeId, { status: "FAILED", description: "Error de conexión." });
          }
        }, 3000);
        activeIntervals.set(scopeId, pollInterval);
      } catch (error) {
        updateTask(scopeId, { status: "FAILED", description: "Error inesperado." });
      }
    },
    [addTask, updateTask, hydrate, activeRoute],
  );

  const handleSeeResults = useCallback(
    async (onSuccessPath: string, routeId?: string) => {
      if (routeId) {
        // Usar la lógica de navegación con cambio de ruta que ya implementamos
        await navigateWithTransition(onSuccessPath, routeId);
      } else {
        startTransition(() => {
          router.push(onSuccessPath);
        });
      }
    },
    [navigateWithTransition, router],
  );

  return {
    startAnalysisTask,
    startCvProcessingTask,
    startProgressTimelineTask,
    startRoadmapTask,
    startQuickMatchTask,
    navigateWithTransition,
    handleSeeResults,
  };
}
