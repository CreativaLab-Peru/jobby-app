"use client";

import {Folder, ArrowUpRight, LucideIcon} from "lucide-react";
import Link from "next/link";
import {Card} from "@/components/ui/card";

interface Resource {
  label: string;
  count: number;
  icon?: LucideIcon;
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
    <Card
      className="bg-card border-border/40 rounded-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 p-5">

      {/* Header del Card */}
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Folder className="w-5 h-5 text-primary"/>
        </div>
        <h3 className="font-black text-sm text-primary">
          Mis Recursos
        </h3>
      </div>

      {/* Lista de Stats */}
      <div className="flex-1 space-y-1 mt-2">
        {resources.map((resource) => (
          <div key={resource.label} className="flex items-center justify-between group/item">
            <span
              className="text-xs text-muted-foreground/90 group-hover/item:text-foreground transition-colors">
              {resource.label}
            </span>
            <span className="text-sm font-black tracking-tight text-primary">
              {resource.count}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="mt-4">
        <Link
          href="/credits"
          className="flex items-center justify-between p-2 px-4 rounded-2xl bg-secondary text-sm font-semibold tracking-widest text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 group/btn"
        >
          <span>Mejorar Plan</span>
          <ArrowUpRight
            className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"/>
        </Link>
      </div>
    </Card>
  );
}
