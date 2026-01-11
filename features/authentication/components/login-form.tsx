"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { loginSchema, LoginFormData } from "../schemas/login-schema";
import { loginAction } from "../actions/login.action";
import { useState } from "react";
import {authClient} from "@/lib/auth-client";

const errorMapper: Record<string, string> = {
  "Invalid password": "Contraseña incorrecta",
  "User not found": "Usuario no encontrado",
  "Email not verified": "Correo electrónico no verificado",
  "Too many requests": "Demasiadas solicitudes, intenta más tarde",
  "Invalid email or password": "Correo electrónico o contraseña inválidos",
};

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);

    const result = await loginAction(data);
    const { email, password } = data;
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
          setError(key as any, { message: value?.[0] });
        });
      }
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenido de <span className="text-gradient">vuelta</span>
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión para continuar
          </p>
        </div>

        <Card className="p-8 bg-card shadow-glow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Correo electrónico"
              icon={Mail}
              register={register("email")}
              error={errors.email?.message}
            />

            <FormField
              label="Contraseña"
              icon={Lock}
              type="password"
              register={register("password")}
              error={errors.password?.message}
            />

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-500">
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
              className="w-full h-14 font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/pro" className="text-primary hover:underline">
              Consulta aquí
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}
