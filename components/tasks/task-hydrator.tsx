"use client";

import { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";

export function TaskHydrator() {
  const { tasks } = useTaskStore();
  const { startAnalysisTask, startCvProcessingTask, startProgressTimelineTask, startRoadmapTask } =
    useBackgroundTasks();
  const hydratedTasks = useRef<Set<string>>(new Set());

  useEffect(() => {
    Object.entries(tasks).forEach(([scopeId, task]) => {
      if (task.status === "IN_PROGRESS" && !hydratedTasks.current.has(scopeId)) {
        hydratedTasks.current.add(scopeId);

        // Reiniciar el polling según el tipo de tarea
        switch (task.type) {
          case "ANALYSIS":
            if (task.metadata?.tempCvEvaluationId && task.metadata?.temporalUserId) {
              startAnalysisTask(task.metadata.tempCvEvaluationId, task.metadata.temporalUserId);
            }
            break;
          case "CV_PROCESSING":
            if (task.metadata?.cvId) {
              startCvProcessingTask(task.metadata.cvId);
            }
            break;
          case "PROGRESS_TIMELINE":
            if (task.metadata?.cvId) {
              startProgressTimelineTask(task.metadata.cvId);
            }
            break;
          case "ROADMAP_GENERATION":
            if (task.metadata?.opportunityId && task.metadata?.cvId && task.metadata?.routeId) {
              startRoadmapTask?.(
                task.metadata.opportunityId,
                task.metadata.cvId,
                task.metadata.routeId,
              );
            }
            break;
        }
      }
    });
  }, [
    tasks,
    startAnalysisTask,
    startCvProcessingTask,
    startProgressTimelineTask,
    startRoadmapTask,
  ]);

  return null;
}
