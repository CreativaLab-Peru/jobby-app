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
  routeId: string;
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
  routeId,
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

  const resolvedRoute = activeRoute?.id === routeId ? activeRoute : null;
  const resolvedStatus = resolvedRoute?.status ?? routeStatus;
  const resolvedCv = resolvedRoute?.cv ?? null;
  const resolvedCvId = resolvedCv?.id ?? cvId;
  const resolvedCvTitle = resolvedCv?.title ?? cvTitle;
  const resolvedEvaluationScore =
    resolvedCv?.evaluations?.[0]?.overallScore ?? evaluationScore;
  const resolvedOpportunitiesCount =
    resolvedCv?._count?.opportunities ?? opportunitiesCount;

  // Verificamos si hay alguna tarea en curso para este CV o Ruta
  const activeTask = Object.values(tasks).find((t) => {
    if (t.status !== "IN_PROGRESS") return false;

    return (
      t.scopeId === resolvedCvId ||
      t.metadata?.cvId === resolvedCvId ||
      (activeRoute?.id && t.metadata?.routeId === activeRoute.id) ||
      (activeRoute?.id && t.scopeId === activeRoute.id)
    );
  });

  const isProcessing = !!activeTask;
  const processingStepId = activeTask
    ? activeTask.type === "CV_PROCESSING"
      ? 1
      : activeTask.type === "ANALYSIS" || activeTask.type === "PROGRESS_TIMELINE"
        ? 2
        : activeTask.type === "QUICK_MATCH"
          ? 3
          : activeTask.type === "ROADMAP_GENERATION"
            ? 4
            : null
    : null;

  const processingLabel = activeTask
    ? activeTask.type === "CV_PROCESSING"
      ? "Trabajando en el CV..."
      : activeTask.type === "PROGRESS_TIMELINE"
        ? "Analizando CV..."
        : activeTask.type === "QUICK_MATCH"
          ? "Buscando oportunidades..."
          : activeTask.type === "ROADMAP_GENERATION"
            ? "Generando roadmap..."
            : activeTask.type === "ANALYSIS"
              ? "Analizando perfil..."
              : "Proceso en curso..."
    : "";

  const isRoadmapDone = resolvedStatus === "ROADMAP_DONE";
  const isFullCompleted = resolvedStatus === "PROGRAM_DONE";

  const isStarterPlan = planTier === "STARTER";
  const starterLimitReached = isStarterPlan && generatedRoadmapsCount >= 1;

  const baseSteps: Step[] = [
    {
      id: 1,
      title: "Descubre tu perfil profesional",
      description: cvTitle
        ? `CV activo: "${cvTitle}"`
        : "Sube tu CV o crea uno desde cero para analizar tu potencial",
      href: !resolvedCvId ? "/my-cv" : `/cv/${resolvedCvId}/preview`,
      icon: FileText,
      status: getStepStatus("CV_PENDING", "CV_CREATED", resolvedStatus),
      cta: resolvedCvId ? "Ver mi CV" : "Subir o crear CV",
      expanded: {
        isReady: !!resolvedCvId,
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
      href:
        resolvedEvaluationScore !== null ? "/my-evaluation" : "/my-evaluation?analyze=true",
      icon: BarChart3,
      status: getStepStatus("CV_CREATED", "ANALYSIS_DONE", resolvedStatus),
      cta: resolvedEvaluationScore !== null ? "Ver análisis" : "Analizar CV",
      expanded: {
        isReady: resolvedEvaluationScore !== null,
        readyTitle: "Análisis completado. Tienes acceso a:",
        pendingTitle: "Con el análisis de IA obtendrás:",
        benefits: ["Fortalezas y debilidades", "Sugerencias de mejora", "Puntuación competitiva"],
        primaryAction: {
          label: "Analizar mi CV",
          readyLabel: "Ver mi análisis",
          onClick: () =>
            router.push(
              resolvedEvaluationScore !== null ? "/my-evaluation" : "/my-evaluation?analyze=true",
            ),
        },
      },
    },
    {
      id: 3,
      title: "Encuentra oportunidades con match",
      description: "Becas y programas alineados a tu perfil real",
      href:
        resolvedOpportunitiesCount > 0 ? "/my-opportunities" : "/my-opportunities?match=true",
      icon: Briefcase,
      status: getStepStatus("ANALYSIS_DONE", "OPPORTUNITIES_DONE", resolvedStatus),
      cta:
        resolvedOpportunitiesCount > 0 ? "Ver oportunidades" : "Buscar oportunidades",
      expanded: {
        isReady: resolvedOpportunitiesCount > 0,
        readyTitle: "Oportunidades encontradas. Revisa:",
        pendingTitle: "Encontraremos para ti:",
        benefits: ["Becas recomendadas", "Match por habilidades", "Filtros inteligentes"],
        primaryAction: {
          label: "Buscar oportunidades con match",
          readyLabel: "Ver mis oportunidades",
          onClick: () =>
            router.push(
              resolvedOpportunitiesCount > 0
                ? "/my-opportunities"
                : "/my-opportunities?match=true",
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
      status: getStepStatus("OPPORTUNITIES_DONE", "ROADMAP_DONE", resolvedStatus),
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

  const steps: Step[] = baseSteps.map((step) => {
    // Si hay un proceso activo, forzamos el bloqueo estricto
    if (processingStepId !== null) {
      if (step.id === processingStepId) {
        return { ...step, status: "current" as StepStatus };
      } else if (step.id > processingStepId) {
        return { ...step, status: "locked" as StepStatus };
      }
    }
    return step;
  });

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title={routeName}
            description="Sigue estos pasos para completar tu ruta personalizada."
            actions={
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Guía con IA
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={cn(
                    "relative flex flex-col md:flex-row items-start gap-5 p-6 rounded-2xl border transition-all duration-500",
                    step.status === "completed" &&
                    "bg-gradient-to-r from-green-50/30 to-background border-green-100 dark:from-green-950/5 dark:border-green-900/30 opacity-90 hover:opacity-100",
                    step.status === "current" &&
                    (step.id === 5
                      ? "bg-gradient-to-br from-indigo-50/80 via-white to-background dark:from-indigo-950/20 dark:to-background border-indigo-300 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                      : "bg-gradient-to-br from-primary/10 via-primary/[0.02] to-background border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/30"),
                    step.status === "locked" &&
                    "bg-muted/10 border-border/40 opacity-40 grayscale-[0.5]",
                  )}
                >
                  {/* Icono del paso */}
                  <div
                    className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-xl shrink-0 transition-all duration-500",
                      step.status === "completed" &&
                      "bg-green-100 text-green-600 dark:bg-green-900/30",
                      step.status === "current" &&
                      (step.id === 5
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                        : "bg-primary text-primary-foreground shadow-lg shadow-primary/40"),
                      step.status === "locked" && "bg-muted/50 text-muted-foreground",
                      step.status === "current" && "scale-110 rotate-3",
                    )}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : step.status === "locked" ? (
                      <Lock className="h-5 w-5" />
                    ) : step.id === 5 ? (
                      <Sparkles className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Paso {step.id}
                      </span>
                      {step.status === "completed" && (
                        <span className="text-[10px] bg-primary/80 font-bold text-white dark:bg-accent/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Completado
                        </span>
                      )}
                      {step.status === "current" && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse",
                            step.id === 1
                              ? "text-green-700 bg-green-500/20"
                              : step.id === 5
                                ? "text-indigo-700 bg-indigo-500/20"
                                : "text-primary-foreground bg-primary px-2 shadow-sm",
                          )}
                        >
                          {step.id === 4 && routeStatus === "ROADMAP_IN_PROGRESS"
                            ? "En progreso"
                            : "Activo ahora"}
                        </span>
                      )}
                      {step.status === "locked" && (
                        <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
                          {step.id === 2 && "Se desbloquea al subir tu CV"}
                          {step.id === 3 && "Se desbloquea al optimizar"}
                          {step.id === 4 && "Se desbloquea al ver matches"}
                          {step.id === 5 && (
                            <span className="text-indigo-600/70 font-black">{step.tierLabel}</span>
                          )}
                          {![2, 3, 4, 5].includes(step.id) && "Bloqueado"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>

                    {step.status === "current" && step.expanded && (
                      <div className="mt-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="default"
                            className={cn(
                              "h-12 px-22 text-sm font-bold rounded-xl shadow-md transition-all",
                              isProcessing
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70 border-2 border-dashed border-border"
                                : "bg-primary hover:bg-primary/90 hover:scale-[1.02]",
                            )}
                            onClick={step.expanded.primaryAction.onClick}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                              step.expanded.primaryAction.icon && (
                                <step.expanded.primaryAction.icon className="mr-2 h-5 w-5" />
                              )
                            )}
                            {isProcessing
                              ? processingLabel
                              : step.expanded.isReady
                                ? step.expanded.primaryAction.readyLabel
                                : step.expanded.primaryAction.label}
                            {!isProcessing &&
                              step.expanded.isReady &&
                              !step.expanded.primaryAction.icon && (
                                <ArrowRight className="ml-2 h-5 w-5" />
                              )}
                          </Button>

                          {step.expanded.secondaryAction && !step.expanded.isReady && (
                            <Button
                              variant="secondary"
                              className={cn(
                                "px-22 h-12 text-sm font-bold rounded-xl border-2 shadow-sm transition-all", // Reducido de py-7 a h-12
                                isProcessing
                                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50 border-dashed"
                                  : "hover:scale-[1.02]",
                              )}
                              onClick={step.expanded.secondaryAction.onClick}
                              disabled={isProcessing}
                            >
                              {step.expanded.secondaryAction.icon && (
                                <step.expanded.secondaryAction.icon className="mr-2 h-5 w-5" />
                              )}
                              {step.expanded.secondaryAction.label}
                            </Button>
                          )}
                        </div>

                        <div className="pt-5 border-t border-dashed border-primary/20">
                          <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-3">
                            {step.expanded.isReady
                              ? step.expanded.readyTitle
                              : step.expanded.pendingTitle}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.expanded.benefits.map((benefit, idx) => (
                              <Badge
                                key={benefit}
                                variant="secondary"
                                className={cn(
                                  "font-bold border-none py-1 px-3",
                                  idx === 0
                                    ? "bg-levely-blue/10 text-primary"
                                    : idx === 1
                                      ? "bg-accent/10 text-primary"
                                      : "bg-secondary/20 text-secondary-foreground",
                                )}
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
                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 shrink-0 self-stretch md:self-center pt-4 md:pt-0 md:pl-5 border-t md:border-t-0 md:border-l border-border/50 mt-4 md:mt-0">
                      {step.id === 5 && step.price && (
                        <div className="flex flex-col items-start md:items-end flex-1 md:flex-none">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                            Precio
                          </span>
                          <span className="text-base font-black text-indigo-600">{step.price}</span>
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
                          "font-bold transition-all shadow-sm w-full md:w-auto",
                          step.status === "completed"
                            ? "px-5 h-10 border-2 hover:bg-primary/5 hover:border-primary/50"
                            : "px-6 h-11",
                        )}
                        disabled={isProcessing && step.status !== "completed"}
                        onClick={() => {
                          startTransition(() => {
                            router.push(step.href);
                          });
                        }}
                      >
                        {isProcessing && step.status !== "completed" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isProcessing && step.status !== "completed" ? "Procesando..." : step.cta}
                        {(!isProcessing || step.status === "completed") && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {i < steps.length - 1 && (
                  <div className="flex justify-start pl-10 py-1">
                    <div
                      className={cn(
                        "w-0.5 h-6 rounded-full",
                        step.status === "completed"
                          ? "bg-green-300 dark:bg-green-700"
                          : "bg-border",
                      )}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <CreateCVModal />
      <UploadCVModal reset={() => router.refresh()} />
    </main>
  );
}
