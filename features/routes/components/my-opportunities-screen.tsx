"use client";

import { Briefcase, Rocket, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatePresence, motion } from "framer-motion";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { Button } from "@/components/ui/button";
import { QuickMatchCvModal } from "@/features/opportunities/components/quick-match-cv-modal";
import { useQuickMatchModalStore } from "@/features/opportunities/hooks/use-quick-match-modal-store";
import {
  RouteOpportunity,
  getOpportunitiesForActiveRoute,
} from "@/features/routes/actions/get-opportunities-for-active-route";
import { getAllCvForCurrentUser } from "@/features/cv/actions/get-all-cv-for-current-user";
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user";
import { useCreditsStore } from "@/store/use-credits-store";

interface MyOpportunitiesScreenProps {
  initialData: RouteOpportunity[];
  hasMoreProp: boolean;
  totalCount: number;
  hasCv: boolean;
  cvId: string | null;
  hasSubscription: boolean;
  planNames: { starter: string; pro: string };
  hasMatchedOnce: boolean;
  isMatchingInProgress: boolean;
}

export default function MyOpportunitiesScreen({
  initialData,
  hasMoreProp,
  totalCount: initialTotal,
  hasCv,
  cvId,
  hasSubscription,
  planNames,
  hasMatchedOnce: hasMatchedOnceProp,
  isMatchingInProgress: isMatchingInProgressProp,
}: MyOpportunitiesScreenProps) {
  const [opportunities, setOpportunities] = useState<RouteOpportunity[]>(initialData);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [cvs, setCvs] = useState<CvWithRelations[]>([]);
  const [isCvsLoading, setIsCvsLoading] = useState(false);
  const [hasMatchedInRoute, setHasMatchedInRoute] = useState(hasMatchedOnceProp);
  const [isMatchProcessing, setIsMatchProcessing] = useState(isMatchingInProgressProp);

  const { onOpen, setSelectedCvId } = useQuickMatchModalStore();
  const { credits } = useCreditsStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasOpenedFromMatchParamRef = useRef(false);
  const matchParam = searchParams.get("match");

  const isQuickMatchBlocked = hasMatchedInRoute || isMatchProcessing;
  const isQuickMatchDisabled = isCvsLoading || isQuickMatchBlocked;
  const quickMatchLabel = isCvsLoading
    ? "Cargando..."
    : isMatchProcessing
      ? "Procesando..."
      : hasMatchedInRoute
        ? "Match realizado"
        : "Hacer Match";

  // Auto-abrir modal si se navega con ?match=true
  useEffect(() => {
    if (hasOpenedFromMatchParamRef.current) return;
    if (!hasCv || !cvId) return;
    if (matchParam !== "true") return;

    if (isQuickMatchBlocked) {
      hasOpenedFromMatchParamRef.current = true;
      router.replace("/my-opportunities", { scroll: false });
      return;
    }

    hasOpenedFromMatchParamRef.current = true;

    // Limpiar el query param de la URL sin recargar
    router.replace("/my-opportunities", { scroll: false });

    (async () => {
      try {
        const cvData = await getAllCvForCurrentUser(0, 100);
        if (cvData?.cvs) {
          const routeCv = cvData.cvs.filter((cv) => cv.id === cvId);
          setCvs(routeCv);
          setSelectedCvId(cvId);
          onOpen();
        }
      } catch (error) {
        console.error("Error al cargar CVs:", error);
      }
    })();
  }, [hasCv, cvId, matchParam, router, onOpen, setSelectedCvId, isQuickMatchBlocked]);

  useEffect(() => {
    if (matchParam !== "processing") return;
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
        setHasMatchedInRoute(result.hasMatchedOnce);
        setIsMatchProcessing(result.isMatchingInProgress);
      }
    });
    router.replace("/my-opportunities", { scroll: false });
  }, [matchParam, hasCv, debouncedQuery, router]);


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
        setHasMatchedInRoute(result.hasMatchedOnce);
        setIsMatchProcessing(result.isMatchingInProgress);
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
        setHasMatchedInRoute(result.hasMatchedOnce);
        setIsMatchProcessing(result.isMatchingInProgress);
      }
    });
  };

  const handleQuickMatch = async () => {
    if (!cvId || isQuickMatchBlocked) return;
    setIsCvsLoading(true);
    try {
      const cvData = await getAllCvForCurrentUser(0, 100);
      if (cvData?.cvs) {
        const routeCv = cvData.cvs.filter((cv) => cv.id === cvId);
        setCvs(routeCv);
        setSelectedCvId(cvId);
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Oportunidades de mi Ruta"
            description="Vacantes recomendadas por IA para el CV de tu ruta activa."
            actions={
              hasCv && (
                <Button onClick={handleQuickMatch} disabled={isQuickMatchDisabled}>
                  <Rocket className="mr-2 h-4 w-4" />
                  {quickMatchLabel}
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
              {/*<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card/50">*/}
              {/*  <div className="relative max-w-xs w-full group">*/}
              {/*    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />*/}
              {/*    <Input*/}
              {/*      value={searchQuery}*/}
              {/*      onChange={(e) => setSearchQuery(e.target.value)}*/}
              {/*      placeholder="Buscar puesto o empresa..."*/}
              {/*      className="pl-10 border-border/40 bg-card/50 rounded-xl h-10 text-sm"*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*  <span className="text-xs text-muted-foreground">*/}
              {/*    {totalCount} {totalCount === 1 ? "oportunidad" : "oportunidades"}*/}
              {/*  </span>*/}
              {/*</div>*/}

              {/* Lista */}
              <div className="relative min-h-[400px]">
                <AnimatePresence>
                  {isPending && opportunities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center pt-20"
                    >
                      <div className="bg-card p-4 rounded-2xl shadow-xl border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
                          Sincronizando...
                        </p>
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
                            <div className="relative">
                              <div
                                className={
                                  opt.isLocked
                                    ? "filter blur-sm grayscale-[40%] pointer-events-none select-none"
                                    : ""
                                }
                              >
                                <OpportunityCard opportunity={opt} />
                              </div>

                              {opt.isLocked && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                  <div className="max-w-[280px] w-full mx-4 text-center p-6 rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-xl pointer-events-auto">
                                    <p className="font-bold text-foreground mb-1 text-sm">Contenido bloqueado</p>
                                    <p className="text-[10px] text-muted-foreground mb-4 leading-tight">
                                      Actualiza a {planNames.starter} o {planNames.pro} para ver los detalles.
                                    </p>
                                    <div className="flex justify-center">
                                      <Button size="sm" className="h-8 text-[10px] px-4 rounded-xl" onClick={() => router.push("/credits")}>
                                        Ver planes
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
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
