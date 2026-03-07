"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getCvProcessingStatus } from "@/features/cv/actions/get-cv-processing-status";

const STEPS = [
  { text: "Extrayendo texto del PDF...", icon: FileText },
  { text: "Analizando estructura con IA...", icon: Sparkles },
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

  const poll = useCallback(async () => {
    const result = await getCvProcessingStatus(cvId);
    if (!result.success) return;

    setStatus(result.status);

    if (result.status === "SUCCEEDED" || result.hasExtractedData) {
      toast.success("¡Tu CV está listo!");
      router.replace(`/cv/${cvId}/edit`);
    } else if (result.status === "FAILED") {
      toast.error("Hubo un error procesando tu CV.");
    }
  }, [cvId, router]);

  // Poll every 3 seconds
  useEffect(() => {
    poll(); // initial check
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [poll]);

  // Animate step text
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
    <main className="min-h-[90vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-8"
      >
        {/* Icon */}
        <div className="flex justify-center">
          {status === "FAILED" ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          ) : (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight">
            {status === "FAILED" ? "Error al procesar" : "Procesando tu CV"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === "FAILED"
              ? "Ocurrió un problema al analizar tu archivo. Puedes intentarlo de nuevo."
              : "Nuestra IA está analizando y estructurando tu documento. Esto tomará unos segundos."
            }
          </p>
        </div>

        {/* Step indicator */}
        {status !== "FAILED" && (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <StepIcon className="h-4 w-4 text-primary" />
            <span>{currentStep.text}</span>
          </motion.div>
        )}

        {/* Progress bar */}
        {status !== "FAILED" && (
          <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "5%" }}
              animate={{ width: status === "SUCCEEDED" ? "100%" : "85%" }}
              transition={{ duration: status === "SUCCEEDED" ? 0.5 : 30, ease: "linear" }}
            />
          </div>
        )}

        {/* Actions */}
        {status === "FAILED" && (
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/cv")} className="font-semibold">
              Volver a Mis CVs
            </Button>
            <Button variant="ghost" onClick={() => router.back()} className="text-xs text-muted-foreground">
              Intentar de nuevo
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  );
}

