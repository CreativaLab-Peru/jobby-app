"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { FormField } from "@/components/form-field";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AccountStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string>("");

  useEffect(() => {
    // Verificar si el usuario viene de OAuth
    const checkOAuthStatus = async () => {
      const session = await authClient.getSession();
      
      if (session?.data?.user) {
        const user = session.data.user;
        
        // Si el usuario tiene email y nombre pero no ingresó contraseña,
        // probablemente viene de OAuth
        if (user.email && user.name && !formData.password) {
          setIsOAuthUser(true);
          setOauthProvider("Google"); // Podrías detectar el proveedor real
          
          // Autocompletar datos desde OAuth
          updateFormData({ 
            email: user.email,
            name: user.name,
          });
        }
      }
    };

    checkOAuthStatus();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {isOAuthUser ? "Confirma tu información" : "Crea tu cuenta"}
        </h2>
        <p className="text-muted-foreground">
          {isOAuthUser 
            ? "Tu cuenta de Google está lista. Solo confirma tus datos."
            : "Casi terminamos. Guarda tu progreso para recibir tus matches."
          }
        </p>
      </div>

      {isOAuthUser && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-900 dark:text-green-100">
              Autenticado con {oauthProvider}
            </p>
            <p className="text-green-700 dark:text-green-300 mt-1">
              No necesitas crear una contraseña. Tu cuenta está protegida por {oauthProvider}.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <FormField
          label="Correo electrónico"
          placeholder="tu@email.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          error={errors.email}
          disabled={isOAuthUser}
        />

        {!isOAuthUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Contraseña"
              placeholder="••••••••"
              icon={Lock}
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              error={errors.password}
            />

            <FormField
              label="Confirmar contraseña"
              placeholder="••••••••"
              icon={Lock}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={formData.acceptedTerms}
              onChange={(e) => updateFormData({ acceptedTerms: e.target.checked })}
            />
            <span>Acepto los términos y condiciones</span>
            <span>
              <a
                href="/terminos-y-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline ml-1"
              >
                Ver
              </a>
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="text-sm text-red-600 mt-1">{errors.acceptedTerms}</p>
          )}
        </div>
      </div>
    </div>
  );
}

