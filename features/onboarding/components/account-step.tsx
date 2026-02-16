"use client";

import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {FormField} from "@/components/form-field";
import {Mail, Lock, CheckCircle2, LogOut} from "lucide-react";
import {useEffect, useState} from "react";
import {authClient} from "@/lib/auth-client";
import {GoogleOAuthButton} from "@/features/authentication/components/google-oauth-button";
import {Button} from "@/components/ui/button";
import {UserAvatar} from "@/components/avatar-user";

export function AccountStep() {
  const {formData, updateFormData, errors} = useOnboardingStore();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string | null;
  }>(null);

  // Escuchamos la sesión solo para actualizar la vista local
  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser({
          name: session.data.user.name,
          email: session.data.user.email,
          image: session.data.user.image,
        });
        // Actualizamos store si no estaba actualizado
        if (!formData.email) {
          updateFormData({email: session.data.user.email, name: session.data.user.name});
          updateFormData({acceptedTerms: true});
        }

      }
    };
    checkSession();
  }, [formData.email, updateFormData]);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    updateFormData({email: "", password: "", confirmPassword: ""});
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {user ? `¡Hola de nuevo, ${user?.name?.split(" ")?.[0]}!` : "Crea tu cuenta"}
        </h2>
        <p className="text-muted-foreground">
          {user
            ? "Confirmamos tu identidad para continuar con tu perfil."
            : "Guarda tu progreso para recibir tus matches."}
        </p>
      </div>

      {user ? (
        <div className="space-y-4">
          <div
            className="bg-secondary/50 border rounded-xl p-6 flex flex-col items-center text-center gap-4">
            <UserAvatar
              image={user?.image}
              name={user?.name}
              className="h-20 w-20 text-xl border-2 border-background shadow-sm"
            />
            <div>
              <p className="font-semibold text-lg leading-tight">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div
              className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400"/>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Cuenta vinculada
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="mt-2 gap-2">
              <LogOut className="h-4 w-4"/>
              Cambiar cuenta
            </Button>
          </div>
        </div>
      ) : (
        /* VISTA: FORMULARIO (Mismo código de antes) */
        <div className="space-y-4">
          <FormField
            label="Correo electrónico"
            placeholder="tu@email.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => updateFormData({email: e.target.value})}
            error={errors.email}
          />
          <FormField
            label="Contraseña"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={(e) => updateFormData({password: e.target.value})}
            error={errors.password}
            type={'password'}
          />
          <div className="relative my-6 text-center text-xs uppercase text-muted-foreground">
            <span className="bg-background px-2 relative z-10">O continuar con</span>
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"/>
            </div>
          </div>
          <GoogleOAuthButton
            text="Registrarse con Google"
            callbackURL="/onboarding/talents"
            mode={'signUp'}
          />
        </div>
      )}

      {/* Términos (Mismo código) */}
      <div className="flex flex-col gap-3 pt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={formData.acceptedTerms}
            onChange={(e) => updateFormData({acceptedTerms: e.target.checked})}
          />
          <span>Acepto los términos y condiciones</span>
          <a
            href="/terminos-y-condiciones"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-xs"
          >Ver</a>
          {errors.acceptedTerms && (
            <span className="text-red-600 text-xs mt-1">{errors.acceptedTerms}</span>
          )}
        </label>
      </div>
    </div>
  );
}
