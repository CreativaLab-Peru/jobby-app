"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { EvaluationCard } from "@/features/analysis/components/evaluation-card";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { Switch } from "@/components/ui/switch";
import { SelectCvModal } from "@/features/analysis/components/select-cv-modal";
import { useEvaluationModalStore } from "@/features/analysis/hooks/use-evaluation-modal-store";
import { analyzeCvById } from "@/features/analysis/actions/analyze-cv-by-id";
import {
  reAnalyzeCvByEvaluationId,
} from "@/features/analysis/actions/re-analyze-cv-by-evaluation-id";
import { useCreditsStore } from "@/store/use-credits-store";
import {
  EvaluationWithRelations,
  getEvaluationsForActiveRoute,
} from "@/features/routes/actions/get-evaluations-for-active-route";
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user";

interface MyEvaluationScreenProps {
  initialEvaluations: EvaluationWithRelations[];
  canAnalyze: boolean;
  hasMoreProp: boolean;
  totalCount: number;
  hasCv: boolean;
  cv: CvWithRelations | null;
}

export default function MyEvaluationScreen({
  initialEvaluations,
  canAnalyze,
  hasMoreProp,
  totalCount: initialTotal,
  hasCv,
  cv,
}: MyEvaluationScreenProps) {
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();
  const [justSuccessful, setJustSuccessful] = useState(true);

  const { onOpen, onClose, setIsAnalyzing, setSelectedCvId } = useEvaluationModalStore();
  const { refreshCredits } = useCreditsStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasOpenedFromAnalyzeParamRef = useRef(false);

  // Build the list of CVs for the modal (just the one from the active route)
  const cvList = cv ? [cv] : [];

  // Auto-open modal when arriving from stepper with ?analyze=true
  useEffect(() => {
    if (hasOpenedFromAnalyzeParamRef.current) return;
    if (!hasCv || !cv) return;
    if (searchParams.get("analyze") !== "true") return;

    hasOpenedFromAnalyzeParamRef.current = true;
    setSelectedCvId(cv.id);
    onOpen();

    // Clean URL query param without full reload
    router.replace("/my-evaluation", { scroll: false });
  }, [hasCv, cv, searchParams, onOpen, setSelectedCvId, router]);

  const handleFilterChange = (onlySuccess: boolean) => {
    setJustSuccessful(onlySuccess);
    startTransition(async () => {
      const result = await getEvaluationsForActiveRoute({
        skip: 0,
        take: 5,
        onlySuccessful: onlySuccess,
      });
      if (result) {
        setEvaluations(result.evaluations);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      }
    });
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getEvaluationsForActiveRoute({
        skip: evaluations.length,
        take: 5,
        onlySuccessful: justSuccessful,
      });
      if (result) {
        setEvaluations((prev) => [...prev, ...result.evaluations]);
        setHasMore(result.hasMore);
      }
    });
  };

  /** Called when the user confirms the CV in the modal */
  const handleAnalyzeConfirm = async (cvId: string) => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeCvById(cvId);
      if (response.success) {
        toast.success("Análisis iniciado");
        setTimeout(() => {
          onClose();
          router.push(`/process/${cvId}`);
          refreshCredits();
        }, 600);
      } else {
        toast.error(response.message || "Error al procesar el CV");
        setIsAnalyzing(false);
      }
    } catch {
      toast.error("Error de conexión");
      setIsAnalyzing(false);
    }
  };

  const handleReAnalyze = async (evaluationId: string) => {
    try {
      const ev = evaluations.find((e) => e.id === evaluationId);
      const response = await reAnalyzeCvByEvaluationId(evaluationId);
      if (response.success) {
        toast.success("Reanálisis iniciado");
        router.push(`/process/${ev?.cvId}`);
        refreshCredits();
      } else {
        toast.error("Error al reanalizar");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      {/* Select CV Modal */}
      <SelectCvModal
        cvs={cvList}
        onConfirm={handleAnalyzeConfirm}
      />

      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader
            title="Mi Análisis"
            description="Evaluaciones de IA del CV vinculado a tu ruta activa."
            actions={
              hasCv && (
                <Button
                  disabled={!canAnalyze}
                  onClick={onOpen}
                  size="sm"
                  className="font-bold rounded-xl"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analizar CV
                </Button>
              )
            }
          />

          {!hasCv ? (
            <EmptyPlaceholder
              icon={BarChart3}
              title="Tu ruta aún no tiene un CV"
              description="Primero vincula un CV a tu ruta para poder analizarlo."
            />
          ) : (
            <>
              {/* Filtro */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold">Solo exitosos:</span>
                  <Switch checked={justSuccessful} onCheckedChange={handleFilterChange} />
                </div>
                <span className="text-xs text-muted-foreground">{totalCount} totales</span>
              </div>

              {/* Lista */}
              <div className="relative min-h-[400px]">
                <AnimatePresence>
                  {isPending && evaluations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center"
                    >
                      <div className="bg-card p-4 rounded-2xl shadow-xl border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Sincronizando...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {evaluations.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {evaluations.map((evaluation) => (
                        <EvaluationCard
                          key={evaluation.id}
                          evaluation={evaluation}
                          onAction={() => router.push(`/evaluations/${evaluation.id}`)}
                          onRetry={handleReAnalyze}
                          isRetrying={isPending}
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
                  !isPending && (
                    <EmptyPlaceholder
                      icon={XCircle}
                      title="No hay evaluaciones"
                      description="Analiza tu CV para obtener recomendaciones de IA."
                    />
                  )
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}

