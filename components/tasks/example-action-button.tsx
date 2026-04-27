import { useTaskStore } from "@/store/use-task-store";
import { useBackgroundTasks } from "@/hooks/use-background-tasks";
import { Button } from "@/components/ui/button";

export function AnalyzeCvButton({ cvId }: { cvId: string }) {
  const { startCvProcessingTask } = useBackgroundTasks();

  // Patrón de Bloqueo Contextual (Scope-based):
  // Verificamos si existe una tarea activa para este scope (cvId)
  const isProcessing = useTaskStore((state) => state.tasks[cvId]?.status === "IN_PROGRESS");

  return (
    <Button
      disabled={isProcessing}
      onClick={() => startCvProcessingTask(cvId)}
      className="relative overflow-hidden"
    >
      {isProcessing ? (
        <>
          <span className="opacity-0">Analizar este grupo</span>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-primary/10 backdrop-blur-sm">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Procesando...</span>
          </div>
        </>
      ) : (
        "Analizar este grupo"
      )}
    </Button>
  );
}
