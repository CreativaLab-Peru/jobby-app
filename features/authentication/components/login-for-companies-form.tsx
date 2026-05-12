"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Mail, Lock, Loader2, CheckCircle, CreditCard} from "lucide-react";
import Link from "next/link";
import {FormField} from "@/components/form-field";
import {loginSchema, LoginFormData} from "../schemas/login-schema";
import {loginAction} from "../actions/login.action";
import {useState, useEffect} from "react";
import {authClient} from "@/lib/auth-client";
import {routes} from "@/lib/routes";
import {GoogleOAuthButton} from "./google-oauth-button";
import * as React from "react";

const errorMapper: Record<string, string> = {
  "Invalid password": "Contraseña incorrecta",
  "User not found": "Usuario no encontrado",
  "Email not verified": "Correo electrónico no verificado",
  "Too many requests": "Demasiadas solicitudes, intenta más tarde",
  "Invalid email or password": "Correo electrónico o contraseña inválidos",
};

interface LoginFormProps {
  slug: string;
}

export function LoginForCompaniesForm({slug}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const onboarding = searchParams.get("onboarding");
    if (onboarding === "completed") {
      setShowOnboardingSuccess(true);
      const timer = setTimeout(() => setShowOnboardingSuccess(false), 10000);
      return () => clearTimeout(timer);
    }
    const source = searchParams.get("source");
    if (source === "new_payment") {
      setShowPaymentSuccess(true);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);

    const result = await loginAction(data);
    const {email, password} = data;
    const response = await authClient.signIn.email({
      email,
      password,
    });
    if (!response.data) {
      setFormError(errorMapper[response.error.message] || "Error desconocido");
      return;
    }

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([key, value]) => {
          setError(key as any, {message: value?.[0]});
        });
      }
      return;
    }

    router.push(`/c/${slug}/dashboard`);
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Bienvenido {" "}</span>
            de vuelta
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión
            para continuar
          </p>
        </div>

        {showOnboardingSuccess && (
          <div
            className="mb-6 bg-green-100 border border-green-200 rounded-lg p-4 flex items-start gap-3 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle
              className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"/>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                ¡Bienvenido!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Confirma tu cuenta con el enlace que enviamos a tu correo.
              </p>
            </div>
          </div>
        )}

        {showPaymentSuccess && (
          <div
            className="mb-6 bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
            <div>
              <h3 className="font-semibold text-primary">
                ¡Pago completado con éxito!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Te enviamos un enlace de acceso a tu correo. Revísalo para ingresar a tu cuenta y
                ver tus créditos.
              </p>
            </div>
          </div>
        )}

        <Card className="p-8 bg-card shadow-glow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              label="Correo electrónico"
              placeholder="tu@email.com"
              icon={Mail}
              register={register("email")}
              error={errors.email?.message}
            />

            <FormField
              label="Contraseña"
              placeholder="••••••••"
              icon={Lock}
              type="password"
              register={register("password")}
              error={errors.password?.message}
            />

            {formError && (
              <div
                className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {formError}
              </div>
            )}

            <div className="flex justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full h-14 font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin"/>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
            {/* Botón de Google OAuth */}
            {/*<GoogleOAuthButton*/}
            {/*  mode={'signIn'}*/}
            {/*  callbackURL={routes.app.dashboard}*/}
            {/*/>*/}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}
