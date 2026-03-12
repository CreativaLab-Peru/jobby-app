"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RouteStatus } from "@prisma/client";
import { PageHeader } from "@/components/shared/page-header";

type StepStatus = "completed" | "current" | "locked";

interface Step {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
  cta: string;
}

interface RouteStepperProps {
  routeName: string;
  routeStatus: RouteStatus;
  cvId: string | null;
  cvTitle: string | null;
  evaluationScore: number | null;
  opportunitiesCount: number;
  hasRoadmap?: boolean;
}

const STATUS_ORDER: RouteStatus[] = [
  "CV_PENDING",
  "CV_CREATED",
  "ANALYSIS_PENDING",
  "ANALYSIS_DONE",
  "OPPORTUNITIES_PENDING",
  "OPPORTUNITIES_DONE",
  "ROADMAP_PENDING",
  "ROADMAP_DONE",
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
}: RouteStepperProps) {
  const router = useRouter();

  const steps: Step[] = [
    {
      id: 1,
      title: "Crear o subir tu CV",
      description: cvTitle
        ? `CV activo: "${cvTitle}"`
        : "Crea un CV desde cero o sube uno existente para comenzar.",
      href: "/my-cvs",
      icon: FileText,
      status: getStepStatus("CV_PENDING", "CV_CREATED", routeStatus),
      cta: cvId ? "Ver mi CV" : "Crear CV",
    },
    {
      id: 2,
      title: "Análisis y corrección",
      description:
        evaluationScore !== null
          ? `Última puntuación: ${evaluationScore}/100`
          : "La IA analizará tu CV y te dará recomendaciones para mejorarlo.",
      href: "/my-evaluations",
      icon: BarChart3,
      status: getStepStatus("CV_CREATED", "ANALYSIS_DONE", routeStatus),
      cta: evaluationScore !== null ? "Ver análisis" : "Analizar CV",
    },
    {
      id: 3,
      title: "Match de oportunidades",
      description:
        opportunitiesCount > 0
          ? `${opportunitiesCount} oportunidades encontradas`
          : "Encuentra vacantes, becas y pasantías que se alinean con tu perfil.",
      href: "/my-opportunities",
      icon: Briefcase,
      status: getStepStatus("ANALYSIS_DONE", "OPPORTUNITIES_DONE", routeStatus),
      cta: opportunitiesCount > 0 ? "Ver oportunidades" : "Buscar oportunidades",
    },
    {
      id: 4,
      title: "Roadmap personalizado",
      description: hasRoadmap
        ? "Tienes un roadmap generado. Revísalo en el detalle de tu oportunidad."
        : "Selecciona una oportunidad y genera un plan paso a paso con IA.",
      href: "/my-opportunities",
      icon: Map,
      status: getStepStatus("OPPORTUNITIES_DONE", "ROADMAP_DONE", routeStatus),
      cta: hasRoadmap ? "Ver oportunidades" : "Elegir oportunidad",
    },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title={routeName}
            description="Sigue estos pasos para completar tu ruta profesional."
            actions={
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Guía con IA
              </div>
            }
          />

          {/* Stepper Cards */}
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
                    "relative flex items-start gap-5 p-6 rounded-2xl border transition-all",
                    step.status === "completed" &&
                      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                    step.status === "current" &&
                      "bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/10",
                    step.status === "locked" &&
                      "bg-muted/30 border-border/50 opacity-60",
                  )}
                >
                  {/* Step number / status */}
                  <div
                    className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-xl shrink-0",
                      step.status === "completed" && "bg-green-500/15 text-green-600",
                      step.status === "current" && "bg-primary/15 text-primary",
                      step.status === "locked" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : step.status === "locked" ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Paso {step.id}
                      </span>
                      {step.status === "completed" && (
                        <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                          Completado
                        </span>
                      )}
                      {step.status === "current" && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          En curso
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>

                  {/* Action */}
                  {step.status !== "locked" && (
                    <Button
                      variant={step.status === "current" ? "default" : "outline"}
                      size="sm"
                      className="shrink-0 self-center"
                      onClick={() => router.push(step.href)}
                    >
                      {step.cta}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Connector line */}
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
    </main>
  );
}

