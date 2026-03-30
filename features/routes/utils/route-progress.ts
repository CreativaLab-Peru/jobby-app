import { RouteStatus } from "@prisma/client";
import { RouteWithCvSummary } from "@/store/use-route-store";

export function getProgressFraction(route: RouteWithCvSummary): number {
  const { status, roadmapProgress } = route;

  const baseProgress: Record<string, number> = {
    "CV_PENDING": 0,
    "CV_CREATED": 0.25,
    "ANALYSIS_PENDING": 0.35,
    "ANALYSIS_DONE": 0.50,
    "OPPORTUNITIES_PENDING": 0.60,
    "OPPORTUNITIES_DONE": 0.75,
  };

  if (status in baseProgress) return baseProgress[status];

  const roadmapStatuses = ["ROADMAP_PENDING", "ROADMAP_IN_PROGRESS", "ROADMAP_DONE"];

  if (roadmapStatuses.includes(status) || status === "PROGRAM_DONE") {
    if (status === "PROGRAM_DONE") return 1;
    if (!roadmapProgress || roadmapProgress.totalActions === 0) {
      return status === "ROADMAP_DONE" ? 1 : 0.75;
    }
    const internalProgress = roadmapProgress.completedActions / roadmapProgress.totalActions;
    return Math.min(0.75 + (internalProgress * 0.25), 1);
  }

  return 0;
}

export function getProgressLabel(status: RouteStatus): string {
  const labels: {
    CV_PENDING: string;
    CV_CREATED: string;
    ANALYSIS_PENDING: string;
    ANALYSIS_DONE: string;
    OPPORTUNITIES_PENDING: string;
    OPPORTUNITIES_DONE: string;
    ROADMAP_PENDING: string;
    ROADMAP_IN_PROGRESS: string;
    ROADMAP_DONE: string;
    PROGRAM_DONE: string
  } = {
    "CV_PENDING": "Sin CV",
    "CV_CREATED": "CV listo",
    "ANALYSIS_PENDING": "Analizando...",
    "ANALYSIS_DONE": "Análisis listo",
    "OPPORTUNITIES_PENDING": "Buscando...",
    "OPPORTUNITIES_DONE": "Oportunidades",
    "ROADMAP_PENDING": "Generando roadmap...",
    "ROADMAP_IN_PROGRESS": "En progreso...",
    "ROADMAP_DONE": "Pasos listos",
    "PROGRAM_DONE": "Ruta completa ✓",
  };
  return labels[status] || "";
}
