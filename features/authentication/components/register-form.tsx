"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { registerAction } from "../actions/register.action";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import {
  RegisterFormData,
  registerSchema,
} from "@/features/authentication/schemas/register-schema";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const acceptedTerms = watch("acceptedTerms");

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerAction(data);

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([key, value]) => {
          setError(key as any, { message: value?.[0] });
        });
      }
      return;
    }

    router.push(routes.app.cv.root);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Nombre completo"
        placeholder="Juan Pérez"
        icon={User}
        register={register("name")}
        error={errors.name?.message}
      />

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

      <FormField
        label="Confirmar contraseña"
        placeholder="••••••••"
        icon={Lock}
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <label className="flex gap-2 text-sm cursor-pointer">
        <input type="checkbox" {...register("acceptedTerms")} />
        <span>
          Acepto los{" "}
          <Link
            href="/terminos-y-condiciones"
            className="text-primary hover:underline"
          >
            términos y condiciones
          </Link>
        </span>
      </label>

      {errors.acceptedTerms && (
        <p className="text-xs text-red-500">
          {errors.acceptedTerms.message}
        </p>
      )}

      <Button
        disabled={isSubmitting || !acceptedTerms}
        className="w-full h-14 font-bold"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Crear cuenta"
        )}
      </Button>
    </form>
  );
}
