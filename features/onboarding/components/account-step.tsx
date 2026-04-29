"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { FormField } from "@/components/form-field";
import { Mail, Lock, CheckCircle2, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GoogleOAuthButton } from "@/features/authentication/components/google-oauth-button";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/avatar-user";
import Link from "next/link";

interface AccountStepProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  isSignedIn: boolean;
}

export function AccountStep({ user, isSignedIn }: AccountStepProps) {
  const { formData, updateFormData, errors } = useOnboardingStore();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      // Forzamos un refresh para que el estado 'sessionUser' del padre se limpie
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {formData?.name ? `¡Hola, ${formData?.name?.split(" ")?.[0]}!` : "Crea tu cuenta"}
        </h2>
        <p className="text-muted-foreground">
          {user
            ? "Confirmamos tu identidad para continuar con tu perfil."
            : "Guarda tu progreso para recibir tus matches."}
        </p>
      </div>

      {user && isSignedIn ? (
        <div className="space-y-4">
          <div className="bg-secondary/50 border rounded-xl p-6 flex flex-col items-center text-center gap-4">
            <UserAvatar
              image={user?.image}
              name={formData?.name}
              className="h-20 w-20 text-xl border-2 border-background shadow-sm"
            />
            <div>
              <p className="font-semibold text-lg leading-tight">{formData?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Cuenta vinculada
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="mt-2 gap-2">
              <LogOut className="h-4 w-4" />
              Cambiar cuenta
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <FormField
            label="Correo electrónico"
            placeholder="tu@email.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            error={errors.email}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Contraseña"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password || ""}
              onChange={(e) => updateFormData({ password: e.target.value })}
              error={errors.password}
              type="password"
            />
            <FormField
              label="Confirmar contraseña"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword || ""}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              type="password"
            />
          </div>

          <div className="relative my-6 text-center text-xs uppercase text-muted-foreground">
            <span className="bg-background px-2 relative z-10">O continuar con</span>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          <GoogleOAuthButton
            text="Registrarse con Google"
            callbackURL="/onboarding/talents"
            mode="signUp"
          />
        </div>
      )}

      <div className="flex items-start gap-2 text-sm">
        <span className="text-muted-foreground leading-snug text-center w-full">
          Al crear tu cuenta aceptas los{" "}
          <Link
            href="/terminos-y-condiciones"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link
            href="/politica-de-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            política de privacidad
          </Link>
          .
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
