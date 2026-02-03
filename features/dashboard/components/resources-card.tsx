"use client";

import { Folder, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Resource {
  label: string;
  count: number;
  colorClass: string;
}

export function ResourcesCard({
  resources,
  opportunitiesCount,
}: {
  resources: Resource[];
  opportunitiesCount: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-levely-blue/30 dark:hover:border-levely-green/30 transition-colors h-full flex items-stretch">
      <div className="w-full p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-primary" />
            <h3 className="font-semibold uppercase tracking-wide text-sm">Recursos</h3>
          </div>
          <div className="space-y-5">
            {resources.map((resource) => (
              <div key={resource.label} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {resource.label}
                  </span>
                  <span className={`text-sm font-semibold ${resource.colorClass}`}>
                    {resource.count}
                  </span>
                </div>
              </div>
            ))}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Oportunidades
                </span>
                <span className="text-sm font-semibold text-levely-blue dark:text-levely-green">
                  {opportunitiesCount}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Link
                href="/credits"
                className="flex items-center justify-between text-sm text-levely-blue dark:text-levely-green hover:underline"
              >
                <span>Mejorar Plan</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
