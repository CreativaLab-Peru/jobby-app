"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Plus,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { applyImprovement } from "@/features/analysis/actions/apply-improvement";
import { SECTION_LABELS } from "@/const";

// ── Types ──────────────────────────────────────────────
export interface ImprovedText {
  sectionType: string;
  originalSnippet: string;
  improvedText: string;
  changeReason: string;
}

export interface SuggestedAddition {
  sectionType: string;
  title: string;
  suggestedText: string;
  impact: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
}

interface ImprovementsSectionProps {
  cvId: string;
  improvedTexts: ImprovedText[];
  suggestedAdditions: SuggestedAddition[];
}

// ── Helpers ────────────────────────────────────────────
const IMPACT_CONFIG = {
  HIGH: { label: "Alto impacto", color: "text-red-600 bg-red-500/10 border-red-500/20" },
  MEDIUM: { label: "Impacto moderado", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  LOW: { label: "Bajo impacto", color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
};

// ── Component ──────────────────────────────────────────
export function ImprovementsSection({
  cvId,
  improvedTexts,
  suggestedAdditions,
}: ImprovementsSectionProps) {
  const [appliedSections, setAppliedSections] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = (sectionType: string, improvedText: string) => {
    startTransition(async () => {
      const result = await applyImprovement(cvId, sectionType, improvedText);
      if (result.success) {
        setAppliedSections((prev) => new Set(prev).add(sectionType));
        toast.success(`Sección "${SECTION_LABELS[sectionType] || sectionType}" actualizada`);
      } else {
        toast.error(result.message || "Error al aplicar la mejora");
      }
    });
  };

  if (!improvedTexts?.length && !suggestedAdditions?.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* ── Improved Texts ────────────────────────── */}
      {improvedTexts.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Textos Mejorados</h2>
              <p className="text-xs text-muted-foreground">
                La IA sugiere estas versiones mejoradas. Acéptalas para actualizar tu CV.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {improvedTexts.map((item) => {
              const isApplied = appliedSections.has(item.sectionType);
              const isExpanded = expandedCards.has(`improved-${item.sectionType}`);
              const sectionLabel = SECTION_LABELS[item.sectionType] || item.sectionType;

              return (
                <motion.div
                  key={item.sectionType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-2xl border transition-all overflow-hidden",
                    isApplied
                      ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-border bg-card",
                  )}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(`improved-${item.sectionType}`)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isApplied ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                      )}
                      <div>
                        <h3 className="font-bold text-sm">{sectionLabel}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.changeReason}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4">
                          {/* Original */}
                          {item.originalSnippet && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Texto actual
                              </span>
                              <div className="p-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground line-through decoration-red-400/40">
                                {item.originalSnippet}
                              </div>
                            </div>
                          )}

                          {/* Improved */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              Versión mejorada
                            </span>
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm whitespace-pre-wrap">
                              {item.improvedText}
                            </div>
                          </div>

                          {/* Action */}
                          {!isApplied ? (
                            <Button
                              size="sm"
                              onClick={() => handleApply(item.sectionType, item.improvedText)}
                              disabled={isPending}
                              className="font-bold"
                            >
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                              {isPending ? "Aplicando..." : "Aceptar y aplicar"}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                              <CheckCircle2 className="h-4 w-4" />
                              Aplicado exitosamente
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Suggested Additions ───────────────────── */}
      {suggestedAdditions.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Contenido Sugerido</h2>
              <p className="text-xs text-muted-foreground">
                Agrega estas secciones o contenido a tu CV para mejorar tu puntaje.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {suggestedAdditions.map((item, i) => {
              const impactCfg = IMPACT_CONFIG[item.impact] || IMPACT_CONFIG.LOW;
              const sectionLabel = SECTION_LABELS[item.sectionType] || item.sectionType;
              const isExpanded = expandedCards.has(`addition-${i}`);

              return (
                <motion.div
                  key={`addition-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(`addition-${i}`)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="h-5 w-5 text-amber-600 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase px-2 py-0.5 rounded-md border",
                              impactCfg.color,
                            )}
                          >
                            {impactCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {sectionLabel} — {item.reason}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm whitespace-pre-wrap">
                            {item.suggestedText}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

