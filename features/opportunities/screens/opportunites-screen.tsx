"use client";

import {Briefcase, Rocket, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {PageHeader} from "@/components/shared/page-header";
import {AnimatePresence, motion} from "framer-motion";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";
import {useState, useTransition, useEffect} from "react";
import {getOpportunities} from "@/features/opportunities/get-opportunities";
import {LoadMoreButton} from "@/components/shared/load-more-button";
import {Button} from "@/components/ui/button";
import {QuickMatchCvModal} from "@/features/opportunities/components/quick-match-cv-modal";
import {useQuickMatchModalStore} from "@/features/opportunities/hooks/use-quick-match-modal-store";
import {CvWithRelations, getCvForCurrentUser} from "@/features/cv/actions/get-cv-for-current-user";
import {useCredits} from "@/features/credits/hooks/use-credits";
import {SearchableSelect} from "@/components/shared/searchable-select";
import {Opportunity} from ".prisma/client";

interface Props {
  initialData: (
    Opportunity & {
    match: number;
    cv: {
      id: string;
      title: string;
    }
  }
  )[];
  initialCvs: CvWithRelations[];
  hasMoreProp?: boolean;
  totalCount?: number;
  currentFilterCvId: string | null;
}

export default function OpportunitiesScreen({
                                               initialData,
                                               initialCvs,
                                               totalCount: initialTotal,
                                               hasMoreProp,
                                               currentFilterCvId
                                             }: Props) {
  const [opportunities, setOpportunities] = useState<(
    Opportunity & {
    match: number;
    cv: {
      id: string;
      title: string;
    }
  }
    )[]>(initialData);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal || 0);
  const [isPending, startTransition] = useTransition();
  const [cvs, setCvs] = useState<CvWithRelations[]>([]);
  const [isCvsLoading, setIsCvsLoading] = useState(false);
  const [filterCvId, setFilterCvId] = useState<string | null>(currentFilterCvId);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const {onOpen, setSelectedCvId} = useQuickMatchModalStore();
  const {credits} = useCredits();

  const cvOptions = initialCvs.map(cv => ({
    value: cv.id,
    label: cv.title || "CV Sin título"
  }));

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply filters when they change
  useEffect(() => {
    startTransition(async () => {
      const result = await getOpportunities({
        skip: 0,
        take: 6,
        cvId: filterCvId || undefined,
        query: debouncedSearchQuery || undefined
      });
      if (result) {
        setOpportunities(result.opportunities);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      }
    });
  }, [filterCvId, debouncedSearchQuery]);

  const handleLoadMore = () => {
    startTransition(async () => {
      const params = {
        skip: opportunities.length,
        take: 6,
        cvId: filterCvId || undefined,
        query: debouncedSearchQuery || undefined
      }
      const result = await getOpportunities(params);
      if (result) {
        setOpportunities((prev) => [...prev, ...result.opportunities]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleQuickMatchClick = async () => {
    setIsCvsLoading(true);
    try {
      const cvData = await getCvForCurrentUser(0, 1000);
      if (cvData?.cvs) {
        setCvs(cvData.cvs);
        // Pre-select the currently filtered CV if one is active
        if (filterCvId) {
          setSelectedCvId(filterCvId);
        }
        onOpen();
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
    } finally {
      setIsCvsLoading(false);
    }
  };

  const actions = (
    <Button onClick={handleQuickMatchClick} disabled={isCvsLoading}>
      <Rocket className="mr-2 h-4 w-4"/>
      {isCvsLoading ? "Cargando..." : "Hacer Match"}
    </Button>
  );

  return (
    <main className="min-h-[90-vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            className="space-y-8"
        >
          <PageHeader
              title="Oportunidades Match"
              description="Postulaciones recomendadas por IA basadas en tus CVs analizados."
              actions={actions}
          />

          {/* Filtros */}
          <div
              className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">
                  Filtrar por CV:
                </span>
                <SearchableSelect
                    items={cvOptions}
                    placeholder="Todos"
                    selectedValue={filterCvId}
                    onSelect={setFilterCvId}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Buscador minimalista */}
              <div className="relative max-w-xs group">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors"/>
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar puesto o empresa..."
                    className="pl-10 border-border/40 bg-card/50 rounded-xl focus-visible:ring-primary h-10 text-sm"
                />
              </div>

              <div className="text-xs font-medium text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
                {totalCount} {totalCount === 1 ? 'oportunidad' : 'oportunidades'}
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {/* Overlay de carga sutil */}
            <AnimatePresence>
              {isPending && opportunities.length > 0 && (
                  <motion.div
                      initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
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
                              key={`${opt.id}-${opt.cvId}`}
                              initial={{opacity: 0, scale: 0.95}}
                              animate={{opacity: 1, scale: 1}}
                              transition={{duration: 0.3, delay: (index % 10) * 0.05}}
                          >
                            <OpportunityCard opportunity={opt}/>
                          </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Load More Button */}
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
                          title={filterCvId || debouncedSearchQuery ? "Sin resultados para este filtro" : "No hay vacantes aún"}
                          description={filterCvId || debouncedSearchQuery ? "Prueba con otro término o limpia el filtro." : "Analiza un CV para que la IA pueda encontrar oportunidades que encajen con tu perfil."}
                      />
                    </div>
                )
            )}
          </div>
        </motion.div>
      </div>
      <QuickMatchCvModal cvs={cvs} credits={credits}/>
    </main>
  );
}
