"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { FormField } from "@/components/form-field"; // Tu componente personalizado
import { createTemporalUser } from "@/features/home/actions/create-temporal-user";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("El formato del correo no es válido")
});

type FormValues = z.infer<typeof formSchema>;

interface EmailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: (id: string, email: string) => void;
  newEvaluationId?: string;
}

export function EmailModal({
                             isOpen,
                             closeModal,
                             onSuccess,
                             newEvaluationId
                           }: EmailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    }
  });

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const res = await createTemporalUser({
          email: values.email,
          name: values.name,
          newEvaluationId
        });

        if (!res.success) {
          return setServerError(res.error || "Error al procesar.");
        }

        closeModal();
        onSuccess?.(res.temporalUserId, values.email);
      } catch (e) {
        setServerError("Error de conexión.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md p-8 rounded-3xl border-none shadow-2xl">
        <DialogHeader className="items-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Mail className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">
            Primero unete a  <span className="text-primary">Levely</span>
          </DialogTitle>

          {/* Mensaje añadido */}
          <p className="text-sm text-muted-foreground font-medium">
            Te enviaremos un correo con tu acceso a <span className="font-bold text-foreground">Levely</span>.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

          {/* Campo Nombre */}
          <FormField
            placeholder="Tu nombre completo"
            icon={User}
            register={register("name")}
            error={errors.name?.message}
            label={"Nombre completo"}
          />

          {/* Campo Email */}
          <FormField
            placeholder="tu@correo.com"
            icon={Mail}
            register={register("email")}
            error={errors.email?.message}
            label={"Correo electrónico"}
          />

          {serverError && (
            <div className="text-xs text-destructive font-bold flex items-center gap-2 px-1 italic">
              <AlertCircle className="w-4 h-4" /> {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-tighter rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Continuar al pago <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            Pago seguro
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
