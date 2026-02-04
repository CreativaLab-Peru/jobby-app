import { Button } from "@/components/ui/button";
import {ArrowLeft, ArrowRight, Sparkles} from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import Link from "next/link";
import { GoogleOAuthButton } from "@/features/authentication/components/google-oauth-button";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function WelcomeStep() {
  const { setStep } = useOnboardingStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Verificar si ya está autenticado con OAuth
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          // Si está autenticado, saltar al paso 2
          console.log("[INFO] Usuario OAuth detectado, saltando a paso 2");
          setStep(2);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [setStep]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center px-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">

      {/* Regreso visual limpio */}
      <div className="flex flex-col items-center justify-center mx-auto mb-10">
        <Link href={"/"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="inline-block mr-2 w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

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
      <div className="w-full max-w-xs space-y-4">
        <Button
          size="lg"
          variant="outline"
          className="w-full h-14 text-lg font-semibold rounded-xl group transition-all"
          onClick={() => setStep(2)}
        >
          Empezar ahora
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <GoogleOAuthButton 
          text="Registrarse con Google" 
          callbackURL="/onboarding/talents"
        />

        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-medium">
          Paso 1
        </p>
      </div>
    </div>
  );
}
