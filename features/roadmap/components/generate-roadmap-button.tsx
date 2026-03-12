"use client";

import { useState, useEffect, useCallback } from "react";
import { Map, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getRoadmapStatus } from "@/features/roadmap/actions/get-roadmap-status";

interface GenerateRoadmapButtonProps {
  opportunityId: string;
  cvId: string;
  existingStatus: string | null;
  onGenerated: () => void;
}

export function GenerateRoadmapButton({
  opportunityId,
  cvId,
  existingStatus,
  onGenerated,
}: GenerateRoadmapButtonProps) {
  const [status, setStatus] = useState(existingStatus);
  const [isTriggering, setIsTriggering] = useState(false);

  const isProcessing = status === "PENDING" || status === "IN_PROGRESS";

  // Poll while processing
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(async () => {
      const result = await getRoadmapStatus(opportunityId, cvId);
      setStatus(result.status);

      if (result.status === "SUCCEEDED") {
        clearInterval(interval);
        toast.success("¡Roadmap generado!");
        onGenerated();
      } else if (result.status === "FAILED") {
        clearInterval(interval);
        toast.error("Error al generar el roadmap. Intenta de nuevo.");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing, opportunityId, cvId, onGenerated]);

  const handleGenerate = useCallback(async () => {
    setIsTriggering(true);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId, cvId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al iniciar el roadmap.");
        return;
      }

      if (res.status === 200) {
        // Already exists
        onGenerated();
        return;
      }

      setStatus("IN_PROGRESS");
      toast.info("Generando roadmap con IA...");
    } catch {
      toast.error("Error de conexión.");
    } finally {
      setIsTriggering(false);
    }
  }, [opportunityId, cvId, onGenerated]);

  if (isProcessing) {
    return (
      <Button disabled size="sm" variant="outline" className="rounded-xl font-bold text-xs">
        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
        Generando roadmap...
      </Button>
    );
  }

  if (status === "FAILED") {
    return (
      <Button
        onClick={handleGenerate}
        disabled={isTriggering}
        size="sm"
        variant="destructive"
        className="rounded-xl font-bold text-xs"
      >
        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
        Reintentar roadmap
      </Button>
    );
  }

  // No roadmap yet or needs generation
  if (!status || status !== "SUCCEEDED") {
    return (
      <Button
        onClick={handleGenerate}
        disabled={isTriggering}
        size="sm"
        className="rounded-xl font-bold text-xs"
      >
        {isTriggering ? (
          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
        ) : (
          <Map className="w-3.5 h-3.5 mr-2" />
        )}
        Generar Roadmap con IA
      </Button>
    );
  }

  return null;
}

