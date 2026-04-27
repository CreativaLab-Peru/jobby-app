"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Sparkles } from "lucide-react"

interface ProgressStatusProps {
  cvId: string
}

export default function ProgressTimeline({ cvId }: ProgressStatusProps) {
  const router = useRouter();
  const { startProgressTimelineTask } = useBackgroundTasks();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!cvId || hasStartedRef.current) return;
    hasStartedRef.current = true;

    startProgressTimelineTask(cvId);
    router.replace("/dashboard");
  }, [cvId, startProgressTimelineTask, router]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Analizando tu potencial. Redirigiéndote...
            </p>
        </div>
    </div>
  );
}
