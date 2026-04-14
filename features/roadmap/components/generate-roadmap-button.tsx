"use client";

import { useState, useEffect, useCallback } from "react";
import { Map, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getRoadmapStatus } from "@/features/roadmap/actions/get-roadmap-status";
import { useRouteStore } from "@/store/use-route-store";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { generateRoadmapAction } from "@/features/roadmap/actions/generate-roadmap";

interface GenerateRoadmapButtonProps {
  opportunityId: string;
  cvId: string;
  routeId?: string | null;
  existingStatus: string | null;
  onGenerated: (roadmapId: string) => void;
  canGenerate?: boolean;
  blockedMessage?: string | null;
}

export function GenerateRoadmapButton({
  opportunityId,
  cvId,
  routeId = null,
  existingStatus,
  onGenerated,
  canGenerate = true,
  blockedMessage = null,
}: GenerateRoadmapButtonProps) {
  const [status, setStatus] = useState(existingStatus);
  const [isTriggering, setIsTriggering] = useState(false);

  const isProcessing = status === "PENDING" || status === "IN_PROGRESS";
  const showFullscreenLoading = isTriggering || isProcessing;

  const { hydrate } = useRouteStore();

  // Poll while processing
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(async () => {
      const result = await getRoadmapStatus(opportunityId, cvId, routeId);
      setStatus(result.status);

      if (result.status === "SUCCEEDED") {
        clearInterval(interval);

        const routesResult = await getRoutesForUser();
        if (!routesResult.success) {
          toast.error(
            routesResult.message || "Roadmap generado, pero no se pudieron cargar las rutas.",
          );
          return;
        }
        hydrate(routesResult.routes);

        toast.success("¡Roadmap generado!");
        onGenerated(result.roadmapId || "");
      } else if (result.status === "FAILED") {
        clearInterval(interval);
        toast.error("Error al generar el roadmap. Intenta de nuevo.");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing, opportunityId, cvId, onGenerated, routeId, hydrate]);

  const handleGenerate = useCallback(async () => {
    if (!routeId) {
      toast.error("No se pudo identificar la ruta activa para generar el roadmap.");
      return;
    }

    setIsTriggering(true);
    try {
      const result = await generateRoadmapAction({ opportunityId, cvId, routeId });

      if (!result.success) {
        toast.error(result.message || "Error al iniciar el roadmap.");
        return;
      }

      if (result.status === 200) {
        // Already exists
        onGenerated(result.data?.roadmapId || "");
        return;
      }

      if (result.status === 202) {
        setStatus("IN_PROGRESS");
        toast.info(result.message || "Generando roadmap con IA...");
        return;
      }

      setStatus("IN_PROGRESS");
      toast.info("Generando roadmap con IA...");
    } catch {
      toast.error("Error de conexión.");
    } finally {
      setIsTriggering(false);
    }
  }, [opportunityId, cvId, routeId, onGenerated]);

  if (status === "SUCCEEDED") {
    return null;
  }

  const loadingOverlay = showFullscreenLoading ? (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-black tracking-tight">Generando tu roadmap</p>
          <p className="text-sm text-muted-foreground">
            Estamos construyendo tu plan personalizado. Esto puede tardar unos segundos.
          </p>
        </div>
      </div>
    </div>
  ) : null;

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

  if (isProcessing) {
    return (
      <>
        <Button disabled size="sm" variant="outline" className="rounded-xl font-bold text-xs">
          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
          Generando roadmap...
        </Button>
        {loadingOverlay}
      </>
    );
  }

  if (status === "FAILED") {
    return (
      <>
        <Button
          onClick={handleGenerate}
          disabled={isTriggering}
          size="sm"
          variant="destructive"
          className="rounded-xl font-bold text-xs"
        >
          {isTriggering ? (
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
          )}
          Reintentar roadmap
        </Button>
        {loadingOverlay}
      </>
    );
  }

  return (
    <>
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
      {loadingOverlay}
    </>
  );
}
