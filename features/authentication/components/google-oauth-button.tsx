"use client";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface GoogleOAuthButtonProps {
  text?: string;
  callbackURL?: string;
  mode: "signIn" | "signUp";
}

// Sub-componente para usar searchParams de forma segura en Next.js
function GoogleOAuthButtonContent({ text, callbackURL, mode }: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // 1. Escuchar errores que vienen en la URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "user_not_found" || errorParam === "signup_disabled") {
      const msg = "No tienes una cuenta registrada. Por favor, regístrate primero.";
      setErrorMessage(msg);
    }
  }, [searchParams]);

  const buttonText = text || (mode === "signIn" ? "Iniciar sesión con Google" : "Registrarse con Google");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: `${window.location.origin}/login`,
        requestSignUp: mode === "signUp",
      });

      if (error) {
        // Errores inmediatos del cliente
        const msg = error.message || "Error al intentar conectar.";
        setErrorMessage(msg);
        // toast.error(msg);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Error de conexión inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 font-medium"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        {buttonText}
      </Button>

      {errorMessage && (
        <div className="flex items-center gap-2 text-sm text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

// Componente principal con Suspense (Requerido por Next.js al usar useSearchParams)
export function GoogleOAuthButton(props: GoogleOAuthButtonProps) {
  return (
    <Suspense fallback={<Button variant="outline" className="w-full h-12" disabled>Cargando...</Button>}>
      <GoogleOAuthButtonContent {...props} />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
