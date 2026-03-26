"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Lock, Map, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouteOpportunity } from "@/features/routes/actions/get-opportunities-for-active-route";
import { GenerateRoadmapButton } from "@/features/roadmap/components/generate-roadmap-button";
import Link from "next/link";
import { getRoadmapForOpportunity } from "@/features/roadmap/actions/get-roadmap-for-opportunity";

interface SelectOpportunityRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: RouteOpportunity[];
  planTier: "FREE" | "STARTER" | "PRO";
  generatedRoadmapsCount: number;
  hasCv: boolean;
  onGenerated: () => void;
}

export function SelectOpportunityRoadmapModal({
  isOpen,
  onClose,
  opportunities,
  planTier,
  generatedRoadmapsCount,
  hasCv,
  onGenerated,
}: SelectOpportunityRoadmapModalProps) {
  const [existingRoadmap, setExistingRoadmap] = useState<{ id: string; status: string } | null>(null);
  const [checkingRoadmap, setCheckingRoadmap] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const isFreePlan = planTier === "FREE";
  const isStarterPlan = planTier === "STARTER";
  const starterLimitReached = isStarterPlan && generatedRoadmapsCount >= 1;
  const hasLockedByFree = isFreePlan && opportunities.length > 1;

  const isOpportunityLocked = (index: number) => {
    if (starterLimitReached) return true;
    if (isFreePlan && index > 0) return true;
    return false;
  };

  const selectableOpportunities = useMemo(
    () => opportunities.filter((_, index) => !isOpportunityLocked(index)),
    [opportunities, starterLimitReached, isFreePlan],
  );


  // Reset selection and roadmap info when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedOpportunityId(selectableOpportunities[0]?.id ?? null);
    setExistingRoadmap(null);
    setCheckingRoadmap(false);
  }, [isOpen, selectableOpportunities]);

  // Check if roadmap exists for selected opportunity
  useEffect(() => {
    let cancelled = false;
    async function checkExistingRoadmap() {
      setCheckingRoadmap(true);
      if (!selectedOpportunityId) {
        setExistingRoadmap(null);
        setCheckingRoadmap(false);
        return;
      }
      const opp = opportunities.find((o) => o.id === selectedOpportunityId);
      if (!opp) {
        setExistingRoadmap(null);
        setCheckingRoadmap(false);
        return;
      }
      const roadmap = await getRoadmapForOpportunity(opp.id, opp.cvId);
      if (!cancelled) {
        if (roadmap && roadmap.id) {
          setExistingRoadmap({ id: roadmap.id, status: roadmap.status });
        } else {
          setExistingRoadmap(null);
        }
        setCheckingRoadmap(false);
      }
    }
    checkExistingRoadmap();
    return () => { cancelled = true; };
  }, [selectedOpportunityId, opportunities]);

  const selectedOpportunity = useMemo(
    () => opportunities.find((opportunity) => opportunity.id === selectedOpportunityId) ?? null,
    [opportunities, selectedOpportunityId],
  );


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-border"
          >
            <div className="sticky top-0 p-6 border-b bg-background z-10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Selecciona una oportunidad</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Genera un roadmap con IA desde las oportunidades de tu ruta activa.
                  </p>
                  {hasLockedByFree && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Plan Free: solo puedes generar roadmap para tu primera oportunidad.
                    </p>
                  )}
                  {starterLimitReached && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Plan Starter: ya generaste 1 roadmap. Mejora a Pro para generar más.
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {!hasCv ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="font-semibold">Tu ruta activa no tiene CV</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vincula un CV a tu ruta para generar roadmaps.
                  </p>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="font-semibold">No hay oportunidades disponibles</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Haz match de oportunidades primero para poder generar un roadmap.
                  </p>
                </div>
              ) : (
                opportunities.map((opportunity, index) => {
                  const isLocked = isOpportunityLocked(index);
                  const isSelected = selectedOpportunityId === opportunity.id;
                  const rawMatch = opportunity.match ?? 0;
                  const matchValue = Math.round(rawMatch > 1 ? rawMatch : rawMatch * 100);

                  return (
                    <div key={`${opportunity.id}-${opportunity.cvId}`} className="relative">
                      <button
                        type="button"
                        onClick={() => !isLocked && setSelectedOpportunityId(opportunity.id)}
                        disabled={isLocked}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          !isLocked && isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border"
                        } ${isLocked ? "opacity-70 blur-[8px] pointer-events-none select-none" : "hover:border-primary/40 hover:bg-muted/30"}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <p className="font-semibold truncate">{opportunity.title}</p>
                            </div>

                            <div className="ml-8 mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              {opportunity.company && (
                                <span className="inline-flex items-center gap-1">
                                  <Building2 className="w-3.5 h-3.5" />
                                  {opportunity.company}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                                <Target className="w-3.5 h-3.5" />
                                {matchValue}% match
                              </span>
                            </div>
                          </div>

                          <Badge variant="secondary" className="rounded-lg text-[10px] uppercase tracking-wider">
                            {opportunity.type}
                          </Badge>
                        </div>
                      </button>
                    </div>
                  );
                })
              )}

              {hasLockedByFree && (
                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-primary text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    Desbloquea todas las oportunidades
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pasa a Starter o Pro para generar roadmap en más oportunidades.
                  </p>
                  <Button size="sm" className="rounded-lg text-xs font-bold" asChild>
                    <Link href="/billing">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Ver Starter y Pro
                    </Link>
                  </Button>
                </div>
              )}

              {starterLimitReached && (
                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-primary text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    Límite de Starter alcanzado
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Con Starter puedes generar 1 roadmap. Mejora a Pro para crear roadmaps ilimitados.
                  </p>
                  <Button size="sm" className="rounded-lg text-xs font-bold" asChild>
                    <Link href="/billing">Ir a Pro</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-muted/20 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="font-bold tracking-widest text-xs uppercase h-11 px-6"
              >
                Cerrar
              </Button>

              {selectedOpportunity ? (
                checkingRoadmap ? (
                  <Button disabled className="h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest animate-pulse">
                    <Map className="w-4 h-4 mr-2" />
                    Verificando...
                  </Button>
                ) : existingRoadmap ? (
                  <div className="space-y-2 text-center">
                    <Button disabled className="h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest">
                      <Map className="w-4 h-4 mr-2" />
                      Ya tienes un roadmap generado
                    </Button>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Ya generaste un roadmap para esta oportunidad.
                    </p>
                    <Button asChild variant="secondary" className="h-10 px-6 rounded-xl font-bold text-xs mt-2">
                      <Link href={`/my-roadmaps/${existingRoadmap.id}`}>
                        Ver roadmap existente
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <GenerateRoadmapButton
                    opportunityId={selectedOpportunity.id}
                    cvId={selectedOpportunity.cvId}
                    existingStatus={null}
                    onGenerated={onGenerated}
                    canGenerate={!starterLimitReached && (!isFreePlan || selectableOpportunities[0]?.id === selectedOpportunity.id)}
                    blockedMessage={
                      starterLimitReached
                        ? "Con Starter puedes generar 1 roadmap. Mejora a Pro para generar más."
                        : "Con Free solo puedes generar roadmap para la primera oportunidad."
                    }
                  />
                )
              ) : (
                <Button disabled className="h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest">
                  <Map className="w-4 h-4 mr-2" />
                  Generar roadmap
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
