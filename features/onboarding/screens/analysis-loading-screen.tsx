"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Loader2 } from "lucide-react";

interface AnalysisLoadingScreenProps {
  temporalUserId: string;
  tempCvEvaluationId: string;
}

export function AnalysisLoadingScreen({
  tempCvEvaluationId,
  temporalUserId
}: AnalysisLoadingScreenProps) {
  const router = useRouter();
  const { startAnalysisTask } = useBackgroundTasks();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    startAnalysisTask(tempCvEvaluationId, temporalUserId);
    router.replace("/dashboard");
  }, [tempCvEvaluationId, temporalUserId, startAnalysisTask, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Iniciando auditoría IA. Redirigiéndote al dashboard...
        </p>
      </div>
    </div>
  );
}
