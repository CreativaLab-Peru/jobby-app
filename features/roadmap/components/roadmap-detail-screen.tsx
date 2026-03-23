"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoadmapDisplay } from "@/features/roadmap/components/roadmap-display";
import type { RoadmapDetail } from "@/features/roadmap/actions/get-roadmap-by-id";
import { formatDate } from "@/utils/format-date";

const OPPORTUNITY_LABELS: Record<string, string> = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
  STARTUP: "Aceleradora",
};

interface RoadmapDetailScreenProps {
  roadmap: RoadmapDetail;
  canViewFull: boolean;
}

export function RoadmapDetailScreen({
  roadmap,
  canViewFull,
}: RoadmapDetailScreenProps) {
  const opp = roadmap.opportunity;

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Back */}
          <Button
            variant="ghost"
            asChild
            className="rounded-xl font-bold text-muted-foreground group"
          >
            <Link href="/my-roadmaps">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Mis Roadmaps
            </Link>
          </Button>

          {/* Opportunity context card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/50 border border-border">
                    {OPPORTUNITY_LABELS[opp.type] || opp.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(roadmap.createdAt, "d MMM yyyy")}
                  </span>
                </div>
                <h2 className="font-bold text-lg truncate">{opp.title}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {opp.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {opp.company}
                    </span>
                  )}
                  {opp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {opp.location}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 rounded-lg text-xs font-bold"
              >
                <a
                  href={opp.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Postular
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Full roadmap */}
          <RoadmapDisplay
            title={roadmap.title}
            summary={roadmap.summary}
            steps={roadmap.steps}
            canViewFull={canViewFull}
          />
        </motion.div>
      </div>
    </main>
  );
}

