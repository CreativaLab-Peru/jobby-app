"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Map,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { RoadmapStepData } from "@/features/roadmap/actions/get-roadmap-for-opportunity";

interface RoadmapDisplayProps {
  title: string | null;
  summary: string | null;
  steps: RoadmapStepData[];
  canViewFull: boolean;
}

export function RoadmapDisplay({
  title,
  summary,
  steps,
  canViewFull,
}: RoadmapDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title || "Tu Roadmap"}</h2>
          {summary && (
            <p className="text-xs text-muted-foreground">{summary}</p>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {steps.map((step, idx) => {
          const isLocked = !canViewFull && !step.isFree;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 border-2",
                    isLocked
                      ? "bg-muted border-border text-muted-foreground"
                      : "bg-primary/10 border-primary/30 text-primary",
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    step.order
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[24px]",
                      isLocked ? "bg-border" : "bg-primary/20",
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div
                className={cn(
                  "flex-1 pb-6 min-w-0",
                  isLocked && "select-none",
                )}
              >
                <div
                  className={cn(
                    "rounded-xl border p-4 space-y-3 transition-all",
                    isLocked
                      ? "border-border bg-muted/30 blur-[3px] pointer-events-none"
                      : "border-border bg-card",
                  )}
                >
                  {/* Title + duration */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    {step.estimatedDays && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium shrink-0">
                        <Clock className="w-3 h-3" />
                        ~{step.estimatedDays}d
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Action items */}
                  {step.actionItems.length > 0 && (
                    <ul className="space-y-1">
                      {step.actionItems.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Resources */}
                  {step.resources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {step.resources.map((res, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary/50 border border-border text-muted-foreground"
                        >
                          {res.url ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              {res.title}
                            </a>
                          ) : (
                            res.title
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upgrade CTA after first locked step */}
                {isLocked && idx === steps.findIndex((s) => !s.isFree) && (
                  <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        Desbloquea el roadmap completo
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Obtén tu plan Starter o Pro para ver todos los pasos y
                      recursos.
                    </p>
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs font-bold rounded-lg"
                      asChild
                    >
                      <Link href="/credits">Ver planes</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

