"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareWarning, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { complaintSchema, type ComplaintFormValues } from "@/features/complaints/schemas/complaint.schema";
import { submitComplaintAction } from "@/features/complaints/actions/submit-complaint";

const MAX_COMPLAINT = 2000;
const MIN_COMPLAINT = 100;

export default function ComplaintsPage() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { name: "", email: "", phone: "", complaint: "" },
  });

  const complaintTrimmedLen = (watch("complaint") ?? "").trim().length;

  const onSubmit = async (data: ComplaintFormValues) => {
    setStatus(null);
    try {
      const result = await submitComplaintAction(data);
      if (result.success) {
        setStatus({
          type: "success",
          message: "Tu reclamo ha sido enviado exitosamente. Nos pondremos en contacto contigo a la brevedad posible.",
        });
        reset();
      } else {
        setStatus({ type: "error", message: result.error ?? "No se pudo enviar el reclamo. Intenta nuevamente." });
      }
    } catch {
      setStatus({ type: "error", message: "Ocurrió un error inesperado. Intenta nuevamente." });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-card border-border bg-card/50 backdrop-blur-md overflow-hidden">
            <CardHeader className="text-center pt-10 pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <MessageSquareWarning className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-foreground uppercase tracking-tight">
                Libro de <span className="ai-gradient-text">Reclamaciones</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-10">
              <div className="bg-muted/50 border border-border p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Tu satisfacción es nuestra prioridad. Valoramos tus comentarios para seguir mejorando nuestro servicio de inteligencia artificial.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-bold text-foreground">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`bg-background border-border focus-visible:ring-primary h-11 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-bold text-foreground">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      {...register("email")}
                      className={`bg-background border-border focus-visible:ring-primary h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                      Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 987654321"
                      {...register("phone")}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^\d\s+\-().]/g, "");
                      }}
                      className={`bg-background border-border focus-visible:ring-primary h-11 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Complaint */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="complaint" className="text-sm font-bold text-foreground">
                      Detalles del reclamo
                    </Label>
                    <span className={`text-xs tabular-nums ${complaintTrimmedLen > MAX_COMPLAINT ? "text-red-400" : complaintTrimmedLen >= MIN_COMPLAINT ? "text-green-400" : "text-muted-foreground"}`}>
                      {complaintTrimmedLen}/{MAX_COMPLAINT}
                    </span>
                  </div>
                  <Textarea
                    id="complaint"
                    placeholder="Describe tu situación con detalle (mínimo 100 caracteres)..."
                    {...register("complaint")}
                    className={`bg-background border-border focus-visible:ring-primary min-h-[140px] resize-none ${errors.complaint ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    maxLength={MAX_COMPLAINT + 50}
                  />
                  {errors.complaint && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.complaint.message}
                    </p>
                  )}
                </div>

                {/* Feedback */}
                {status && (
                  <div
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                      status.type === "success"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
                    )}
                    <p>{status.message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 ai-gradient text-primary-foreground font-bold text-base shadow-glow hover:opacity-90 transition-all rounded-xl mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Registrar Reclamo"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
