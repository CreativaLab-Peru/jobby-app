"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { FormField } from "@/components/form-field";
import { Mail, Lock } from "lucide-react";

export function AccountStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Crea tu cuenta</h2>
        <p className="text-muted-foreground">
          Casi terminamos. Guarda tu progreso para recibir tus matches.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Correo electrónico"
          placeholder="tu@email.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contraseña"
            placeholder="••••••••"
            icon={Lock}
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
          />

          <FormField
            label="Confirmar contraseña"
            placeholder="••••••••"
            icon={Lock}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={formData.acceptedTerms}
              onChange={(e) => updateFormData({ acceptedTerms: e.target.checked })}
            />
            <span>Acepto los términos y condiciones</span>
          </label>
        </div>
      </div>
    </div>
  );
}
