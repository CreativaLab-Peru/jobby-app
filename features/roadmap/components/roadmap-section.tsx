"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RoadmapDisplay } from "@/features/roadmap/components/roadmap-display";
import { GenerateRoadmapButton } from "@/features/roadmap/components/generate-roadmap-button";
import type { RoadmapData } from "@/features/roadmap/actions/get-roadmap-for-opportunity";

interface RoadmapSectionProps {
  opportunityId: string;
  cvId: string;
  initialRoadmap: RoadmapData;
  canViewFull: boolean;
  canGenerate?: boolean;
  blockedMessage?: string | null;
}

/**
 * Composite: shows the generate button OR the roadmap display,
 * based on whether a roadmap already exists for this opportunity.
 */
export function RoadmapSection({
  opportunityId,
  cvId,
  initialRoadmap,
  canViewFull,
  canGenerate = true,
  blockedMessage = null,
}: RoadmapSectionProps) {
  const router = useRouter();

  const handleGenerated = useCallback(() => {
    // Refresh server data
    router.refresh();
  }, [router]);

  // Roadmap is ready — show it
  if (initialRoadmap && initialRoadmap.status === "SUCCEEDED" && initialRoadmap.steps.length > 0) {
    return (
      <RoadmapDisplay
        title={initialRoadmap.title}
        summary={initialRoadmap.summary}
        steps={initialRoadmap.steps}
        canViewFull={canViewFull}
      />
    );
  }

  // Show generate/processing/retry button
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-3">
      <p className="text-sm font-bold">Roadmap personalizado</p>
      <p className="text-xs text-muted-foreground">
        La IA creará un plan paso a paso para que consigas esta oportunidad.
      </p>
      <GenerateRoadmapButton
        opportunityId={opportunityId}
        cvId={cvId}
        existingStatus={initialRoadmap?.status ?? null}
        onGenerated={handleGenerated}
        canGenerate={canGenerate}
        blockedMessage={blockedMessage}
      />
    </div>
  );
}

