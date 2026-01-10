"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareWarning, ShieldCheck } from "lucide-react";

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    complaint: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      alert("Tu reclamo ha sido enviado exitosamente.");
      setForm({ name: "", email: "", phone: "", complaint: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-card border-border bg-card/50 backdrop-blur-md overflow-hidden">
            {/* Header con identidad Levely */}
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
                <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Tu satisfacción es nuestra prioridad. Valoramos tus comentarios para seguir mejorando nuestro servicio de inteligencia artificial.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-foreground">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold text-foreground">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      required
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+51 999 999 999"
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                {/* Complaint */}
                <div className="space-y-2">
                  <Label htmlFor="complaint" className="text-sm font-bold text-foreground">
                    Detalles del reclamo
                  </Label>
                  <Textarea
                    id="complaint"
                    name="complaint"
                    value={form.complaint}
                    onChange={handleChange}
                    placeholder="Describe tu situación con detalle..."
                    required
                    className="bg-background border-border focus-visible:ring-primary min-h-[140px] resize-none"
                  />
                </div>

                {/* Submit Button - REFACTOR: ai-gradient */}
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

                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                  Levely Compliance System v1.0
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
