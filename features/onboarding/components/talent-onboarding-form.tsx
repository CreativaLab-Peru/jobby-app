"use client";

import {useEffect, useState, useTransition} from "react"; // Añadimos useState
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {completeOnboardingAction} from "@/features/onboarding/actions/onboarding.action";

import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {Loader2, ArrowRight, ArrowLeft} from "lucide-react";

// Componentes de los pasos
import {WelcomeStep} from "@/features/onboarding/components/welcome-step";
import {BasicDataStep} from "@/features/onboarding/components/basic-data-step";
import {AreaAndRoleStep} from "@/features/onboarding/components/area-and-role-step";
import {ExperienceLevelStep} from "@/features/onboarding/components/experience-level-step";
import {ModalityStep} from "@/features/onboarding/components/modality-step";
import {AvailabilityStep} from "@/features/onboarding/components/availability-step";
import {AccountStep} from "@/features/onboarding/components/account-step";
import {authClient} from "@/lib/auth-client";
import {useDebug} from "@/hooks/use-debug";
import {completeOnboardingDebugAction} from "@/features/onboarding/actions/onboarding-debug-action";
import {timeout} from "d3-timer";
import {checkExistingUser} from "@/features/authentication/actions/existing-user";
import {getUserByEmail} from "@/features/authentication/actions/get-user-by-email";
import {verifyOAuthUser} from "@/features/authentication/actions/verify-oauth-user";
import {OpportunityTypeStep} from "@/features/onboarding/components/opportunity-type-step";
import {useAnalysisStore} from "@/hooks/use-analysis-store";

const TOTAL_STEPS = 8;

export function OnboardingForm() {
  const {
    step,
    setStep,
    formData,
    reset,
    validateCurrentStep,
    setErrors,
    updateFormData
  } = useOnboardingStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ESTADO DE CARGA INICIAL (KISS)
  const [isInitializing, setIsInitializing] = useState(true);

  // Debug
  const debug = useDebug();
  const [isProcessingPersisted, setIsProcessingPersisted] = useState(false);
  // Todo:cv-pay
  // const { fileBlob, loadPersistedFile } = useAnalysisStore();

  // 1. Verificación inicial de sesión para evitar parpadeos en AccountStep
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const user = session.data.user;
          updateFormData({
            email: user.email,
            // name: user.name,
          });
        }
      } catch (e) {
        console.error("[ERROR_SIGN_IN_WITH_GOOGLE]", e);
      } finally {
        setIsInitializing(false);
      }
    };
    checkSession();
  }, []);

  const handleFinalize = async () => {
    setErrors({});
    const validation = validateCurrentStep();
    const isOAuthUser = !!(await authClient.getSession())?.data?.user && step === TOTAL_STEPS;
    if (!validation.success && !isOAuthUser) {
      toast.error(validation.error || "Revisa los campos antes de finalizar");
      return;
    }

    startTransition(async () => {
      try {
        const session = await authClient.getSession();
        let userId: string;
        let isOAuthUser = false;

        if (session?.data?.user) {
          userId = session.data.user.id;
          isOAuthUser = true;
        } else {
          const body = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
          };
          const existingUser = await checkExistingUser(body.email);
          if (existingUser.exists) {
            toast.error("El correo ya está registrado.");
            return;
          }
          const newUser = await authClient.signUp.email(body);
          if (newUser?.error) {
            toast.error(newUser.error.message || "Error al crear la cuenta.");
            console.error(newUser.error);
            return;
          }

          const currentUser = await getUserByEmail(newUser.data.user.email);
          if (!currentUser) {
            toast.error("Error al obtener los datos del usuario.");
            console.error(newUser.error);
            return;
          }
          userId = currentUser.id;
        }

        const result = debug
          ? await completeOnboardingDebugAction(userId, formData)
          : await completeOnboardingAction(userId, formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (isOAuthUser) await verifyOAuthUser(userId);

        toast.success("¡Bienvenido/a! Tu perfil está listo.");

        if (isOAuthUser) {
          // if (isProcessingPersisted && fileBlob) {
          //   router.push("/cv?afterOnboarding=true");
          // } else {
          //   router.push("/dashboard");
          // }
        } else {
          router.push("/login?onboarding=completed");
        }

        timeout(() => reset(), 1000);
      } catch (error) {
        toast.error("Error inesperado en el servidor");
      }
    });
  };

  const handleNext = async () => {
    const validation = validateCurrentStep();
    if (!validation.success) {
      const session = await authClient.getSession();
      const isOAuthUser = !!session?.data?.user && step === TOTAL_STEPS;

      if (!isOAuthUser) {
        toast.error(validation.error || "Revisa los campos antes de finalizar");
        return;
      }
    }
    if (step === TOTAL_STEPS) {
      await handleFinalize();
    } else {
      setStep(step + 1);
    }
  };

  // useEffect(() => {
  //   const checkPersistedCV = async () => {
  //     try {
  //       await loadPersistedFile();
  //     } finally {
  //       setIsProcessingPersisted(true);
  //     }
  //   };
  //   checkPersistedCV();
  // }, [loadPersistedFile]);


  // 2. RENDER DE CARGA INICIAL
  if (isInitializing) {
    return (
      <div
        className="max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/60"/>
        <p className="text-muted-foreground animate-pulse text-sm">Cargando tu progreso...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 md:px-0">
      {/* Barra de Progreso */}
      <div className="mb-10 space-y-2">
        {step !== 1 && (
          <>
            <div
              className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              <span>{step === 0 ? "Comenzando" : `Paso ${step - 1}`}</span>
              <span>{Math.round(((step - 1) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={((step - 1) / TOTAL_STEPS) * 100} className="h-2"/>
          </>
        )}
      </div>

      {/* Contenedor dinámico */}
      <div className="min-h-[450px] flex flex-col justify-center">
        {step === 1 && <WelcomeStep/>}
        {step === 2 && <BasicDataStep/>}
        {step === 3 && <AreaAndRoleStep/>}
        {step === 4 && <OpportunityTypeStep/>}
        {/*{step === 5 && <SkillsStep/>}*/}
        {step === 5 && <ModalityStep/>}
        {step === 6 && <AvailabilityStep/>}
        {step === 7 && <ExperienceLevelStep/>}
        {/*{step === 9 && <PortfolioStep/>}*/}
        {step === 8 && <AccountStep/>}
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
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Regresar
          </Button>

          <Button
            size="lg"
            disabled={isPending || (step === TOTAL_STEPS && !formData.acceptedTerms)}
            onClick={handleNext}
            className={step === TOTAL_STEPS ? "px-8 bg-primary hover:bg-primary/90" : "px-8"}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Procesando...
              </>
            ) : step === TOTAL_STEPS ? (
              "Finalizar"
            ) : (
              "Continuar"
            )}
            {!isPending && step !== TOTAL_STEPS && <ArrowRight className="ml-2 h-4 w-4"/>}
          </Button>
        </div>
      )}
    </div>
  );
}
