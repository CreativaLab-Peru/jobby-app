"use client";

import { useState, useTransition } from "react";
import { Mic2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import InterviewCard from "../components/interview-card"; // Lo crearemos luego
import {getInterviews, InterviewWithRelations} from "../actions/get-interviews";
import {useVapi} from "@/features/interview-simulator/hooks/use-vapi";
import {NewInterviewModal} from "@/features/interview-simulator/components/new-interview-modal";
import {OpportunityWithCV} from "@/features/opportunities/get-opportunities";

interface Props {
  initialData: InterviewWithRelations[];
  initialTotal: number;
  initialHasMore: boolean;
  opportunities: OpportunityWithCV[];
}

export default function InterviewsScreen({
                                           initialData,
                                           initialTotal,
                                           initialHasMore,
                                           opportunities
                                         }: Props) {
  const [interviews, setInterviews] = useState(initialData);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [filterOppId, setFilterOppId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startCall, isConnecting } = useVapi();

  const oppOptions = opportunities.map(opt => ({
    value: opt.id,
    label: `${opt.company} - ${opt.title}`
  }));

  const handleFilterChange = (id: string | null) => {
    setFilterOppId(id);
    startTransition(async () => {
      const result = await getInterviews({ skip: 0, take: 6, opportunityId: id || undefined });
      if (result) {
        setInterviews(result.interviews);
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getInterviews({
        skip: interviews.length,
        take: 6,
        opportunityId: filterOppId || undefined
      });
      if (result) {
        setInterviews(prev => [...prev, ...result.interviews]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleStartInterview = async (opp: any) => {
    setIsModalOpen(false); // Cerramos el modal
    await startCall(opp.id, opp.cvId); // El hook maneja el estado isConnected y abre el audio
  };

  const actions = (
    <Button onClick={() => setIsModalOpen(true)} disabled={isConnecting}>
      <Plus className="mr-2 h-4 w-4" /> Nueva Simulación
    </Button>
  );

  return (
    <>
      <main className="min-h-[90vh] p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <PageHeader
              title="Simulaciones de Entrevista"
              description="Entrena con IA basándote en tus vacantes y mejora tus métricas de respuesta."
              actions={actions}
            />

            {/* Barra de Filtros (Consistencia con Opportunities) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">Filtrar por Vacante:</span>
                <SearchableSelect
                  items={oppOptions}
                  placeholder="Todas las vacantes"
                  selectedValue={filterOppId}
                  onSelect={handleFilterChange}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
                {totalCount} simulaciones realizadas
              </div>
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence>
                {isPending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="bg-card p-4 rounded-2xl shadow-xl border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Cargando historial...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {interviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews.map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (index % 6) * 0.05 }}
                      >
                        <InterviewCard session={interview} />
                      </motion.div>
                    ))}
                  </div>
                  <LoadMoreButton
                    handleLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    isPending={isPending}
                    currentCount={interviews.length}
                    totalCount={totalCount}
                  />
                </>
              ) : (
                !isPending && (
                  <EmptyPlaceholder
                    icon={Mic2}
                    title="Aún no hay simulaciones"
                    description="Selecciona una oportunidad match y empieza a practicar con nuestra IA."
                  />
                )
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <NewInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opportunities={opportunities}
        onStart={handleStartInterview}
        isConnecting={isConnecting}
      />
    </>
  );
}
