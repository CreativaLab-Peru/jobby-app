"use client";

import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface TopOpportunity {
  id: string;
  match: number;
  title: string;
  type: string;
  linkUrl: string;
}

export function TopMatchesList({ topOpportunities }: { topOpportunities: TopOpportunity[] }) {
  const route = useRouter();
  return (
    <div className="bg-card border-border/40 rounded-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 p-5">
      {/* Header con estilo de Módulo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-black text-sm text-primary">
          Top Matches IA
        </h3>
      </div>

      <div className="space-y-3">
        {topOpportunities && topOpportunities.length > 0 ? (
          topOpportunities.map((opt) => (
            <div
              key={opt.id}
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:cursor-pointer"
              onClick={() => route.push(`/opportunities/${opt.id}/details`)}
            >
              <div className="flex items-center gap-4">
                {/* Porcentaje con estilo Squircle */}
                <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center font-black text-primary text-lg shadow-sm group-hover:scale-105 transition-transform duration-500">
                  {Math.round(Number(opt.match) * 100)}%
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground leading-tight">
                    {opt.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-bold">
                      {opt.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acción rápida */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 flex flex-col items-center">
            <div className="p-4 rounded-full bg-muted/20 mb-4">
              <Zap className="h-8 w-8 text-muted/40" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Sin coincidencias optimizadas
            </p>
            <Button
              asChild
              variant="accent"
              size="sm"
              className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-primary/10"
            >
              <Link href="/opportunities">
                Explorar Ahora
                <ArrowRight className="w-3 h-3 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
