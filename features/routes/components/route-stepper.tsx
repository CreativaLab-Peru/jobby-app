"use client";

import { startTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileText,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  Map,
  Trophy,
  Upload,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RouteStatus } from "@prisma/client";
import { PageHeader } from "@/components/shared/page-header";
import { useCvModalStore } from "@/features/cv/hooks/use-cv-modal-store";
import { CreateCVModal } from "@/features/cv/components/create-cv-modal";
import { UploadCVModal } from "@/features/cv/components/upload-cv-modal";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/use-task-store";
import { useRouteStore } from "@/store/use-route-store";
import { Loader2 } from "lucide-react";

type StepStatus = "completed" | "current" | "locked";

interface Step {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
  cta: string;
  price?: string;
  tierLabel?: string;
  expanded?: {
    isReady: boolean;
    readyTitle: string;
    pendingTitle: string;
    benefits: string[];
    primaryAction: {
      label: string;
      readyLabel: string;
      onClick: () => void;
      icon?: any;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
      icon?: any;
    };
  };
}

interface RouteStepperProps {
  routeName: string;
  routeStatus: RouteStatus;
  cvId: string | null;
  cvTitle: string | null;
  evaluationScore: number | null;
  opportunitiesCount: number;
  hasRoadmap?: boolean;
  roadmapId: string;
  planTier: "FREE" | "STARTER" | "PRO";
  generatedRoadmapsCount?: number;
}

const STATUS_ORDER: RouteStatus[] = [
  "CV_PENDING",
  "CV_CREATED",
  "ANALYSIS_PENDING",
  "ANALYSIS_DONE",
  "OPPORTUNITIES_PENDING",
  "OPPORTUNITIES_DONE",
  "ROADMAP_PENDING",
  "ROADMAP_IN_PROGRESS",
  "ROADMAP_DONE",
  "PROGRAM_DONE",
];

function getStepStatus(
  stepRequires: RouteStatus,
  stepCompleted: RouteStatus,
  currentStatus: RouteStatus,
): StepStatus {
  const current = STATUS_ORDER.indexOf(currentStatus);
  const completed = STATUS_ORDER.indexOf(stepCompleted);
  const requires = STATUS_ORDER.indexOf(stepRequires);

  if (current >= completed) return "completed";
  if (current >= requires) return "current";
  return "locked";
}

