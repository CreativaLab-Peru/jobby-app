"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { FileText } from "lucide-react";

interface CvProcessingScreenProps {
  cvId: string;
}

export function CvProcessingScreen({ cvId }: CvProcessingScreenProps) {
  const router = useRouter();
  const { startCvProcessingTask } = useBackgroundTasks();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!cvId || hasStartedRef.current) return;
    hasStartedRef.current = true;

    startCvProcessingTask(cvId);
    router.replace("/cv");
  }, [cvId, startCvProcessingTask, router]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full animate-pulse">
            <FileText className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Procesando CV en segundo plano. Volviendo al panel...
        </p>
      </div>
    </div>
  );
}
