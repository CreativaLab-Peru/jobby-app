"use client";

import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {
  BarChart3, Plus,
} from "lucide-react";

import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/shared/page-header";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";
import {CvWithRelations} from "@/features/cv/actions/get-cv-for-current-user";
import {toast} from "sonner";
import {EvaluationCard} from "@/features/analysis/components/evaluation-card";
import {useState, useTransition} from "react";
import {geEvaluationsForCurrentUser} from "@/features/cv/actions/get-evaluations-for-current-user";
import {LoadMoreButton} from "@/components/shared/load-more-button";
import {SelectCvModal} from "@/features/analysis/components/select-cv-modal";
import {useEvaluationModalStore} from "@/features/analysis/hooks/use-evaluation-modal-store";

interface ScoresListPageProps {
  initialCvs: CvWithRelations[];
  canAnalyze?: boolean;
  hasMoreProp?: boolean;
  totalCount?: number;
}

export function ScoresListPage({
                                 initialCvs,
                                 canAnalyze,
                                 totalCount,
                                 hasMoreProp
                               }: ScoresListPageProps) {

  const [cvs, setCvs] = useState<CvWithRelations[]>(initialCvs);
  const [hasMore, setHasMore] = useState(hasMoreProp); // Asumiendo batch inicial de 10
  const [isPending, startTransition] = useTransition();

  // Modal status
  const {onOpen, onClose, selectedCvId, setIsAnalyzing} = useEvaluationModalStore();

  const router = useRouter();

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await geEvaluationsForCurrentUser(cvs.length, 10);
      if (result) {
        setCvs((prev) => [...prev, ...result.cvs]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleSelectCV = async () => {
    if (!selectedCvId) return;
    // Iniciar el análisis (sea nuevo o re-análisis)
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cvId: selectedCvId}),
      });

      if (response.ok) {
        // Navegar a la página de progreso del análisis
        router.push(`/process/${selectedCvId}`);
        toast.success('Análisis iniciado con éxito');
        onClose();
      } else {
        const error = await response.json();
        console.error("Error starting analysis:", error);
        toast.error(error.message || "Error al iniciar el análisis del CV");
      }

    } catch (error) {
      console.error("[ERROR_ANALYZE_CV_ON_MODAL]:", error);
      toast.error(error.message || "Error al iniciar el análisis del CV");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const actions = (
    <>
      <Button
        variant="default"
        disabled={canAnalyze}
        size={'sm'}
        onClick={() => router.push("/cv")}
      >
        <Plus className="w-4 h-4 mr-2"/>
        Nueva Evaluación
      </Button>
      <Button
        disabled={canAnalyze || cvs.length === 0}
        onClick={() => onOpen()}
        variant='secondary'
        size={'sm'}
      >
        <Plus className="w-4 h-4 mr-2"/>
        Seleccionar CV
      </Button>
    </>
  );

  return (
    <main className="min-h-[90-vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                    className="space-y-8">
          <PageHeader
            title="Evaluaciones de IA"
            description="Analiza el rendimiento y recibe recomendaciones para optimizar tus CVs."
            actions={actions}
          />
          {cvs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence mode="popLayout">
                  {cvs.map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{opacity: 0, scale: 0.95}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{duration: 0.3, delay: (index % 10) * 0.05}}
                    >
                      <EvaluationCard
                        cv={cv}
                        onAction={(id) => router.push(`/evaluations/${id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              <LoadMoreButton
                handleLoadMore={handleLoadMore}
                hasMore={hasMore}
                isPending={isPending}
                currentCount={cvs.length}
                totalCount={totalCount}
                label="Mostrar más evaluaciones" // Opcional, por defecto es "Mostrar más"
              />
            </>
          ) : (
            <div
              className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={BarChart3}
                title="No hay evaluaciones aún"
                description="Crea tu primera evaluación para recibir insights personalizados sobre tus CVs."
                action={actions}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/*  Modal para seleccionar CV existente */}
      <SelectCvModal
        cvs={cvs}
        onConfirm={handleSelectCV}
      />
    </main>
  );
}
