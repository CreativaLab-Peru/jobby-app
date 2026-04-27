import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";

export interface Task {
  id: string; // ID único (ej: type-scopeId)
  scopeId: string; // ID del contexto (cvId, evaluationId, etc)
  type: "ANALYSIS" | "QUICK_MATCH" | "CV_PROCESSING" | "PROGRESS_TIMELINE" | "ROADMAP_GENERATION";
  status: TaskStatus;
  progress: number;
  title: string;
  description: string;
  originPath: string; // URL base de origen
  routeParams?: Record<string, string>; // Parámetros dinámicos para reconstruir URL
  error?: string;
  metadata?: any;
  createdAt: number;
}

interface TaskStore {
  tasks: Record<string, Task>;
  addTask: (task: Omit<Task, "status" | "progress" | "createdAt">) => boolean;
  updateTask: (id: string, updates: Partial<Pick<Task, "status" | "progress" | "description" | "error" | "metadata">>) => void;
  removeTask: (id: string) => void;
  reset: () => void;
  hasTask: (id: string) => boolean;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: {},
      
      reset: () => set({ tasks: {} }),

      hasTask: (id) => !!get().tasks[id],
      
      addTask: (task) => {
        const state = get();
        // Evitar duplicados si ya está en curso
        if (state.tasks[task.id] && state.tasks[task.id].status === "IN_PROGRESS") {
          return false;
        }

        set((state) => ({
          tasks: {
            ...state.tasks,
            [task.id]: {
              ...task,
              status: "IN_PROGRESS",
              progress: 0,
              createdAt: Date.now(),
            },
          },
        }));
        return true;
      },

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [id]: {
              ...state.tasks[id],
              ...updates,
            },
          },
        })),

      removeTask: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.tasks;
          return { tasks: rest };
        }),
    }),
    {
      name: "task-storage",
    }
  )
);
