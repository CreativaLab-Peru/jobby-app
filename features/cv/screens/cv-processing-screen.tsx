"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle, XCircle, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getCvProcessingStatus } from "@/features/cv/actions/get-cv-processing-status";
import {useRouteStore} from "@/store/use-route-store";
import {getRoutesForUser} from "@/features/routes/actions/get-routes-for-user";

const STEPS = [
  { text: "Analizando el contenido...", icon: FileText },
  { text: "Extrayendo texto del PDF...", icon: Sparkles },
  { text: "Organizando secciones...", icon: FileText },
  { text: "Finalizando procesamiento...", icon: CheckCircle },
];

interface CvProcessingScreenProps {
  cvId: string;
}

export function CvProcessingScreen({ cvId }: CvProcessingScreenProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED">("IN_PROGRESS");
  const [stepIndex, setStepIndex] = useState(0);

  const {hydrate} = useRouteStore();

  const poll = useCallback(async () => {
    const result = await getCvProcessingStatus(cvId);
    if (!result.success) return;

    setStatus(result.status);

    if (result.status === "SUCCEEDED" || result.hasExtractedData) {
      toast.success("¡Tu CV está listo!");

      const routesResult = await getRoutesForUser();
      if (!routesResult.success) {
        toast.error("CV procesado, pero hubo un error cargando tus rutas. Intenta refrescando la página.");
        return;
      }
      hydrate(routesResult.routes);

      router.replace(`/cv/${cvId}/preview`);
    } else if (result.status === "FAILED") {
      toast.error("Hubo un error procesando tu CV.");
    }
  }, [cvId, router]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [poll]);

  useEffect(() => {
    if (status === "SUCCEEDED" || status === "FAILED") return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [status]);

  const currentStep = STEPS[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* ── BACKGROUND LAYER ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-secondary/10 pointer-events-none" />

      {/* ── CONTENT LAYER ── */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
      >
        {/* Status Visual */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            {status === "FAILED" ? (
              <motion.div
                key="failed"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-inner"
              >
                <XCircle className="h-12 w-12" />
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary"
              >
                <Loader2 className="h-12 w-12 animate-spin" />
                <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Textual Information */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {status === "FAILED" ? "Algo no salió bien" : "Subiendo tu cv"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto font-medium">
            {status === "FAILED"
              ? "No pudimos procesar el documento. Asegúrate de que el archivo no esté protegido o dañado."
              : "Tu CV esta siendo procesado. Asegúrate de que el archivo sea un pdf"
            }
          </p>
        </div>

        {/* Step Indicator & Progress */}
        <AnimatePresence mode="wait">
          {status !== "FAILED" && (
            <motion.div
              key="progress-area"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-8"
            >
              {/* Active Step */}
              <div className="flex items-center justify-center gap-3 px-6 py-3 bg-secondary/20 rounded-2xl w-fit mx-auto border border-secondary/30">
                <StepIcon className="h-5 w-5 text-primary animate-bounce" />
                <span className="text-sm font-bold tracking-wide uppercase text-secondary-foreground">
                  {currentStep.text}
                </span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="w-full h-3 rounded-full bg-secondary/30 p-1 border border-secondary/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                  initial={{ width: "5%" }}
                  animate={{ width: status === "SUCCEEDED" ? "100%" : "90%" }}
                  transition={{
                    width: { duration: status === "SUCCEEDED" ? 0.5 : 40, ease: "easeInOut" }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons for Failure */}
        {status === "FAILED" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push("/cv")}
              className="rounded-2xl h-14 px-8 font-bold text-lg bg-primary shadow-lg shadow-primary/20 hover:opacity-90"
            >
              Volver al panel
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-2xl h-14 px-8 font-bold text-lg border-secondary/50 hover:bg-secondary/10"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Reintentar
            </Button>
          </motion.div>
        )}
      </motion.main>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 text-center">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground/40 flex items-center gap-2">
          <Sparkles className="h-3 w-3" /> Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
}
