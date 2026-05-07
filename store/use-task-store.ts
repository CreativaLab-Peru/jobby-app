import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";

export interface TaskMetadata {
  cvId?: string;
  routeId?: string;
  opportunityId?: string;
  roadmapId?: string;
  evaluateId?: string;
  onSuccessPath?: string;
  tempCvEvaluationId?: string;
  temporalUserId?: string;
  [key: string]: string | number | boolean | undefined | null | object;
}

export interface Task {
  id: string; // ID único (ej: type-scopeId)
  scopeId: string; // ID del contexto (cvId, evaluationId, etc)
  contextName?: string; // Nombre ruta (ej: "Ruta A")
  type: "ANALYSIS" | "QUICK_MATCH" | "CV_PROCESSING" | "PROGRESS_TIMELINE" | "ROADMAP_GENERATION";
  status: TaskStatus;
  progress: number;
  title: string;
  description: string;
  originPath: string; // URL base de origen
  routeParams?: Record<string, string>; // Parámetros dinámicos para reconstruir URL
  error?: string;
  metadata?: TaskMetadata;
  createdAt: number;
}

interface TaskStore {
  tasks: Record<string, Task>; // Key is scopeId (route/cvId/etc)
  addTask: (task: Omit<Task, "status" | "progress" | "createdAt">) => boolean;
  updateTask: (
    scopeId: string,
    updates: Partial<Pick<Task, "status" | "progress" | "description" | "error" | "metadata">>,
  ) => void;
  removeTask: (scopeId: string) => void;
  reset: () => void;
  hasTask: (scopeId: string) => boolean;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: {},

      reset: () => set({ tasks: {} }),

      hasTask: (scopeId) => !!get().tasks[scopeId],

      addTask: (task) => {
        const state = get();
        // Evitar duplicados si ya está en curso para este scope
        if (state.tasks[task.scopeId] && state.tasks[task.scopeId].status === "IN_PROGRESS") {
          return false;
        }

        set((state) => ({
          tasks: {
            ...state.tasks,
            [task.scopeId]: {
              ...task,
              status: "IN_PROGRESS",
              progress: 0,
              createdAt: Date.now(),
            },
          },
        }));
        return true;
      },

      updateTask: (scopeId, updates) =>
        set((state) => {
          const existingTask = state.tasks[scopeId];
          if (!existingTask) return state;
          
          return {
            tasks: {
              ...state.tasks,
              [scopeId]: {
                ...existingTask,
                ...updates,
                metadata: updates.metadata
                  ? { ...existingTask.metadata, ...updates.metadata }
                  : existingTask.metadata,
              },
            },
          };
        }),

      removeTask: (scopeId) =>
        set((state) => {
          const { [scopeId]: _, ...rest } = state.tasks;
          return { tasks: rest };
        }),
    }),
    {
      name: "task-storage",
    },
  ),
);
