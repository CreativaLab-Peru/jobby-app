"use client";

import { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/use-task-store";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";

export function TaskHydrator() {
  const { tasks } = useTaskStore();
  const { 
    startAnalysisTask, 
    startQuickMatchTask, 
    startCvProcessingTask, 
    startProgressTimelineTask 
  } = useBackgroundTasks();
  const hydratedTasks = useRef<Set<string>>(new Set());

  useEffect(() => {
    // El store ahora es un Record, iteramos sobre sus valores
    Object.values(tasks).forEach((task) => {
      if (task.status === "IN_PROGRESS" && !hydratedTasks.current.has(task.id)) {
        hydratedTasks.current.add(task.id);
        
        // Reiniciar el polling según el tipo de tarea
        switch (task.type) {
          case "ANALYSIS":
            if (task.metadata?.tempCvEvaluationId && task.metadata?.temporalUserId) {
                startAnalysisTask(task.metadata.tempCvEvaluationId, task.metadata.temporalUserId);
            }
            break;
          case "QUICK_MATCH":
            if (task.metadata?.cvId) {
                startQuickMatchTask(task.metadata.cvId);
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
        }
      }
    });
  }, [tasks, startAnalysisTask, startQuickMatchTask, startCvProcessingTask, startProgressTimelineTask]);

  return null;
}
