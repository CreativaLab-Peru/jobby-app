"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  Terminal,
  Sparkles,
  Rocket,
  Search,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore, Task } from "@/store/use-task-store";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";

const ICON_MAP = {
  ANALYSIS: Sparkles,
  QUICK_MATCH: Rocket,
  CV_PROCESSING: FileText,
  PROGRESS_TIMELINE: Search,
};

export function FloatingTaskPanel() {
  const { tasks, removeTask, reset } = useTaskStore();
  const backgroundTasks = useBackgroundTasks();
  const [isMinimized, setIsMinimized] = useState(false);

  // Filtramos tareas inválidas o vacías para evitar "zombies"
  const taskList = Object.values(tasks).filter((t) => t.id && t.title);

  if (taskList.length === 0) return null;

  const activeTasks = taskList.filter((t) => t.status === "IN_PROGRESS");

  return (
    <div className="fixed top-6 right-6 z-[100] w-80 pointer-events-none">
      <div className="pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cn(
            "bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500",
            isMinimized ? "h-14" : "h-auto max-h-[80vh]",
          )}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between bg-primary/5 border-b border-border/20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Terminal className="w-4 h-4 text-primary" />
                {activeTasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {activeTasks.length > 0 ? "Procesando" : "Tareas Finalizadas"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Limpiar todo"
                onClick={reset}
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Task List */}
          <AnimatePresence initial={false}>
            {!isMinimized && (
              <motion.div
                key="task-list-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 space-y-4 overflow-y-auto"
              >
                <AnimatePresence mode="popLayout">
                  {taskList.map((task) => (
                    <TaskItem
                      key={task.scopeId}
                      task={task}
                      onRemove={() => removeTask(task.scopeId)}
                      backgroundTasks={backgroundTasks}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized Indicator */}
          {isMinimized && (
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {activeTasks.length > 0
                  ? `${activeTasks.length} proceso(s) en curso...`
                  : "Todos los procesos finalizados"}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onRemove,
  backgroundTasks,
}: {
  task: Task;
  onRemove: () => void;
  backgroundTasks: ReturnType<typeof useBackgroundTasks>;
}) {
  const Icon = ICON_MAP[task.type] || Terminal;

  const handleRetry = () => {
    onRemove();
    const metadata = task.metadata;
    if (!metadata) return;

    switch (task.type) {
      case "ANALYSIS":
        if (metadata.tempCvEvaluationId && metadata.temporalUserId) {
          backgroundTasks.startAnalysisTask(
            metadata.tempCvEvaluationId,
            metadata.temporalUserId,
            metadata.routeId,
          );
        }
        break;
      case "CV_PROCESSING":
        if (metadata.cvId) {
          backgroundTasks.startCvProcessingTask(metadata.cvId, metadata.routeId);
        }
        break;
      case "PROGRESS_TIMELINE":
        if (metadata.cvId) {
          backgroundTasks.startProgressTimelineTask(metadata.cvId, metadata.routeId);
        }
        break;
      case "QUICK_MATCH":
        if (metadata.cvId) {
          backgroundTasks.startQuickMatchTask(metadata.cvId, metadata.routeId);
        }
        break;
      case "ROADMAP_GENERATION":
        if (metadata.opportunityId && metadata.cvId && metadata.routeId) {
          backgroundTasks.startRoadmapTask(metadata.opportunityId, metadata.cvId, metadata.routeId);
        }
        break;
    }
  };

  const handleNavigate = () => {
    // Forzamos que el origen siempre sea el dashboard para evitar IDs inexistentes (esta página no existe)
    const finalPath = "/dashboard";
    const routeId = task.metadata?.routeId;

    backgroundTasks.navigateWithTransition(finalPath, routeId);
  };

  const handleSeeResults = () => {
    if (task.metadata?.onSuccessPath) {
      const routeId = task.metadata?.routeId;
      backgroundTasks.handleSeeResults(task.metadata.onSuccessPath, routeId);
      onRemove();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "relative p-4 rounded-2xl border transition-all duration-300",
        task.status === "IN_PROGRESS"
          ? "bg-primary/5 border-primary/20"
          : task.status === "FAILED"
            ? "bg-destructive/5 border-destructive/20"
            : "bg-secondary/20 border-transparent",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-xl",
            task.status === "SUCCEEDED"
              ? "bg-green-500/10 text-green-500"
              : task.status === "FAILED"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
          )}
        >
          {task.status === "IN_PROGRESS" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : task.status === "SUCCEEDED" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <h4 className="text-[11px] font-black uppercase italic tracking-tighter truncate">
                {task.title}
              </h4>
              {task.contextName && (
                <span className="text-[9px] font-bold text-primary/70 -mt-0.5">
                  Grupo: {task.contextName}
                </span>
              )}
            </div>
            {task.status !== "IN_PROGRESS" && (
              <button
                onClick={onRemove}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <p
              className={cn(
                "text-[10px] line-clamp-2 leading-tight font-medium",
                task.status === "FAILED" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {task.status === "FAILED" && task.error ? task.error : task.description}
            </p>
          </div>

          {task.status === "IN_PROGRESS" && (
            <div className="space-y-1 mb-2">
              <Progress value={task.progress} className="h-1 bg-primary/10" />
              <div className="flex justify-between items-center">
                <Button
                  variant="link"
                  className="h-auto p-0 text-[8px] text-muted-foreground underline decoration-primary/30"
                  onClick={handleNavigate}
                >
                  Ir al origen {task.contextName ? `(${task.contextName})` : ""}
                </Button>
                <span className="text-[9px] font-bold text-primary">
                  {Math.round(task.progress)}%
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {task.status === "SUCCEEDED" && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[10px] font-bold uppercase text-primary"
                onClick={handleSeeResults}
              >
                Ver resultados
              </Button>
            )}

            {task.status === "FAILED" && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[10px] font-bold uppercase text-destructive hover:text-destructive/80"
                onClick={handleRetry}
              >
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
