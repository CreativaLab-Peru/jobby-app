"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BarChart3, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useTransition, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { EvaluationCard } from "@/features/analysis/components/evaluation-card";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { SelectCvModal } from "@/features/analysis/components/select-cv-modal";
import { useEvaluationModalStore } from "@/features/analysis/hooks/use-evaluation-modal-store";
import {
  EvaluationWithRelations,
  geEvaluationsForCurrentUser
} from "@/features/cv/actions/get-evaluations-for-current-user";
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user";
import { SearchableSelect } from "@/components/shared/searchable-select";

export type ScoresListPageProps = {
  initialEvaluations: EvaluationWithRelations[];
  initialCvs: CvWithRelations[];
  canAnalyze: boolean;
  totalCount: number;
  hasMoreProp: boolean;
}

export function ScoresListPage({
                                 initialEvaluations,
                                 initialCvs,
                                 canAnalyze,
                                 totalCount: initialTotal,
                                 hasMoreProp
                               }: ScoresListPageProps) {
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();
  const [filterCvId, setFilterCvId] = useState<string | null>(null);

  const { onOpen, onClose, selectedCvId, setIsAnalyzing } = useEvaluationModalStore();
  const router = useRouter();

  const cvOptions = initialCvs.map(cv => ({
    value: cv.id,
    label: cv.title || "CV Sin título"
  }));

  useEffect(() => {
    if (filterCvId === null && evaluations === initialEvaluations) return;

    const fetchFilteredData = () => {
      startTransition(async () => {
        const result = await geEvaluationsForCurrentUser({
          skip: 0,
          take: 5,
          cvId: filterCvId || undefined
        });

        if (result) {
          setEvaluations(result.evaluations);
          setHasMore(result.hasMore);
          setTotalCount(result.totalCount);
        }
      });
    };

    fetchFilteredData();
  }, [filterCvId]);

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await geEvaluationsForCurrentUser({
        skip: evaluations.length,
        take: 5,
        cvId: filterCvId || undefined
      });
      if (result) {
        setEvaluations((prev) => [...prev, ...result.evaluations]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleAnalyze = async (id: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId: id }),
      });

      if (response.ok) {
        toast.success('Análisis iniciado');
        onClose();
        router.push(`/process/${id}`);
      } else {
        toast.error("Error al procesar el CV");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <PageHeader
            title="Evaluaciones de IA"
            description="Gestiona tus análisis y optimiza tu perfil profesional."
            actions={
              <Button disabled={!canAnalyze} onClick={onOpen} size="sm" className="font-bold rounded-xl">
                <BarChart3 className="w-4 h-4 mr-2" /> Analizar CV
              </Button>
            }
          />

          {/* Barra de Filtros con Feedback de Carga */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/*<div className="p-2 bg-secondary rounded-lg">*/}
              {/*  <Search className="w-4 h-4 text-primary" />*/}
              {/*</div>*/}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-black">
                  Filtra por Cv:
                </span>
                <SearchableSelect
                  items={cvOptions}
                  placeholder="Todos"
                  selectedValue={filterCvId}
                  onSelect={setFilterCvId}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isPending && (
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce" />
                </div>
              )}
              <div className="text-xs px-3 py-1">
                {totalCount} totales
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {/* Overlay de carga sutil */}
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
                  title={filterCvId ? "Sin resultados para este filtro" : "No hay evaluaciones"}
                  description="Intenta con otro documento o realiza un nuevo análisis."
                />
              )
            )}
          </div>
        </motion.div>
      </div>

      <SelectCvModal cvs={initialCvs} onConfirm={() => selectedCvId && handleAnalyze(selectedCvId)} />
    </main>
  );
}
