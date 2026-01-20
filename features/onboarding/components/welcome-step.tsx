import { Button } from "@/components/ui/button";
import { Sparkles, Target, Zap } from "lucide-react";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";

export function WelcomeStep() {
  const { setStep } = useOnboardingStore();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header de la página que solicitaste */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Configura tu <span className="text-primary text-gradient">perfil de match</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-lg mx-auto leading-relaxed">
          Solo te tomará 2 minutos. Queremos asegurarnos de mostrarte lo que realmente buscas.
        </p>
      </div>

      {/* Beneficios rápidos para incentivar al usuario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium">Matches Precisos</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium">Ahorra Tiempo</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium">IA Personalizada</p>
        </div>
      </div>

      <Button
        size="lg"
        className="h-14 px-10 text-lg font-bold shadow-glow hover:scale-105 transition-transform"
        onClick={() => setStep(1)}
      >
        Empezar configuración
      </Button>
    </div>
  );
}
