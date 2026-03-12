"use client";

import { Map, Building2, Clock, ArrowRight, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import type { RoadmapListItem } from "@/features/roadmap/actions/get-roadmaps-for-user";

const OPPORTUNITY_LABELS: Record<string, string> = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
  STARTUP: "Aceleradora",
};

interface RoadmapCardProps {
  roadmap: RoadmapListItem;
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/my-roadmaps/${roadmap.id}`)}
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-border/40 bg-card hover:bg-secondary/10 hover:border-primary/20 cursor-pointer transition-all duration-200"
    >
      {/* Left: icon + info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
          <Map className="h-5 w-5" />
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="font-bold text-sm truncate">
            {roadmap.title || "Roadmap"}
          </h3>

          <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/50 border border-border">
              {OPPORTUNITY_LABELS[roadmap.opportunity.type] || roadmap.opportunity.type}
            </span>
            <span className="text-xs truncate max-w-[200px]">
              {roadmap.opportunity.title}
            </span>
            {roadmap.opportunity.company && (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="flex items-center gap-1 text-xs">
                  <Building2 className="w-3 h-3" />
                  {roadmap.opportunity.company}
                </span>
              </>
            )}
          </div>

          {roadmap.summary && (
            <p className="text-xs text-muted-foreground/70 line-clamp-1">
              {roadmap.summary}
            </p>
          )}
        </div>
      </div>

      {/* Right: stats + arrow */}
      <div className="flex items-center gap-4 mt-3 md:mt-0 md:ml-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="w-3.5 h-3.5" />
            {roadmap.stepsCount} pasos
          </span>
          {roadmap.totalDays > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{roadmap.totalDays}d
            </span>
          )}
          <span className="text-[10px]">
            {formatDate(roadmap.createdAt, "d MMM yyyy")}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

