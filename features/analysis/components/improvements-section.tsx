"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Sparkles,
  Lightbulb,
  ArrowDown,
  Loader2,
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
const IMPACT_BADGE: Record<string, { label: string; cls: string }> = {
  HIGH: { label: "Alto", cls: "bg-red-500/10 text-red-600 border-red-500/20" },
  MEDIUM: { label: "Medio", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  LOW: { label: "Bajo", cls: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

// ── Component ──────────────────────────────────────────
export function ImprovementsSection({
  cvId,
  improvedTexts,
  suggestedAdditions,
}: ImprovementsSectionProps) {
  const [appliedSections, setAppliedSections] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [applyingSection, setApplyingSection] = useState<string | null>(null);

  const handleApply = (sectionType: string, improvedText: string) => {
    setApplyingSection(sectionType);
    startTransition(async () => {
      const result = await applyImprovement(cvId, sectionType, improvedText);
      if (result.success) {
        setAppliedSections((prev) => new Set(prev).add(sectionType));
        toast.success(`"${SECTION_LABELS[sectionType] || sectionType}" actualizada`);
      } else {
        toast.error(result.message || "Error al aplicar la mejora");
      }
      setApplyingSection(null);
    });
  };

  const handleApplyAll = () => {
    const pending = improvedTexts.filter((t) => !appliedSections.has(t.sectionType));
    if (pending.length === 0) return;
    startTransition(async () => {
      for (const item of pending) {
        const result = await applyImprovement(cvId, item.sectionType, item.improvedText);
        if (result.success) {
          setAppliedSections((prev) => new Set(prev).add(item.sectionType));
        }
      }
      toast.success("Todas las mejoras fueron aplicadas");
    });
  };

  if (!improvedTexts?.length && !suggestedAdditions?.length) return null;

  const pendingCount = improvedTexts.filter((t) => !appliedSections.has(t.sectionType)).length;

  return (
    <div className="space-y-6">
      {/* ── Improved Texts ────────────────────────── */}
      {improvedTexts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold">Textos Mejorados</h2>
              <span className="text-xs text-muted-foreground">
                ({improvedTexts.length - pendingCount}/{improvedTexts.length} aplicados)
              </span>
            </div>
            {pendingCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleApplyAll}
                disabled={isPending}
                className="text-xs font-bold rounded-lg"
              >
                {isPending && !applyingSection ? (
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                )}
                Aplicar todas
              </Button>
            )}
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
            {improvedTexts.map((item) => {
              const isApplied = appliedSections.has(item.sectionType);
              const isLoading = applyingSection === item.sectionType;
              const label = SECTION_LABELS[item.sectionType] || item.sectionType;

              return (
                <div key={item.sectionType} className="p-4 space-y-3">
                  {/* Section header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isApplied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                      )}
                      <span className={cn("text-sm font-bold", isApplied && "text-emerald-600")}>{label}</span>
                    </div>
                    {!isApplied && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApply(item.sectionType, item.improvedText)}
                        disabled={isPending}
                        className="text-xs font-bold text-primary h-7 px-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-muted-foreground pl-6">{item.changeReason}</p>

                  {/* Before → After (always visible) */}
                  <div className="pl-6 space-y-2">
                    {item.originalSnippet && (
                      <div className="text-xs px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground line-through decoration-red-400/40 leading-relaxed">
                        {item.originalSnippet}
                      </div>
                    )}
                    {item.originalSnippet && (
                      <ArrowDown className="w-3 h-3 text-muted-foreground/50 mx-auto" />
                    )}
                    <div className={cn(
                      "text-xs px-3 py-2 rounded-lg border leading-relaxed whitespace-pre-wrap",
                      isApplied
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                        : "bg-card border-border"
                    )}>
                      {item.improvedText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Suggested Additions ───────────────────── */}
      {suggestedAdditions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold">Contenido Sugerido</h2>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
            {suggestedAdditions.map((item, i) => {
              const badge = IMPACT_BADGE[item.impact] || IMPACT_BADGE.LOW;
              const label = SECTION_LABELS[item.sectionType] || item.sectionType;

              return (
                <div key={i} className="p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{item.title}</span>
                    <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border", badge.cls)}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                  <div className="text-xs px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50 leading-relaxed whitespace-pre-wrap">
                    {item.suggestedText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

