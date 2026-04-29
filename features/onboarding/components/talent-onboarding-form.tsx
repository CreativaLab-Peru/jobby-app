"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"; // Añadimos useState
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.action";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

// Componentes de los pasos
import { WelcomeStep } from "@/features/onboarding/components/welcome-step";
import { BasicDataStep } from "@/features/onboarding/components/basic-data-step";
import { AreaAndRoleStep } from "@/features/onboarding/components/area-and-role-step";
import { ExperienceLevelStep } from "@/features/onboarding/components/experience-level-step";
import { ModalityStep } from "@/features/onboarding/components/modality-step";
import { AvailabilityStep } from "@/features/onboarding/components/availability-step";
import { AccountStep } from "@/features/onboarding/components/account-step";
import { authClient } from "@/lib/auth-client";
import { checkExistingUser } from "@/features/authentication/actions/existing-user";
import { getUserByEmail } from "@/features/authentication/actions/get-user-by-email";
import { verifyOAuthUser } from "@/features/authentication/actions/verify-oauth-user";
import { OpportunityTypeStep } from "@/features/onboarding/components/opportunity-type-step";
import { getTempAnalysisByUserEmail } from "@/features/onboarding/actions/get-temp-analysis";
import { routes } from "@/lib/routes";

const TOTAL_STEPS = 5;

export function OnboardingForm() {
  const {
    step,
    setStep,
    formData,
    reset,
    validateCurrentStep,
    setErrors,
    updateFormData,
    setIsOAuth,
    isOAuth,
    isStepValid,
  } = useOnboardingStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * 1. Lógica de Verificación de Sesión (Memoizada)
   * Evita llamadas redundantes y maneja el estado de carga inicial.
   */
  const initSession = useCallback(async () => {
    try {
      // Usamos .get({ ... }) si tu versión de Better Auth lo permite para ser más directo
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const { email, name, image } = session.data.user;
        setIsOAuth(true);
        updateFormData({ email, name, image });
      } else {
        setIsOAuth(false);
      }
    } catch (e) {
      // Silencioso: Si falla, el usuario simplemente completa el form manualmente
      console.warn("[ONBOARDING_SESSION_INIT_SILENT_FAIL]");
    } finally {
      setIsInitializing(false);
    }
  }, [setIsOAuth, updateFormData]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    const becaParam = searchParams.get("beca");
    if (!becaParam) return;

    const trimmed = becaParam.trim();
    if (!trimmed || formData.beca) return;

    updateFormData({ beca: trimmed });
  }, [formData.beca, searchParams, updateFormData]);

  /**
   * 2. Finalización del Onboarding
   * Refactorizado para ser lineal y evitar múltiples llamadas a getSession.
   */
  const handleFinalize = async () => {
    setErrors({});

    // Validación de UI
    const validation = validateCurrentStep();
    if (!validation.success) {
      toast.error(validation.error || "Revisa los campos");
      return;
    }

    startTransition(async () => {
      try {
        // Capturamos la sesión UNA sola vez aquí
        const sessionResponse = await authClient.getSession();
        const sessionUser = sessionResponse?.data?.user;

        let userId: string;
        const isOAuthFlow = !!sessionUser;

        if (isOAuthFlow) {
          userId = sessionUser.id;
        } else {
          // Flujo Email/Password
          const existing = await checkExistingUser(formData.email);
          if (existing.exists) {
            toast.error("El correo ya está registrado.");
            return;
          }

          const signUp = await authClient.signUp.email({
            email: formData.email,
            password: formData.password!,
            name: formData.name,
          });

          if (signUp?.error) {
            toast.error(signUp.error.message || "Error al crear cuenta");
            return;
          }

          // Obtenemos el ID del usuario recién creado
          const dbUser = await getUserByEmail(formData.email);
          if (!dbUser) throw new Error("User not found after signup");
          userId = dbUser.id;
        }

        // Ejecutar Acción de Servidor (Onboarding)
        const result = await completeOnboardingAction(userId, formData);
        if (result.error) {
          toast.error(result.error);
          return;
        }

        // Si es OAuth, marcamos como verificado
        if (isOAuthFlow) await verifyOAuthUser(userId);

        toast.success("¡Perfil listo!");

        // 3. Lógica de Redirección Inteligente
        if (isOAuthFlow) {
          const tempAnalysis = await getTempAnalysisByUserEmail({ email: formData.email });

          if (tempAnalysis.success && tempAnalysis.data) {
            const { tempCvEvaluationId, temporalUserId } = tempAnalysis.data;
            router.push(`/users/${temporalUserId}/analysis/${tempCvEvaluationId}/loading`);
          } else {
            router.push(routes.app.dashboard);
          }
        } else {
          router.push("/login?onboarding=completed");
        }

        // Limpieza suave
        setTimeout(() => reset(), 1000);
      } catch (error) {
        console.error("Finalize Error:", error);
        toast.error("Error inesperado en el proceso");
      }
    });
  };

  /**
   * 4. Manejo de Navegación entre pasos
   */
  const handleNext = async () => {
    if (step === TOTAL_STEPS) {
      await handleFinalize();
      return;
    }

    const validation = validateCurrentStep();
    if (validation.success) {
      setStep(step + 1);
    } else {
      toast.error(validation.error || "Completa los campos requeridos");
    }
  };

  const userMemo = useMemo(() => {
    return {
      email: formData.email,
      name: formData.name,
      image: formData.image,
    };
  }, [formData.email, formData.name, formData.image]);

  // Render de Carga
  if (isInitializing) {
    return (
      <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        <p className="text-muted-foreground text-sm">Preparando tu experiencia...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 md:px-0">
      {/* Barra de Progreso */}
      <div className="mb-10 space-y-2">
        {step !== 1 && (
          <>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              <span>{step === 0 ? "Comenzando" : `Paso ${step - 1}`}</span>
              <span>{Math.round(((step - 1) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={((step - 1) / TOTAL_STEPS) * 100} className="h-2" />
          </>
        )}
      </div>

      {/* Contenedor dinámico */}
      <div className="min-h-[450px] flex flex-col justify-center">
        {step === 1 && <WelcomeStep />}
        {step === 2 && <BasicDataStep />}
        {/* {step === 3 && <AreaAndRoleStep/>} */}
        {step === 3 && <OpportunityTypeStep />}
        {/*{step === 5 && <SkillsStep/>}*/}
        {/* {step === 5 && <ModalityStep/>} */}
        {/* {step === 6 && <AvailabilityStep/>} */}
        {step === 4 && <ExperienceLevelStep />}
        {/*{step === 9 && <PortfolioStep/>}*/}
        {step === 5 && <AccountStep user={userMemo} isSignedIn={isOAuth} />}
      </div>

      {/* Controles */}
      {step > 1 && (
        <div className="flex items-center justify-between mt-12 pt-6 border-t">
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => setStep(step - 1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>

          <Button
            size="lg"
            disabled={isPending || !isStepValid()}
            onClick={handleNext}
            className={step === TOTAL_STEPS ? "px-8 bg-primary hover:bg-primary/90" : "px-8"}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : step === TOTAL_STEPS ? (
              "Finalizar"
            ) : (
              "Continuar"
            )}
            {!isPending && step !== TOTAL_STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
