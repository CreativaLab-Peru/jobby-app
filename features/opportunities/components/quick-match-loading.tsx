"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Rocket } from "lucide-react";

interface QuickMatchLoadingModalProps {
  cvId: string;
}

export function QuickMatchLoading({ cvId }: QuickMatchLoadingModalProps) {
  const router = useRouter();
  const { startQuickMatchTask } = useBackgroundTasks();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!cvId || hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (typeof startQuickMatchTask === "function") {
      startQuickMatchTask(cvId);
    } else {
      console.error("startQuickMatchTask is not available in useBackgroundTasks");
    }
    router.replace("/my-opportunities");
  }, [cvId, startQuickMatchTask, router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full animate-bounce">
            <Rocket className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Sincronizando perfil. Redirigiéndote...
        </p>
      </div>
    </div>
  );
}
