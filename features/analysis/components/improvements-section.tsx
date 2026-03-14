"use client";

import {useState, useTransition} from "react";
import {
  CheckCircle2,
  Sparkles,
  Lightbulb,
  ArrowDown,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {applyImprovement} from "@/features/analysis/actions/apply-improvement";
import {SECTION_LABELS} from "@/const";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {useRouter} from "next/navigation";

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
  HIGH: {label: "Alto", cls: "bg-red-500/10 text-red-600 border-red-500/20"},
  MEDIUM: {label: "Medio", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20"},
  LOW: {label: "Bajo", cls: "bg-blue-500/10 text-blue-600 border-blue-500/20"},
};

export function ImprovementsSection({
                                      cvId,
                                      improvedTexts,
                                      suggestedAdditions,
                                    }: ImprovementsSectionProps) {
  const [appliedSections, setAppliedSections] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [applyingSection, setApplyingSection] = useState<string | null>(null);

  // const router = useRouter();
  //
  // const handleApply = (sectionType: string, improvedText: string) => {
  //   setApplyingSection(sectionType);
  //   startTransition(async () => {
  //     const result = await applyImprovement(cvId, sectionType, improvedText);
  //     if (result.success) {
  //       setAppliedSections((prev) => new Set(prev).add(sectionType));
  //       toast.success(`"${SECTION_LABELS[sectionType] || sectionType}" actualizada`);
  //     } else {
  //       toast.error(result.message || "Error al aplicar la mejora");
  //     }
  //     setApplyingSection(null);
  //   });
  // };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Texto copiado al portapapeles");
    } catch (err) {
      toast.error("No se pudo copiar el texto");
    }
  };

  const handleApplyAll = () => {
    // const pending = improvedTexts.filter((t) => !appliedSections.has(t.sectionType));
    // if (pending.length === 0) return;
    // startTransition(async () => {
    //   for (const item of pending) {
    //     const result = await applyImprovement(cvId, item.sectionType, item.improvedText);
    //     if (result.success) {
    //       setAppliedSections((prev) => new Set(prev).add(item.sectionType));
    //     }
    //   }
    //   toast.success("Todas las mejoras fueron aplicadas");
    // });

    // Abrir otra pestania de esto
    // router.push(`/cv/${cvId}/edit`);

    if (cvId) {
      window.open(`/cv/${cvId}/edit`, "_blank", "noopener,noreferrer");
    }
  };

  if (!improvedTexts?.length && !suggestedAdditions?.length) return null;

  const pendingCount = improvedTexts.filter((t) => !appliedSections.has(t.sectionType)).length;

  return (
    <Tabs defaultValue="refinement" className="w-full space-y-6">

      {/* ── HEADER CON TABS ────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="refinement" className="flex gap-2 items-center px-4">
            <Sparkles className="w-3.5 h-3.5"/>
            <span>Refinamiento</span>
            {pendingCount > 0 && (
              <span
                className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="additions" className="flex gap-2 items-center px-4">
            <Lightbulb className="w-3.5 h-3.5"/>
            <span>Sugerencias</span>
            {suggestedAdditions.length > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({suggestedAdditions.length})
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Acción Global solo visible en la tab de Refinamiento */}
        <TabsContent value="refinement" className="m-0">
          {pendingCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleApplyAll}
              disabled={isPending}
              className="text-xs font-bold rounded-lg border-emerald-500/20 hover:bg-emerald-500/10"
            >
              {isPending && !applyingSection ? (
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin"/>
              ) : (
                <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600"/>
              )}
              Aplicar todas
            </Button>
          )}
        </TabsContent>
      </div>

      {/* ── CONTENIDO: TEXTOS MEJORADOS ──────────────── */}
      <TabsContent value="refinement" className="mt-0 space-y-4 focus-visible:outline-none">
        {improvedTexts.length > 0 ? (
          <div
            className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600"/>
                <h2 className="text-base font-bold">Textos Mejorados</h2>
                {/*<span className="text-xs text-muted-foreground">*/}
                {/*          ({improvedTexts.length - pendingCount}/{improvedTexts.length} aplicados)*/}
                {/*        </span>*/}
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
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin"/>
                  ) : (
                    <CheckCircle2 className="w-3 h-3 mr-1.5"/>
                  )}
                  Aplicar todas
                </Button>
              )}
            </div>

            {improvedTexts.map((item) => {
              const isApplied = appliedSections.has(item.sectionType);
              // const isLoading = applyingSection === item.sectionType;
              const label = SECTION_LABELS[item.sectionType] || item.sectionType;

              return (
                <div key={item.sectionType}
                     className="p-4 space-y-3 transition-colors hover:bg-muted/30">
                  <div className="space-y-4">
                    <div key={item.sectionType} className="p-4 space-y-3">
                      {/* Section header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                          ) : (
                            <div
                              className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0"/>
                          )}
                          <span
                            className={cn("text-sm font-bold", isApplied && "text-emerald-600")}>{label}</span>
                        </div>
                        {/*{!isApplied && (*/}
                        {/*  <Button*/}
                        {/*    size="sm"*/}
                        {/*    variant="ghost"*/}
                        {/*    onClick={() => handleApply(item.sectionType, item.improvedText)}*/}
                        {/*    disabled={isPending}*/}
                        {/*    className="text-xs font-bold text-primary h-7 px-2"*/}
                        {/*  >*/}
                        {/*    {isLoading ? (*/}
                        {/*      <Loader2 className="w-3 h-3 animate-spin"/>*/}
                        {/*    ) : (*/}
                        {/*      "Aplicar"*/}
                        {/*    )}*/}
                        {/*  </Button>*/}
                        {/*)}*/}
                      </div>

                      {/* Reason */}
                      <p className="text-xs text-muted-foreground pl-6">{item.changeReason}</p>

                      {/* Before → After (always visible) */}
                      <div className="pl-6 space-y-2">
                        {item.originalSnippet && (
                          <div
                            className="text-xs px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground line-through decoration-red-400/40 leading-relaxed">
                            {item.originalSnippet}
                          </div>
                        )}
                        {item.originalSnippet && (
                          <ArrowDown className="w-3 h-3 text-muted-foreground/50 mx-auto"/>
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
                      {/* Botón de Copiar */}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 gap-1.5 text-xs font-medium"
                        onClick={() => copyToClipboard(item.improvedText)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No hay textos para mejorar en este momento."/>
        )}
      </TabsContent>

      {/* ── CONTENIDO: SUGERENCIAS ──────────────────── */}
      <TabsContent value="additions" className="mt-0 space-y-4 focus-visible:outline-none">
        {suggestedAdditions.length > 0 ? (
          <div
            className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {suggestedAdditions.map((item, i) => {
              const badge = IMPACT_BADGE[item.impact] || IMPACT_BADGE.LOW;
              const label = SECTION_LABELS[item.sectionType] || item.sectionType;

              return (
                <div key={i} className="p-4 space-y-3 transition-colors hover:bg-muted/30">
                  {/* ── Suggested Additions ───────────────────── */}
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold">{item.title}</span>
                      <span
                        className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border", badge.cls)}>
                      {badge.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">· {label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                    <div
                      className="text-xs px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50 leading-relaxed whitespace-pre-wrap">
                      {item.suggestedText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No se encontraron sugerencias adicionales."/>
        )}
      </TabsContent>
    </Tabs>
  );
}

function EmptyState({message}: { message: string }) {
  return (
    <div className="py-12 text-center rounded-xl border-2 border-dashed border-border">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
