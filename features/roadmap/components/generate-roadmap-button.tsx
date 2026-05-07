"use client";

import { useState, useCallback } from "react";
import { Map, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { useTaskStore } from "@/store/use-task-store";
import { cn } from "@/lib/utils";

interface GenerateRoadmapButtonProps {
  opportunityId: string;
  cvId: string;
  routeId?: string | null;
  existingStatus: string | null;
  onGenerated: (roadmapId: string) => void;
  canGenerate?: boolean;
  blockedMessage?: string | null;
  onClose?: () => void;
}

export function GenerateRoadmapButton({
  opportunityId,
  cvId,
  routeId = null,
  canGenerate = true,
  blockedMessage = null,
  onGenerated,
  onClose,
}: GenerateRoadmapButtonProps) {
  const { startRoadmapTask } = useBackgroundTasks();
  const router = useRouter();
  // Lookup por Scope ID (opportunityId)
  const task = useTaskStore((state) => state.tasks[opportunityId]);
  const [isLocalTriggering, setIsLocalTriggering] = useState(false);

  const isProcessing = task?.status === "IN_PROGRESS";

  const handleGenerate = useCallback(async () => {
    if (!routeId) return;
    setIsLocalTriggering(true);
    await startRoadmapTask(opportunityId, cvId, routeId);
    setIsLocalTriggering(false);
    
    toast.success("¡Diseñando roadmap!");
    if (onClose) onClose();
    router.push("/dashboard");
  }, [opportunityId, cvId, routeId, startRoadmapTask, router, onClose]);

  if (task?.status === "SUCCEEDED") {
    return null;
  }

  if (!canGenerate) {
    return (
      <div className="space-y-2">
        <Button disabled size="sm" variant="outline" className="rounded-xl font-bold text-xs">
          <Map className="w-3.5 h-3.5 mr-2" />
          Roadmap bloqueado
        </Button>
        {blockedMessage && (
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">{blockedMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerate}
        disabled={isProcessing || isLocalTriggering}
        size="sm"
        variant={task?.status === "FAILED" ? "destructive" : "default"}
        className={cn(
          "rounded-xl font-bold text-xs transition-all duration-300",
          isProcessing && "bg-primary/20 text-primary border-primary/20",
        )}
      >
        {isProcessing || isLocalTriggering ? (
          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
        ) : task?.status === "FAILED" ? (
          <RefreshCcw className="w-3.5 h-3.5 mr-2" />
        ) : (
          <Map className="w-3.5 h-3.5 mr-2" />
        )}
        {isProcessing
          ? `Diseñando Roadmap (${task.progress}%)`
          : task?.status === "FAILED"
            ? "Reintentar Roadmap"
            : "Generar Roadmap con IA"}
      </Button>

      {isProcessing && (
        <p className="text-[10px] text-muted-foreground italic animate-pulse">
          El proceso continúa en segundo plano. Puedes seguir explorando.
        </p>
      )}
    </div>
  );
}
