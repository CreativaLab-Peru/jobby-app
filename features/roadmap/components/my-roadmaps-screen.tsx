"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { RoadmapCard } from "@/features/roadmap/components/roadmap-card";
import { Button } from "@/components/ui/button";
import {
  RoadmapListItem,
  getRoadmapsForUser,
} from "@/features/roadmap/actions/get-roadmaps-for-user";
import {
  RouteOpportunity,
  getOpportunitiesForActiveRoute,
} from "@/features/routes/actions/get-opportunities-for-active-route";
import { SelectOpportunityRoadmapModal } from "@/features/roadmap/components/select-opportunity-roadmap-modal";

interface MyRoadmapsScreenProps {
  initialData: RoadmapListItem[];
  hasMoreProp: boolean;
  totalCount: number;
  initialOpportunities: RouteOpportunity[];
  hasCv: boolean;
  planTier: "FREE" | "STARTER" | "PRO";
}

export default function MyRoadmapsScreen({
  initialData,
  hasMoreProp,
  totalCount: initialTotal,
  initialOpportunities,
  hasCv,
  planTier,
}: MyRoadmapsScreenProps) {
  const [roadmaps, setRoadmaps] = useState(initialData);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [generatedRoadmapsCount, setGeneratedRoadmapsCount] = useState(initialTotal);
  const [opportunities, setOpportunities] = useState<RouteOpportunity[]>(initialOpportunities);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    startTransition(async () => {
      const result = await getRoadmapsForUser({
        skip: 0,
        take: 10,
        query: debouncedQuery || undefined,
      });
      if (result) {
        setRoadmaps(result.roadmaps);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
      }
    });
  }, [debouncedQuery]);

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getRoadmapsForUser({
        skip: roadmaps.length,
        take: 10,
        query: debouncedQuery || undefined,
      });
      if (result) {
        setRoadmaps((prev) => [...prev, ...result.roadmaps]);
        setHasMore(result.hasMore);
      }
    });
  };

  const handleRoadmapGenerated = () => {
    startTransition(async () => {
      const [roadmapsResult, opportunitiesResult, countResult] = await Promise.all([
        getRoadmapsForUser({ skip: 0, take: 10, query: debouncedQuery || undefined }),
        getOpportunitiesForActiveRoute({ skip: 0, take: 10 }),
        getRoadmapsForUser({ skip: 0, take: 1 }),
      ]);

      if (roadmapsResult) {
        setRoadmaps(roadmapsResult.roadmaps);
        setHasMore(roadmapsResult.hasMore);
        setTotalCount(roadmapsResult.totalCount);
      }

      if (opportunitiesResult) {
        setOpportunities(opportunitiesResult.opportunities);
      }

      if (countResult) {
        setGeneratedRoadmapsCount(countResult.totalCount);
      }
    });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <SelectOpportunityRoadmapModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        opportunities={opportunities}
        planTier={planTier}
        generatedRoadmapsCount={generatedRoadmapsCount}
        hasCv={hasCv}
        onGenerated={handleRoadmapGenerated}
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Mis Roadmaps"
            description="Planes paso a paso generados por IA para conseguir tus oportunidades."
            actions={
              <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Crear roadmap
              </Button>
            }
          />

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card/50">
            <div className="relative max-w-xs w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por oportunidad..."
                className="pl-10 border-border/40 bg-card/50 rounded-xl h-10 text-sm"
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {totalCount} {totalCount === 1 ? "roadmap" : "roadmaps"}
            </span>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence>
              {isPending && roadmaps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center"
                >
                  <div className="bg-card p-4 rounded-2xl shadow-xl border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
                      Sincronizando...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {roadmaps.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {roadmaps.map((roadmap) => (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <RoadmapCard roadmap={roadmap} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <LoadMoreButton
                  handleLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  isPending={isPending}
                  currentCount={roadmaps.length}
                  totalCount={totalCount}
                  label="Mostrar más roadmaps"
                />
              </div>
            ) : (
              !isPending && (
                <EmptyPlaceholder
                  icon={Map}
                  title={debouncedQuery ? "Sin resultados" : "No tienes roadmaps aún"}
                  description={
                    debouncedQuery
                      ? "Prueba con otro término de búsqueda."
                      : "Entra a una oportunidad y genera tu primer roadmap con IA."
                  }
                />
              )
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
