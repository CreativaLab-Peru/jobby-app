"use client";

import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TopOpportunity {
  id: string;
  match: number;
  title: string;
  type: string;
  linkUrl: string;
}

export function TopMatchesList({ topOpportunities }: { topOpportunities: TopOpportunity[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-levely-blue/30 dark:hover:border-levely-green/40 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-5 w-5 text-levely-blue dark:text-levely-green" />
        <h3 className="font-semibold uppercase tracking-wide text-sm text-levely-blue dark:text-levely-green">
          Top Matches
        </h3>
      </div>

      <div className="space-y-4">
        {topOpportunities && topOpportunities.length > 0 ? (
          topOpportunities.map((opt) => (
            <div
              key={opt.id}
              className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/40 hover:bg-primary/5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-levely-blue/10 dark:bg-levely-green/10 flex items-center justify-center font-extrabold text-levely-blue dark:text-levely-green text-lg shadow-inner group-hover:bg-levely-blue/20 dark:group-hover:bg-levely-green/20 transition-colors">
                  {Math.round(Number(opt.match) * 100)}%
                </div>
                <div>
                  <h4 className="font-bold text-base text-primary mb-1">{opt.title}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {opt.type.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 flex flex-col items-center">
            <p className="text-sm text-muted-foreground italic mb-4">
              No hay oportunidades emparejadas aún.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-4xl text-levely-blue dark:text-levely-green border-levely-blue/50 dark:border-levely-green/50 hover:bg-levely-green/10 flex items-center px-6 py-2 font-bold"
            >
              <Link href="/opportunities">
                Explorar Oportunidades
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
