import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";

export interface Task {
  id: string;
  type: "ANALYSIS" | "QUICK_MATCH" | "CV_PROCESSING" | "PROGRESS_TIMELINE";
  status: TaskStatus;
  progress: number;
  title: string;
  description: string;
  error?: string;
  metadata?: any;
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "status" | "progress" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, "status" | "progress" | "description" | "error" | "metadata">>) => void;
  removeTask: (id: string) => void;
  clearFinishedTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => {
          if (state.tasks.some(t => t.id === task.id)) return state;
          return {
            tasks: [
              ...state.tasks,
              {
                ...task,
                status: "IN_PROGRESS",
                progress: 0,
                createdAt: Date.now(),
              },
            ],
          };
        }),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      clearFinishedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "PENDING"),
        })),
    }),
    {
      name: "task-storage",
    }
  )
);
