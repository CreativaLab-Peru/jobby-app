"use client";

import { Folder, ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Resource {
  label: string;
  count: number;
  icon?: LucideIcon; // Opcional, para mayor flexibilidad
}

interface ResourcesCardProps {
  resources: Resource[];
  opportunitiesCount: number;
}

export function ResourcesCard({
                                resources,
                                opportunitiesCount,
                              }: ResourcesCardProps) {
  return (
    <div className="bg-card border border-border/40 rounded-[2rem] p-8 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group">

      {/* Header del Card */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
          <Folder className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-black uppercase tracking-[0.15em] text-[10px] text-muted-foreground/80">
          Mis Recursos
        </h3>
      </div>

      {/* Lista de Stats */}
      <div className="flex-1 space-y-6">
        {resources.map((resource) => (
          <div key={resource.label} className="flex items-center justify-between group/item">
            <span className="text-sm font-bold text-muted-foreground/70 group-hover/item:text-foreground transition-colors">
              {resource.label}
            </span>
            <span className="text-lg font-black tracking-tight text-primary">
              {resource.count}
            </span>
          </div>
        ))}

        {/* Oportunidades (Destacado sutil) */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-4">
          <span className="text-sm font-bold text-muted-foreground/70">
            Oportunidades
          </span>
          <span className="text-lg font-black tracking-tight text-accent">
            {opportunitiesCount}
          </span>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-10">
        <Link
          href="/credits"
          className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 text-sm font-black uppercase tracking-widest text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group/btn"
        >
          <span>Mejorar Plan</span>
          <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