export default function RouteStepper({
  routeName,
  routeStatus,
  cvId,
  cvTitle,
  evaluationScore,
  opportunitiesCount,
  hasRoadmap = false,
  roadmapId,
  planTier,
  generatedRoadmapsCount = 0,
}: RouteStepperProps) {
  const router = useRouter();
  const { onOpenCreate, onOpenUpload } = useCvModalStore();
  const tasks = useTaskStore((state) => state.tasks);
  const activeRoute = useRouteStore((state) => state.activeRoute);

  // Verificamos si hay alguna tarea en curso para este CV o Ruta
  const activeTask = Object.values(tasks).find((t) => {
    if (t.status !== "IN_PROGRESS") return false;

    return (
      t.scopeId === cvId ||
      t.metadata?.cvId === cvId ||
      (activeRoute?.id && t.metadata?.routeId === activeRoute.id) ||
      (activeRoute?.id && t.scopeId === activeRoute.id)
    );
  });

  const isProcessing = !!activeTask;

  const isRoadmapDone = routeStatus === "ROADMAP_DONE";
  const isFullCompleted = routeStatus === "PROGRAM_DONE";

  const isStarterPlan = planTier === "STARTER";
  const starterLimitReached = isStarterPlan && generatedRoadmapsCount >= 1;

  const steps: Step[] = [
    {
      id: 1,
      title: "Descubre tu perfil profesional",
      description: cvTitle
        ? `CV activo: "${cvTitle}"`
        : "Sube tu CV o crea uno desde cero para analizar tu potencial",
      href: !cvId ? "/my-cv" : `/cv/${cvId}/preview`,
      icon: FileText,
      status: getStepStatus("CV_PENDING", "CV_CREATED", routeStatus),
      cta: cvId ? "Ver mi CV" : "Subir o crear CV",
      expanded: {
        isReady: !!cvId,
        readyTitle: "Tu CV está listo. Con él puedes acceder a:",
        pendingTitle: "Después de subir tu CV podrás ver:",
        benefits: ["Tu puntaje de perfil", "Oportunidades con match", "Tu roadmap personalizado"],
        primaryAction: {
          label: "Subir mi CV",
          readyLabel: "Ver mi CV",
          onClick: onOpenUpload,
          icon: Upload,
        },
        secondaryAction: {
          label: "Crear CV desde cero",
          onClick: onOpenCreate,
          icon: Plus,
        },
      },
    },
    {
      id: 2,
      title: "Optimiza tu perfil con IA",
      description: "Análisis detallado y textos mejorados para tu CV",
      href: evaluationScore !== null ? "/my-evaluation" : "/my-evaluation?analyze=true",
      icon: BarChart3,
      status: getStepStatus("CV_CREATED", "ANALYSIS_DONE", routeStatus),
      cta: evaluationScore !== null ? "Ver análisis" : "Analizar CV",
      expanded: {
        isReady: evaluationScore !== null,
        readyTitle: "Análisis completado. Tienes acceso a:",
        pendingTitle: "Con el análisis de IA obtendrás:",
        benefits: ["Fortalezas y debilidades", "Sugerencias de mejora", "Puntuación competitiva"],
        primaryAction: {
          label: "Analizar mi CV",
          readyLabel: "Ver mi análisis",
          onClick: () =>
            router.push(
              evaluationScore !== null ? "/my-evaluation" : "/my-evaluation?analyze=true",
            ),
        },
      },
    },
    {
      id: 3,
      title: "Encuentra oportunidades con match",
      description: "Becas y programas alineados a tu perfil real",
      href: opportunitiesCount > 0 ? "/my-opportunities" : "/my-opportunities?match=true",
      icon: Briefcase,
      status: getStepStatus("ANALYSIS_DONE", "OPPORTUNITIES_DONE", routeStatus),
      cta: opportunitiesCount > 0 ? "Ver oportunidades" : "Buscar oportunidades",
      expanded: {
        isReady: opportunitiesCount > 0,
        readyTitle: "Oportunidades encontradas. Revisa:",
        pendingTitle: "Encontraremos para ti:",
        benefits: ["Becas recomendadas", "Match por habilidades", "Filtros inteligentes"],
        primaryAction: {
          label: "Buscar oportunidades con match",
          readyLabel: "Ver mis oportunidades",
          onClick: () =>
            router.push(
              opportunitiesCount > 0 ? "/my-opportunities" : "/my-opportunities?match=true",
            ),
        },
      },
    },
    {
      id: 4,
      title: "Conoce tu ruta personalizada",
      description: "Roadmap paso a paso para aplicar a tu beca meta",
      href: hasRoadmap && roadmapId ? `/my-roadmaps/${roadmapId}` : "/my-roadmaps?openCreate=1",
      icon: Map,
      status: getStepStatus("OPPORTUNITIES_DONE", "ROADMAP_DONE", routeStatus),
      cta: hasRoadmap ? "Ver roadmap" : "Generar roadmap",
      expanded: {
        isReady: hasRoadmap,
        readyTitle: "Tu roadmap está listo. Incluye:",
        pendingTitle: "Tu ruta incluirá:",
        benefits: ["Pasos detallados", "Recursos de estudio", "Cronograma de metas"],
        primaryAction: {
          label: "Generar mi roadmap personalizado",
          readyLabel: "Ver mi roadmap",
          onClick: () => {
            if (!hasRoadmap) {
              if (starterLimitReached) return;
              router.push("/my-roadmaps?openCreate=1");
            } else {
              router.push(hasRoadmap && roadmapId ? `/my-roadmaps/${roadmapId}` : "/my-roadmaps");
            }
          },
        },
      },
    },
    {
      id: 5,
      title: "Lleva tu aplicación al siguiente nivel",
      description: "CV Harvard · sesión con Dara · optimización avanzada",
      href: "/booking",
      icon: Trophy,
      status: isFullCompleted ? "completed" : isRoadmapDone ? "current" : "locked",
      cta: "Potenciar mi perfil",
      price: "S/ 19.90",
      tierLabel: "PLAN BUILDER",
    },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <PageHeader
            title={routeName}
            description="Sigue estos pasos para completar tu ruta personalizada."
            actions={
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Guía con IA
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={cn(
                    "relative flex flex-col md:flex-row items-start gap-5 p-5 rounded-2xl border transition-all duration-300",
                    step.status === "completed" &&
                      "bg-gradient-to-r from-green-50/30 to-background border-green-100 dark:from-green-950/5 dark:border-green-900/30 opacity-90",
                    step.status === "current" &&
                      (step.id === 5
                        ? "bg-gradient-to-br from-indigo-50/80 via-white to-background dark:from-indigo-950/20 dark:to-background border-indigo-300 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                        : "bg-gradient-to-br from-primary/10 via-primary/[0.02] to-background border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/20"),
                    step.status === "locked" &&
                      "bg-muted/10 border-border/40 opacity-40 grayscale-[0.5]",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-11 w-11 rounded-xl shrink-0 transition-all duration-500",
                      step.status === "completed" &&
                        "bg-green-100 text-green-600 dark:bg-green-900/30",
                      step.status === "current" &&
                        (step.id === 5
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/40"
                          : "bg-primary text-primary-foreground shadow-md shadow-primary/40"),
                      step.status === "locked" && "bg-muted/50 text-muted-foreground",
                      step.status === "current" && "scale-105 rotate-2", // Menos agresivo
                    )}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.status === "locked" ? (
                      <Lock className="h-4 w-4" />
                    ) : step.id === 5 ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                        Paso {step.id}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground leading-none">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      {step.description}
                    </p>

                    {/* Contenido Expandido */}
                    {step.status === "current" && step.expanded && (
                      <div className="mt-5 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="default"
                            className={cn(
                              "w-full sm:flex-1 h-11 text-sm font-bold rounded-xl shadow-sm transition-all", // De py-7 a h-11 (aprox py-2.5)
                              isProcessing
                                ? "bg-muted text-muted-foreground border-2 border-dashed"
                                : "bg-primary hover:bg-primary/90 active:scale-[0.98]",
                            )}
                            onClick={step.expanded.primaryAction.onClick}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              step.expanded.primaryAction.icon && (
                                <step.expanded.primaryAction.icon className="mr-2 h-4 w-4" />
                              )
                            )}
                            {isProcessing
                              ? "Procesando..."
                              : step.expanded.isReady
                                ? step.expanded.primaryAction.readyLabel
                                : step.expanded.primaryAction.label}
                          </Button>

                          {step.expanded.secondaryAction && !step.expanded.isReady && (
                            <Button
                              variant="secondary"
                              className={cn(
                                "w-full sm:flex-1 h-11 text-sm font-bold rounded-xl border transition-all", // De py-7 a h-11
                                isProcessing
                                  ? "opacity-50 border-dashed"
                                  : "hover:bg-secondary/80 active:scale-[0.98]",
                              )}
                              onClick={step.expanded.secondaryAction.onClick}
                              disabled={isProcessing}
                            >
                              {step.expanded.secondaryAction.label}
                            </Button>
                          )}
                        </div>

                        {/* Beneficios */}
                        <div className="pt-4 border-t border-dashed border-primary/20">
                          <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-2">
                            {step.expanded.isReady
                              ? step.expanded.readyTitle
                              : step.expanded.pendingTitle}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {step.expanded.benefits.map((benefit, idx) => (
                              <Badge
                                key={benefit}
                                variant="secondary"
                                className="font-semibold text-[10px] border-none py-0.5 px-2.5 bg-primary/5 text-primary"
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTÓN LATERAL */}
                  {step.status !== "locked" && (step.status === "completed" || step.id === 5) && (
                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0 self-stretch md:self-center pt-4 md:pt-0 md:pl-5 md:border-l border-border/50 mt-4 md:mt-0">
                      {step.id === 5 && step.price && (
                        <div className="flex flex-col items-start md:items-end flex-1 md:flex-none">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tight">
                            Precio
                          </span>
                          <span className="text-sm font-black text-indigo-600 leading-none">
                            {step.price}
                          </span>
                        </div>
                      )}
                      <Button
                        variant={
                          step.status === "current"
                            ? step.id === 5
                              ? "secondary"
                              : "default"
                            : "outline"
                        }
                        className={cn(
                          "font-bold transition-all h-9 text-xs",
                          step.status === "completed" ? "px-4 border-2" : "px-5",
                        )}
                        onClick={() => router.push(step.href)}
                      >
                        {step.cta}
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-start pl-[21px] py-0.5">
                    <div
                      className={cn(
                        "w-px h-4",
                        step.status === "completed" ? "bg-green-200" : "bg-border/60",
                      )}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
