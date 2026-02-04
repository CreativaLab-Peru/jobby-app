"use client";

import {useTransition} from "react";
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
import {SkillsStep} from "@/features/onboarding/components/skills-step";
import {PortfolioStep} from "@/features/onboarding/components/portfolio-step";
import {AccountStep} from "@/features/onboarding/components/account-step";
import {authClient} from "@/lib/auth-client";
import {useDebug} from "@/hooks/use-debug";
import {
  completeOnboardingDebugAction
} from "@/features/onboarding/actions/onboarding-debug-action";
import {timeout} from "d3-timer";
import {checkExistingUser} from "@/features/authentication/actions/existing-user";
import {getUserByEmail} from "@/features/authentication/actions/get-user-by-email";
import { verifyOAuthUser } from "@/features/authentication/actions/verify-oauth-user";

const TOTAL_STEPS = 9;

export function OnboardingForm() {
  const {step, setStep, formData, reset, validateCurrentStep, setErrors} = useOnboardingStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Debug
  const debug = useDebug();

  const handleFinalize = async () => {
    setErrors({}); // Limpiar errores previos
    // 1. Validación final completa de Zod antes de disparar auth
    const validation = validateCurrentStep();
    if (!validation.success) {
      toast.error(validation.error || "Revisa los campos antes de finalizar");
      // toast.error("Revisa los campos antes de finalizar");
      return;
    }
    console.log("[DEBUG] QUERY PARAMS", debug);

    startTransition(async () => {
      try {
        // Verificar si el usuario ya está autenticado (OAuth)
        const session = await authClient.getSession();
        let userId: string;
        let isOAuthUser = false;
        
        if (session?.data?.user) {
          // Usuario ya autenticado con OAuth
          userId = session.data.user.id;
          isOAuthUser = true;
          console.log("[INFO] Usuario OAuth detectado:", userId);
        } else {
          // A. Registro normal con email/password
          const body = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
          };
          
          const existingUser = await checkExistingUser(body.email);
          if (existingUser.error) {
            toast.error("Hubo un problema al verificar el correo. Intenta nuevamente.");
            return;
          }

          if (existingUser.exists) {
            toast.error("El correo ya está registrado. Por favor, usa otro correo.");
            return;
          }
          
          const newUser = await authClient.signUp.email(body);
          if (newUser?.error) {
            console.error("[ERROR_SIGNUP]", newUser.error);
            toast.error("Hubo un problema al crear tu cuenta. Intenta con otro correo.");
            return;
          }

          const currentUser = await getUserByEmail(newUser.data.user.email);
          if (!currentUser) {
            toast.error("No se pudo obtener la información del usuario recién creado.");
            return;
          }
          
          userId = currentUser.id;
        }

        // B. Guardar preferencias de onboarding
        if (debug)  {
          const result = await completeOnboardingDebugAction(userId, formData);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          router.push("/dashboard");
          reset();
          return;
        }

        const result = await completeOnboardingAction(userId, formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        // C. Si es usuario OAuth, verificar email y otorgar créditos automáticamente
        if (isOAuthUser) {
          const verifyResult = await verifyOAuthUser(userId);
          if (verifyResult.error) {
            console.error("[ERROR_VERIFY_OAUTH]", verifyResult.error);
            // No bloqueamos el flujo, solo logueamos el error
          }
        }

        // D. Éxito y limpieza
        toast.success("¡Bienvenido/a! Tu perfil profesional está listo.");
        
        // Si viene de OAuth, ir directo al dashboard (ya verificado)
        // Si es registro nuevo, pedir verificación de email
        if (isOAuthUser) {
          router.push("/dashboard");
        } else {
          router.push("/account/verify?email=" + encodeURIComponent(formData.email));
        }
        
        timeout(() => {
          reset();
        }, 1000);

      } catch (error) {
        console.error("[ERROR_ONBOARDING_FINALIZE]", error);
        toast.error("Error inesperado en el servidor");
      }
    });
  };

  const handleNext = async () => {
    const validation = validateCurrentStep();
    if (!validation.success) {
      toast.error("Revisa los campos antes de continuar");
      return;
    }
    if (step === TOTAL_STEPS) {
      await handleFinalize();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 md:px-0">
      {/* Barra de Progreso Minimalista */}
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

      {/* Contenedor dinámico de Pasos */}
      <div className="min-h-[450px] flex flex-col justify-center">
        {step === 1 && <WelcomeStep/>}
        {step === 2 && <BasicDataStep/>}
        {step === 3 && <AreaAndRoleStep/>}
        {step === 4 && <SkillsStep/>}
        {step === 5 && <ModalityStep/>}
        {step === 6 && <AvailabilityStep/>}
        {step === 7 && <ExperienceLevelStep/>}
        {step === 8 && <PortfolioStep/>}
        {step === 9 && <AccountStep/>}
        {step === 10 && (<>
          {/*  Loading */}
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary"/>
            <h2 className="text-2xl font-bold mb-2">Creando tu cuenta...</h2>
            <p className="text-muted-foreground">Esto puede tomar unos segundos. ¡Gracias por tu paciencia!</p>
          </div>
        </>)}
      </div>

      {/* Controles de Navegación */}
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
            disabled={isPending}
            onClick={handleNext}
            className={step === TOTAL_STEPS ? "px-8 bg-primary hover:bg-primary/90" : "px-8"}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Procesando...
              </>
            ) : step === TOTAL_STEPS ? (
              "Crear cuenta y Finalizar"
            ) : (
              <>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4"/>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
