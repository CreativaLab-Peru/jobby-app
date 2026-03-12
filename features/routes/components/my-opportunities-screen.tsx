"use client";

import { Briefcase, Rocket, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatePresence, motion } from "framer-motion";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { useState, useTransition, useEffect } from "react";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { Button } from "@/components/ui/button";
import { QuickMatchCvModal } from "@/features/opportunities/components/quick-match-cv-modal";
import { useQuickMatchModalStore } from "@/features/opportunities/hooks/use-quick-match-modal-store";
import { useCredits } from "@/features/credits/hooks/use-credits";
import {
  RouteOpportunity,
  getOpportunitiesForActiveRoute,
} from "@/features/routes/actions/get-opportunities-for-active-route";
import { getAllCvForCurrentUser } from "@/features/cv/actions/get-all-cv-for-current-user";
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user";

interface MyOpportunitiesScreenProps {
  initialData: RouteOpportunity[];
  hasMoreProp: boolean;
  totalCount: number;
  hasCv: boolean;
  cvId: string | null;
}

export default function MyOpportunitiesScreen({
  initialData,
  hasMoreProp,
  totalCount: initialTotal,
  hasCv,
  cvId,
}: MyOpportunitiesScreenProps) {
  const [opportunities, setOpportunities] = useState<RouteOpportunity[]>(initialData);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [cvs, setCvs] = useState<CvWithRelations[]>([]);
  const [isCvsLoading, setIsCvsLoading] = useState(false);

  const { onOpen, setSelectedCvId } = useQuickMatchModalStore();
  const { credits } = useCredits();

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Refetch on search change
  useEffect(() => {
    if (!hasCv) return;
    startTransition(async () => {
      const result = await getOpportunitiesForActiveRoute({
        skip: 0,
        take: 6,
        query: debouncedQuery || undefined,
      });
      if (result) {
        setOpportunities(result.opportunities);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      }
    });
  }, [debouncedQuery, hasCv]);

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getOpportunitiesForActiveRoute({
        skip: opportunities.length,
        take: 6,
        query: debouncedQuery || undefined,
      });
      if (result) {
        setOpportunities((prev) => [...prev, ...result.opportunities]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleQuickMatch = async () => {
    setIsCvsLoading(true);
    try {
      const cvData = await getAllCvForCurrentUser(0, 100);
      console.log("[cvData]", cvData)
      if (cvData?.cvs) {
        setCvs(cvData.cvs);
        if (cvId) setSelectedCvId(cvId);
        onOpen();
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
    } finally {
      setIsCvsLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader
            title="Oportunidades de mi Ruta"
            description="Vacantes recomendadas por IA para el CV de tu ruta activa."
            actions={
              hasCv && (
                <Button onClick={handleQuickMatch} disabled={isCvsLoading}>
                  <Rocket className="mr-2 h-4 w-4" />
                  {isCvsLoading ? "Cargando..." : "Hacer Match"}
                </Button>
              )
            }
          />

          {!hasCv ? (
            <EmptyPlaceholder
              icon={Briefcase}
              title="Tu ruta aún no tiene un CV"
              description="Primero vincula un CV a tu ruta para buscar oportunidades."
            />
          ) : (
            <>
              {/* Barra de filtros */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card/50">
                <div className="relative max-w-xs w-full group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar puesto o empresa..."
                    className="pl-10 border-border/40 bg-card/50 rounded-xl h-10 text-sm"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {totalCount} {totalCount === 1 ? "oportunidad" : "oportunidades"}
                </span>
              </div>

              {/* Lista */}
              <div className="relative min-h-[400px]">
                <AnimatePresence>
                  {isPending && opportunities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center pt-20"
                    >
                      <div className="bg-card p-4 rounded-2xl shadow-xl border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Sincronizando...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {opportunities.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                      <AnimatePresence mode="popLayout">
                        {opportunities.map((opt, index) => (
                          <motion.div
                            key={opt.id + opt.cvId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                          >
                            <OpportunityCard opportunity={opt} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <LoadMoreButton
                      handleLoadMore={handleLoadMore}
                      hasMore={hasMore}
                      isPending={isPending}
                      currentCount={opportunities.length}
                      totalCount={totalCount}
                      label="Mostrar más oportunidades"
                    />
                  </>
                ) : (
                  !isPending && (
                    <div className="rounded-[2rem] border border-dashed border-border/60 bg-secondary/5 py-20">
                      <EmptyPlaceholder
                        icon={Briefcase}
                        title={debouncedQuery ? "Sin resultados" : "No hay vacantes aún"}
                        description={
                          debouncedQuery
                            ? "Prueba con otro término."
                            : "Analiza tu CV para que la IA encuentre oportunidades."
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
      <QuickMatchCvModal cvs={cvs} credits={credits} />
    </main>
  );
}

