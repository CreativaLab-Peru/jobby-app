"use client"

import React, {useEffect, useTransition} from "react";
import {
  CheckCircle,
} from "lucide-react";
import {StepProps} from "@/features/onboarding/components/onboarding-flow";
import {finishOnboarding} from "@/features/onboarding/actions/finish-onboarding";
// TODO: Replace with another library or custom toast
// import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";

const FIRST_PASSWORD = process.env.FIRST_PASSWORD || "UANDAC@123ASD11323CA12"

export const StepWelcome: React.FC<StepProps> = ({data}) => {
  const [pending, startTransition] = useTransition();
  // const {toast} = useToast();
  const router = useRouter();

  const signInAndUpdateData = async () => {
    try {
      const {email, tempPassword} = data;
      const signIn = await authClient.signIn.email({
        email,
        password: FIRST_PASSWORD,
      })
      if (signIn.error) {
        console.log("[response.error]:", signIn.error);
        return;
      }
      const account1 = await authClient.updateUser({
        name: data.name,
      })
      if (account1.error) {
        console.log("[account1.error]:", account1.error);
        return;
      }

      const updatedPassword = await authClient.changePassword({
        currentPassword: FIRST_PASSWORD,
        newPassword: tempPassword,
      })
      if (updatedPassword.error) {
        console.log("[updatedPassword.error]:", updatedPassword.error);
        return;
      }
      return {success: true};
    } catch (error) {
      console.log("[error]:", error);
      return {error: "Ocurrió un error al finalizar la configuración de tu cuenta."};
    }
  };


  useEffect(() => {
    signInAndUpdateData().then((response)=> {
      if (response?.error) {
        // toast({
        //   title: "Error",
        //   description: response?.error || "Ocurrió un error al finalizar la configuración de tu cuenta.",
        //   variant: "destructive",
        // });
      }
      if (pending) {
        return;
      }
      startTransition(async () => {
        const response = await finishOnboarding(data)
        console.log("[finishOnboarding response]:", response);
        if (response?.error) {
          // toast({
          //   title: "Error",
          //   description: response?.error || "Ocurrió un error al finalizar la configuración de tu cuenta.",
          //   variant: "destructive",
          // });
        }
        if (!response?.success) {
          return;
        }
        router.push('/cv')
      })
    })
  }, []);

  return (
    <div className="text-center space-y-8 p-6">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse"/>
      <h2 className="text-3xl font-extrabold text-gray-800">
        ¡Bienvenido/a, {data.name.split(" ")[0] || "Usuario"}!
      </h2>
      <p className="text-lg text-gray-600">
        ¡Felicidades! Tu cuenta ha sido configurada exitosamente.
      </p>
      <div className="space-y-2 text-sm text-gray-500">
        <p>Email verificado: <span className="font-semibold text-gray-700">{data.email}</span></p>
        <p>Nombre de perfil: <span className="font-semibold text-gray-700">{data.name}</span></p>
      </div>
    </div>
  );
};
