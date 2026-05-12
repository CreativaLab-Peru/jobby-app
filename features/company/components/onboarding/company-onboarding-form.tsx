"use client";

import {useEffect, useState, useTransition} from "react";
import {useCompanyOnboardingStore} from "../../store/company-onboarding-store";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Loader2, ArrowRight, ArrowLeft, CheckCircle2} from "lucide-react";
import {toast} from "sonner";
import {StepIdentity} from "./step-identity";
import {StepPurpose} from "./step-purpose";
import {StepTeam} from "./step-team";
import {completeCompanyOnboardingAction} from "../../actions/complete-company-onboarding.action";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

const TOTAL_STEPS = 3;

interface CompanyOnboardingFormProps {
  initialData: {
    id: string;
    name?: string;
    slug?: string;
    logoUrl?: string;
    ruc?: string;
    website?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }
}

export function CompanyOnboardingForm({initialData}: CompanyOnboardingFormProps) {
  const {
    step,
    setStep,
    formData,
    validateCurrentStep,
    isStepValid,
    reset,
    updateFormData
  } = useCompanyOnboardingStore();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Soluciona el error de Hydration Mismatch esperando a que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true);
    updateFormData(initialData)
  }, []);

  const handleNext = async () => {
    if (step === TOTAL_STEPS) {
      handleFinalize();
      return;
    }

    const validation = validateCurrentStep();
    if (validation.success) {
      setStep(step + 1);
      window.scrollTo({top: 0, behavior: "smooth"});
    } else {
      toast.error(validation.error);
    }
  };

  const handleFinalize = () => {
    const validation = validateCurrentStep();
    if (!validation.success) {
      toast.error(validation.error);
      return;
    }

    startTransition(async () => {
      try {
        const result = await completeCompanyOnboardingAction(initialData.id, formData);
        if (result.success) {
          toast.success("¡Empresa creada con éxito!");
          reset();
          router.push(`/c/${initialData.slug}/dashboard`);
        } else {
          toast.error(result.error || "Ocurrió un error al crear la empresa");
        }
      } catch (error) {
        console.error("Onboarding Error:", error);
        toast.error("Error inesperado en el proceso");
      }
    });
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        <p className="text-muted-foreground text-sm font-medium">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      {/* Header y Progreso */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-1">
              Empresas
            </h1>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Configura tu organización
            </p>
          </div>
          <div
            className="flex items-center gap-4 bg-card/50 border border-border/40 px-6 py-3 rounded-2xl shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                Paso {step} de {TOTAL_STEPS}
              </p>
              <p className="text-sm font-bold">
                {Math.round((step / TOTAL_STEPS) * 100)}% Completado
              </p>
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="w-32 h-2.5"/>
          </div>
        </div>
      </div>

      <div className="py-4">
        {step === 1 && <StepIdentity/>}
        {step === 2 && <StepPurpose/>}
        {step === 3 && <StepTeam/>}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-10 border-t border-border/40">
        <Button
          variant="ghost"
          size="lg"
          disabled={step === 1 || isPending}
          onClick={() => setStep(step - 1)}
          className="text-muted-foreground hover:text-foreground h-14 px-8 rounded-2xl font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="mr-2 h-5 w-5"/> Regresar
        </Button>

        <Button
          size="lg"
          disabled={isPending || !isStepValid()}
          onClick={handleNext}
          className={cn(
            "h-14 px-10 rounded-2xl font-bold shadow-xl transition-all active:scale-95",
            step === TOTAL_STEPS
              ? "bg-accent hover:bg-accent/90 shadow-accent/20"
              : "bg-primary hover:bg-primary/90 shadow-primary/20",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin"/> Procesando...
            </>
          ) : step === TOTAL_STEPS ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5"/> Finalizar Registro
            </>
          ) : (
            <>
              Continuar <ArrowRight className="ml-2 h-5 w-5"/>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
