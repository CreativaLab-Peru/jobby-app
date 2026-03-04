"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareWarning, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { submitComplaintAction } from "@/features/complaints/actions/submit-complaint";

const MAX_COMPLAINT = 2000;
const MIN_COMPLAINT = 30;

function validateForm(form: { name: string; email: string; phone: string; complaint: string }) {
  const errors: Partial<Record<keyof typeof form, string>> = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "El nombre es obligatorio";
  } else if (name.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  } else if (name.length > 100) {
    errors.name = "El nombre es demasiado largo";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(name)) {
    errors.name = "El nombre solo puede contener letras";
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "El correo es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Correo electrónico inválido";
  }

  const phone = form.phone.trim();
  if (phone && !/^\+?[\d\s\-().]{7,20}$/.test(phone)) {
    errors.phone = "Teléfono inválido (ej: +51 999 999 999)";
  }

  const complaint = form.complaint.trim();
  if (!complaint) {
    errors.complaint = "El reclamo es obligatorio";
  } else if (complaint.length < MIN_COMPLAINT) {
    errors.complaint = `El reclamo debe tener al menos ${MIN_COMPLAINT} caracteres`;
  } else if (complaint.length > MAX_COMPLAINT) {
    errors.complaint = `El reclamo no puede superar los ${MAX_COMPLAINT} caracteres`;
  }

  return errors;
}

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    complaint: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof typeof form, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const errors = validateForm(form);
  const hasErrors = Object.keys(errors).length > 0;
  const complaintTrimmedLen = form.complaint.trim().length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      // Solo permite dígitos, +, espacios, guiones, puntos y paréntesis
      value = value.replace(/[^\d\s+\-().]/g, "");
    }
    setForm({ ...form, [e.target.name]: value });
    if (status) setStatus(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Marcar todos los campos como tocados para mostrar errores
    setTouched({ name: true, email: true, phone: true, complaint: true });

    if (hasErrors) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const result = await submitComplaintAction({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        complaint: form.complaint,
      });

      if (result.success) {
        setStatus({ type: "success", message: "Tu reclamo ha sido enviado exitosamente. Nos pondremos en contacto contigo a la brevedad posible." });
        setForm({ name: "", email: "", phone: "", complaint: "" });
        setTouched({});
      } else {
        setStatus({ type: "error", message: result.error ?? "No se pudo enviar el reclamo. Intenta nuevamente." });
      }
    } catch {
      setStatus({ type: "error", message: "Ocurrió un error inesperado. Intenta nuevamente." });
    } finally {
      setSubmitting(false);
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

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-bold text-foreground">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    className={`bg-background border-border focus-visible:ring-primary h-11 ${touched.name && errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.name}
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
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="johndoe@example.com"
                      className={`bg-background border-border focus-visible:ring-primary h-11 ${touched.email && errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.email}
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
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+51 999 999 999"
                      className={`bg-background border-border focus-visible:ring-primary h-11 ${touched.phone && errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.phone}
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
                    name="complaint"
                    value={form.complaint}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe tu situación con detalle (mínimo 30 caracteres)..."
                    className={`bg-background border-border focus-visible:ring-primary min-h-[140px] resize-none ${touched.complaint && errors.complaint ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    maxLength={MAX_COMPLAINT + 50}
                  />
                  {touched.complaint && errors.complaint && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.complaint}
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
                  disabled={submitting}
                  className="w-full h-12 ai-gradient text-primary-foreground font-bold text-base shadow-glow hover:opacity-90 transition-all rounded-xl mt-4"
                >
                  {submitting ? (
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
