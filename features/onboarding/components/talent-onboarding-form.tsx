"use client"

import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {Progress} from "@/components/ui/progress";
import {AreaAndRoleStep} from "@/features/onboarding/components/area-and-role-step";
import {SkillsStep} from "@/features/onboarding/components/skills-step";
import {Button} from "@/components/ui/button";
import {BasicDataStep} from "@/features/onboarding/components/basic-data-step";
import {ExperienceLevelStep} from "@/features/onboarding/components/experience-level-step";
import {ModalityStep} from "@/features/onboarding/components/modality-step";
import {AvailabilityStep} from "@/features/onboarding/components/availability-step";
import {PortfolioStep} from "@/features/onboarding/components/portfolio-step";
import {WelcomeStep} from "@/features/onboarding/components/welcome-step";
import { registerAction } from "@/features/authentication/actions/register.action";
import { toast } from "sonner";
import {useRouter} from "next/navigation";
import {AccountStep} from "@/features/onboarding/components/account-step"; // O tu librería de notificaciones

export function OnboardingForm() {
  const { step, setStep, formData, reset } = useOnboardingStore();
  const router = useRouter();

  const handleFinalize = async () => {
    // 1. Validaciones básicas antes de enviar
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!formData.acceptedTerms) {
      toast.error("Debes aceptar los términos");
      return;
    }

    // 2. Ejecutar el registro con todos los datos
    // Nota: Aquí enviamos el formData completo al registerAction
    const result = await registerAction(formData);

    if (result.success) {
      toast.success("¡Cuenta creada y perfil configurado!");
      reset(); // Limpiar Zustand/LocalStorage
      router.push("/dashboard");
    } else {
      toast.error(result.formError || "Ocurrió un error al registrar");
    }
  };

  const handleNext = () => {
    if (step === 8) {
      handleFinalize();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      {/* Ajustamos el progreso a 8 pasos */}
      <Progress value={(step / 8) * 100} className="mb-8" />

      <div className="min-h-[400px]">
        {step === 0 && <WelcomeStep />}
        {step === 1 && <BasicDataStep />}
        {step === 2 && <AreaAndRoleStep />}
        {step === 3 && <ExperienceLevelStep />}
        {step === 4 && <ModalityStep />}
        {step === 5 && <AvailabilityStep />}
        {step === 6 && <SkillsStep />}
        {step === 7 && <PortfolioStep />}
        {step === 8 && <AccountStep />}
      </div>

      {step > 0 && (
        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            Regresar
          </Button>
          <Button onClick={handleNext}>
            {step === 8 ? "Crear cuenta y Finalizar" : "Continuar"}
          </Button>
        </div>
      )}
    </div>
  );
}
