"use client";

import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {BarChart3, Plus} from "lucide-react";
import {toast} from "sonner";
import {useState, useTransition} from "react";

import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/shared/page-header";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";
import {EvaluationCard} from "@/features/analysis/components/evaluation-card";
import {LoadMoreButton} from "@/components/shared/load-more-button";
import {SelectCvModal} from "@/features/analysis/components/select-cv-modal";
import {useEvaluationModalStore} from "@/features/analysis/hooks/use-evaluation-modal-store";
import {
  EvaluationWithRelations,
  geEvaluationsForCurrentUser
} from "@/features/cv/actions/get-evaluations-for-current-user";

export type ScoresListPageProps = {
  initialCvs: EvaluationWithRelations[];
  canAnalyze: boolean;
  totalCount: number;
  hasMoreProp: boolean;
}

export function ScoresListPage({
                                 initialCvs,
                                 canAnalyze,
                                 totalCount,
                                 hasMoreProp
}: ScoresListPageProps) {
  const [evaluations, setEvaluations] = useState(initialCvs);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [isPending, startTransition] = useTransition();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const {onOpen, onClose, selectedCvId, setIsAnalyzing} = useEvaluationModalStore();
  const router = useRouter();

  // Función maestra de análisis
  const handleAnalyze = async (id: string) => {
    const isRetry = id !== selectedCvId;
    if (isRetry) setRetryingId(id);
    else setIsAnalyzing(true);

    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cvId: id}),
      });

      if (response.ok) {
        toast.success(isRetry ? 'Re-análisis iniciado' : 'Análisis iniciado con éxito');
        onClose();
        router.push(`/process/${id}`);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al procesar el CV");
      }
    } catch (error: any) {
      toast.error("Error de conexión al iniciar el análisis");
    } finally {
      setRetryingId(null);
      setIsAnalyzing(false);
    }
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await geEvaluationsForCurrentUser(evaluations.length, 5);
      if (result) {
        setEvaluations((prev: any) => [...prev, ...result.evaluations]);
        setHasMore(result.hasMore);
      }
    });
  };

  const actions = (
    <div className="flex gap-2">
      <Button variant="outline" disabled={!canAnalyze} size="sm" onClick={() => router.push("/cv")}
              className="font-bold">
        <Plus className="w-4 h-4 mr-2"/> Nueva Evaluación
      </Button>
      <Button variant="default" disabled={!canAnalyze || evaluations.length === 0} onClick={onOpen}
              size="sm" className="font-bold">
        <BarChart3 className="w-4 h-4 mr-2"/> Seleccionar CV
      </Button>
    </div>
  );

  return (
    <main className="min-h-[90-vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                    className="space-y-10">
          <PageHeader
            title="Evaluaciones de IA"
            description="Gestiona tus análisis y optimiza tu perfil profesional."
            actions={actions}
          />

          {evaluations.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {evaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.id}
                    evaluation={evaluation} // El CV viene dentro de la evaluación ahora
                    onAction={() => router.push(`/evaluations/${evaluation.id}`)}
                  />
                ))}
              </AnimatePresence>

              <LoadMoreButton
                handleLoadMore={handleLoadMore}
                hasMore={hasMore}
                isPending={isPending}
                currentCount={evaluations.length}
                totalCount={totalCount}
              />
            </div>
          ) : (
            <EmptyPlaceholder
              icon={BarChart3}
              title="No hay evaluaciones"
              description="Analiza tu primer CV para obtener insights."
              action={actions}
            />
          )}
        </motion.div>
      </div>

      <SelectCvModal cvs={evaluations} onConfirm={() => selectedCvId && handleAnalyze(selectedCvId)}/>
    </main>
  );
}
