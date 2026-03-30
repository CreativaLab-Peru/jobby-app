"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle, XCircle, Sparkles, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getCvProcessingStatus } from "@/features/cv/actions/get-cv-processing-status";
import { useRouteStore } from "@/store/use-route-store";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import {cn} from "@/lib/utils";

// Pasos más descriptivos alineados con el nuevo flujo de Inngest
const STEPS = [
  { text: "Iniciando motores de IA...", icon: Sparkles },
  { text: "Leyendo tu trayectoria del PDF...", icon: FileText },
  { text: "Extrayendo habilidades clave...", icon: Search },
  { text: "Estructurando secciones elegidas...", icon: FileText },
  { text: "Casi listo, finalizando...", icon: CheckCircle },
];

interface CvProcessingScreenProps {
  cvId: string;
}

export function CvProcessingScreen({ cvId }: CvProcessingScreenProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED">("IN_PROGRESS");
  const [stepIndex, setStepIndex] = useState(0);
  const isFinishedRef = useRef(false); // FLAG de seguridad

  const { hydrate } = useRouteStore();

  // Función para finalizar el proceso de forma segura
  const handleSuccess = useCallback(async () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    toast.success("¡Tu CV ha sido procesado con éxito!");

    // Hidratar rutas para que el dashboard/sidebar se actualice
    const routesResult = await getRoutesForUser();
    if (routesResult.success) {
      hydrate(routesResult.routes);
    }

    // Pequeño delay para que el usuario vea la barra al 100%
    setTimeout(() => {
      router.replace(`/cv/${cvId}/preview`);
    }, 1000);
  }, [cvId, router, hydrate]);

  const poll = useCallback(async () => {
    // Si ya terminamos, no seguir consultando
    if (isFinishedRef.current) return;

    const result = await getCvProcessingStatus(cvId);
    if (!result.success) return;

    setStatus(result.status);

    if (result.status === "SUCCEEDED") {
      await handleSuccess();
    } else if (result.status === "FAILED") {
      toast.error("Hubo un error procesando tu CV.");
      isFinishedRef.current = true; // Detener polling en fallo
    }
  }, [cvId, handleSuccess]);

  // Efecto de Polling
  useEffect(() => {
    // Primer poll con un pequeño delay para dar tiempo a que los servicios despierten
    const timeoutId = setTimeout(() => {
      poll();
    }, 1000);

    const intervalId = setInterval(() => {
      if (!isFinishedRef.current) {
        poll();
      }
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [poll]);

  // Animación de los textos informativos
  useEffect(() => {
    if (status === "SUCCEEDED" || status === "FAILED") return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [status]);

  const currentStep = STEPS[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* ── BACKGROUND LAYER (KISS & Clean) ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-secondary/10 pointer-events-none" />

      {/* ── CONTENT LAYER ── */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
      >
        {/* Status Visual */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            {status === "FAILED" ? (
              <motion.div key="failed" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-destructive/10 text-destructive border border-destructive/20 shadow-2xl shadow-destructive/10"
              >
                <XCircle className="h-12 w-12" />
              </motion.div>
            ) : status === "SUCCEEDED" ? (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary border border-primary/20 shadow-2xl shadow-primary/10"
              >
                <CheckCircle className="h-12 w-12" />
              </motion.div>
            ) : (
              <motion.div key="loading" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary border border-primary/20"
              >
                <Loader2 className="h-12 w-12 animate-spin" />
                <div className="absolute inset-0 rounded-[2rem] border-2 border-primary/10 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Textual Information */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {status === "FAILED" ? "Algo no salió bien" : status === "SUCCEEDED" ? "¡Todo listo!" : "Analizando tu perfil"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
            {status === "FAILED"
              ? "No pudimos extraer la información de tu PDF. Intenta con un archivo que no esté protegido por contraseña."
              : status === "SUCCEEDED"
                ? "Hemos terminado de estructurar tu CV. Redirigiéndote a la previsualización..."
                : "Nuestra IA está trabajando para extraer y organizar tu experiencia profesional automáticamente."
            }
          </p>
        </div>

        {/* Step Indicator & Progress */}
        <AnimatePresence mode="wait">
          {status !== "FAILED" && (
            <motion.div key="progress-area" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full space-y-8">

              <div className="flex items-center justify-center gap-3 px-6 py-3 bg-secondary/30 backdrop-blur-md rounded-2xl w-fit mx-auto border border-border/40">
                <StepIcon className={cn("h-5 w-5 text-primary", status !== "SUCCEEDED" && "animate-bounce")} />
                <span className="text-xs font-black tracking-[0.1em] uppercase text-foreground/80">
                  {status === "SUCCEEDED" ? "Procesamiento completado" : currentStep.text}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 rounded-full bg-secondary/40 p-1 border border-border/40 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                  initial={{ width: "10%" }}
                  animate={{ width: status === "SUCCEEDED" ? "100%" : "85%" }}
                  transition={{
                    width: { duration: status === "SUCCEEDED" ? 0.8 : 30, ease: "circOut" }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons for Failure */}
        {status === "FAILED" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button size="lg" onClick={() => router.push("/cv")} className="rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-primary/20">
              Ir al panel
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.reload()} className="rounded-2xl h-14 px-8 font-bold text-lg border-border/60">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Intentar de nuevo
            </Button>
          </motion.div>
        )}
      </motion.main>

      <footer className="absolute bottom-10 text-center opacity-40">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-3 w-3" /> Levely AI Processing System
        </p>
      </footer>
    </div>
  );
}
