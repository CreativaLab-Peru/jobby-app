"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { registerAction } from "../actions/register.action";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import {RegisterFormData, registerSchema} from "@/features/auth/schemas/register-schema";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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

    router.push("/cv");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Nombre completo"
        icon={User}
        register={register("name")}
        error={errors.name?.message}
      />

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

      <FormField
        label="Confirmar contraseña"
        icon={Lock}
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <label className="flex gap-2 text-sm">
        <input type="checkbox" {...register("acceptedTerms")} />
        Acepto los términos y condiciones
      </label>

      {errors.acceptedTerms && (
        <p className="text-xs text-red-500">
          {errors.acceptedTerms.message}
        </p>
      )}

      <Button disabled={isSubmitting} className="w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
