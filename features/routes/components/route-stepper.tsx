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
  Rocket,
  Trophy,
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
  hasSubscription?: boolean;
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
  hasSubscription = false,
}: RouteStepperProps) {
  const router = useRouter();

  const isRouteCompleted = routeStatus === "ROADMAP_DONE";

  const steps: Step[] = [
    {
      id: 1,
      title: "Descubre tu perfil profesional",
      description: cvTitle
        ? `CV activo: "${cvTitle}"`
        : "Sube tu CV o crea uno desde cero para analizar tu potencial profesional.",
      href: !cvId ? "/my-cv" : `/cv/${cvId}/preview`,
      icon: FileText,
      status: getStepStatus("CV_PENDING", "CV_CREATED", routeStatus),
      cta: cvId ? "Ver mi CV" : "Subir o crear CV",
    },
    {
      id: 2,
      title: "Optimiza tu perfil",
      description:
        evaluationScore !== null
          ? `Última puntuación: ${evaluationScore}/100`
          : "Nuestra IA analiza tu CV y te muestra cómo hacerlo más competitivo.",
      href: "/my-evaluation",
      icon: BarChart3,
      status: getStepStatus("CV_CREATED", "ANALYSIS_DONE", routeStatus),
      cta: evaluationScore !== null ? "Ver análisis" : "Analizar CV",
    },
    {
      id: 3,
      title: "Encuentra oportunidades que hacen match contigo",
      description:
        opportunitiesCount > 0
          ? `${opportunitiesCount} oportunidades encontradas`
          : "Descubre becas, programas y oportunidades globales alineadas a tu perfil.",
      href: opportunitiesCount === 0 && cvId
        ? "/my-opportunities?match=true"
        : "/my-opportunities",
      icon: Briefcase,
      status: getStepStatus("ANALYSIS_DONE", "OPPORTUNITIES_DONE", routeStatus),
      cta: opportunitiesCount > 0 ? "Ver oportunidades" : "Buscar oportunidades",
    },
    {
      id: 4,
      title: "Conoce tu ruta personalizada",
      description: hasRoadmap
        ? "Tienes un roadmap generado. Revisa los pasos para alcanzar tu meta."
        : "Recibe un roadmap personalizado con los pasos necesarios para acceder a oportunidades globales.",
      href: hasRoadmap ? "/my-roadmaps" : "/my-opportunities",
      icon: Map,
      status: getStepStatus("OPPORTUNITIES_DONE", "ROADMAP_DONE", routeStatus),
      cta: hasRoadmap ? "Ver roadmap" : "Generar roadmap",
    },
    {
      id: 5,
      title: "Programa Talento Global",
      description:
        "Mentoría estratégica 1:1 para acelerar tu perfil y prepararte para oportunidades internacionales.",
      href: "/billing",
      icon: Rocket,
      status: isRouteCompleted && hasSubscription ? "completed" : isRouteCompleted ? "current" : "locked",
      cta: hasSubscription ? "Ver mi plan" : "Conocer programa",
    },
    {
      id: 6,
      title: "Logra tu oportunidad global",
      description:
        "Has optimizado tu perfil, aplicado a oportunidades y avanzado en tu carrera. Tu copiloto de carrera te ayudó a llegar aquí.",
      href: "/dashboard",
      icon: Trophy,
      status: isRouteCompleted && hasSubscription ? "current" : "locked",
      cta: "Ver mi progreso",
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
            description="Sigue estos pasos para completar tu ruta personalizada."
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
                          Activo
                        </span>
                      )}
                      {step.status === "locked" && (
                        <span className="text-xs font-medium text-muted-foreground">
                          Bloqueado
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


