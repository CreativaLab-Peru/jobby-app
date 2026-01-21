import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";

export function WelcomeStep() {
  const { setStep } = useOnboardingStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center px-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">

      {/* Icono sutil de bienvenida */}
      <div className="mb-8 p-4 bg-primary/5 rounded-full">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>

      {/* Título conciso y directo */}
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          ¡Hola! Vamos a preparar <br />
          <span className="text-primary">tu perfil de match</span>
        </h1>
        <p className="text-muted-foreground text-lg italic">
          "Solo te tomará 2 minutos configurar tu experiencia."
        </p>
      </div>

      {/* Acción principal única */}
      <div className="w-full max-w-xs space-y-6">
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-xl group transition-all"
          onClick={() => setStep(1)}
        >
          Empezar ahora
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-medium">
          Paso 1
        </p>
      </div>
    </div>
  );
}
