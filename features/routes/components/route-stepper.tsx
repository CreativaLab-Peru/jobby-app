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


//"use client";
//
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import {
//   FileText,
//   BarChart3,
//   Briefcase,
//   CheckCircle2,
//   ArrowRight,
//   Lock,
//   Sparkles,
//   Map,
//   Circle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { RouteStatus } from "@prisma/client";
// import { PageHeader } from "@/components/shared/page-header";
//
// type StepStatus = "completed" | "current" | "locked";
//
// interface Step {
//   id: number;
//   title: string;
//   description: string;
//   href: string;
//   icon: React.ComponentType<{ className?: string }>;
//   status: StepStatus;
//   cta: string;
// }
//
// interface RouteStepperProps {
//   routeName: string;
//   routeStatus: RouteStatus;
//   cvId: string | null;
//   cvTitle: string | null;
//   evaluationScore: number | null;
//   opportunitiesCount: number;
//   hasRoadmap?: boolean;
// }
//
// const STATUS_ORDER: RouteStatus[] = [
//   "CV_PENDING",
//   "CV_CREATED",
//   "ANALYSIS_PENDING",
//   "ANALYSIS_DONE",
//   "OPPORTUNITIES_PENDING",
//   "OPPORTUNITIES_DONE",
//   "ROADMAP_PENDING",
//   "ROADMAP_DONE",
// ];
//
// function getStepStatus(
//   stepRequires: RouteStatus,
//   stepCompleted: RouteStatus,
//   currentStatus: RouteStatus,
// ): StepStatus {
//   const current = STATUS_ORDER.indexOf(currentStatus);
//   const completed = STATUS_ORDER.indexOf(stepCompleted);
//   const requires = STATUS_ORDER.indexOf(stepRequires);
//
//   if (current >= completed) return "completed";
//   if (current >= requires) return "current";
//   return "locked";
// }
//
// /** Calculates overall progress percentage (0–100) */
// function getOverallProgress(steps: Step[]): number {
//   const completed = steps.filter((s) => s.status === "completed").length;
//   return Math.round((completed / steps.length) * 100);
// }
//
// export default function RouteStepper({
//   routeName,
//   routeStatus,
//   cvId,
//   cvTitle,
//   evaluationScore,
//   opportunitiesCount,
//   hasRoadmap = false,
// }: RouteStepperProps) {
//   const router = useRouter();
//
//   const steps: Step[] = [
//     {
//       id: 1,
//       title: "Crear o subir tu CV",
//       description: cvTitle
//         ? `CV activo: "${cvTitle}"`
//         : "Crea un CV desde cero o sube uno existente para comenzar.",
//       href: "/my-cvs",
//       icon: FileText,
//       status: getStepStatus("CV_PENDING", "CV_CREATED", routeStatus),
//       cta: cvId ? "Ver mi CV" : "Crear CV",
//     },
//     {
//       id: 2,
//       title: "Análisis y corrección",
//       description:
//         evaluationScore !== null
//           ? `Última puntuación: ${evaluationScore}/100`
//           : "La IA analizará tu CV y te dará recomendaciones para mejorarlo.",
//       href: "/my-evaluations",
//       icon: BarChart3,
//       status: getStepStatus("CV_CREATED", "ANALYSIS_DONE", routeStatus),
//       cta: evaluationScore !== null ? "Ver análisis" : "Analizar CV",
//     },
//     {
//       id: 3,
//       title: "Match de oportunidades",
//       description:
//         opportunitiesCount > 0
//           ? `${opportunitiesCount} oportunidades encontradas`
//           : "Encuentra becas y pasantías alineadas a tu perfil.",
//       href: "/my-opportunities",
//       icon: Briefcase,
//       status: getStepStatus("ANALYSIS_DONE", "OPPORTUNITIES_DONE", routeStatus),
//       cta: opportunitiesCount > 0 ? "Ver oportunidades" : "Buscar oportunidades",
//     },
//     {
//       id: 4,
//       title: "Roadmap personalizado",
//       description: hasRoadmap
//         ? "Tienes un roadmap generado. Revísalo en tu oportunidad."
//         : "Genera un plan paso a paso con IA para alcanzar tu meta.",
//       href: "/my-opportunities",
//       icon: Map,
//       status: getStepStatus("OPPORTUNITIES_DONE", "ROADMAP_DONE", routeStatus),
//       cta: hasRoadmap ? "Ver oportunidades" : "Elegir oportunidad",
//     },
//   ];
//
//   const progress = getOverallProgress(steps);
//   const allDone = progress === 100;
//
//   return (
//     <main className="min-h-[90vh] p-4 md:p-8">
//       <div className="mx-auto max-w-3xl">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-8"
//         >
//           <PageHeader
//             title={routeName}
//             description="Completa cada paso para avanzar en tu ruta profesional."
//             actions={
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Sparkles className="h-4 w-4 text-primary" />
//                 Guía con IA
//               </div>
//             }
//           />
//
//           {/* ── Overall Progress ─────────────────────────── */}
//           <motion.div
//             initial={{ opacity: 0, y: 6 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.05 }}
//             className={cn(
//               "rounded-xl border p-4",
//               allDone
//                 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
//                 : "border-border bg-card",
//             )}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//                 Progreso general
//               </span>
//               <span
//                 className={cn(
//                   "text-sm font-bold",
//                   allDone ? "text-green-600" : "text-primary",
//                 )}
//               >
//                 {progress}%
//               </span>
//             </div>
//             <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
//               <motion.div
//                 className={cn(
//                   "h-full rounded-full",
//                   allDone ? "bg-green-500" : "bg-primary",
//                 )}
//                 initial={{ width: 0 }}
//                 animate={{ width: `${Math.max(progress, 2)}%` }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//               />
//             </div>
//             {allDone && (
//               <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1.5">
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//                 ¡Ruta completada! Has finalizado todos los pasos.
//               </p>
//             )}
//           </motion.div>
//
//           {/* ── Timeline Steps ───────────────────────────── */}
//           <div className="relative">
//             {steps.map((step, i) => {
//               const isLast = i === steps.length - 1;
//
//               return (
//                 <motion.div
//                   key={step.id}
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 + i * 0.08 }}
//                   className="relative flex gap-4 md:gap-5"
//                 >
//                   {/* ── Left: Timeline rail ── */}
//                   <div className="flex flex-col items-center pt-1">
//                     {/* Dot */}
//                     <div
//                       className={cn(
//                         "relative z-10 flex items-center justify-center rounded-full shrink-0 transition-all",
//                         step.status === "completed" &&
//                           "h-8 w-8 bg-green-500 text-white",
//                         step.status === "current" &&
//                           "h-9 w-9 bg-primary text-primary-foreground ring-4 ring-primary/20",
//                         step.status === "locked" &&
//                           "h-8 w-8 bg-muted border-2 border-border text-muted-foreground",
//                       )}
//                     >
//                       {step.status === "completed" ? (
//                         <CheckCircle2 className="h-4 w-4" />
//                       ) : step.status === "locked" ? (
//                         <Lock className="h-3.5 w-3.5" />
//                       ) : (
//                         <step.icon className="h-4 w-4" />
//                       )}
//                     </div>
//
//                     {/* Connector line */}
//                     {!isLast && (
//                       <div
//                         className={cn(
//                           "w-0.5 flex-1 min-h-[24px] rounded-full my-1",
//                           step.status === "completed"
//                             ? "bg-green-400 dark:bg-green-600"
//                             : "bg-border",
//                         )}
//                       />
//                     )}
//                   </div>
//
//                   {/* ── Right: Step content ── */}
//                   <div
//                     className={cn(
//                       "flex-1 rounded-xl border p-4 mb-4 transition-all",
//                       step.status === "completed" &&
//                         "bg-green-50/50 dark:bg-green-950/10 border-green-200/60 dark:border-green-800/40",
//                       step.status === "current" &&
//                         "bg-card border-primary/30 shadow-sm shadow-primary/5",
//                       step.status === "locked" &&
//                         "bg-muted/20 border-border/40 opacity-50",
//                     )}
//                   >
//                     {/* Header row */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-0.5 flex-wrap">
//                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
//                             Paso {step.id}
//                           </span>
//                           {step.status === "completed" && (
//                             <span className="text-[10px] font-semibold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full leading-none">
//                               ✓ Listo
//                             </span>
//                           )}
//                           {step.status === "current" && (
//                             <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none flex items-center gap-1">
//                               <Circle className="h-1.5 w-1.5 fill-current" />
//                               En curso
//                             </span>
//                           )}
//                         </div>
//                         <h3
//                           className={cn(
//                             "text-sm font-bold leading-snug",
//                             step.status === "locked"
//                               ? "text-muted-foreground"
//                               : "text-foreground",
//                           )}
//                         >
//                           {step.title}
//                         </h3>
//                         <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
//                           {step.description}
//                         </p>
//                       </div>
//
//                       {/* CTA Button */}
//                       {step.status !== "locked" && (
//                         <Button
//                           variant={step.status === "current" ? "default" : "ghost"}
//                           size="sm"
//                           className={cn(
//                             "shrink-0 text-xs h-8",
//                             step.status === "completed" &&
//                               "text-green-700 dark:text-green-400 hover:text-green-800",
//                           )}
//                           onClick={() => router.push(step.href)}
//                         >
//                           {step.cta}
//                           <ArrowRight className="ml-1 h-3 w-3" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </motion.div>
//       </div>
//     </main>
//   );
// }
