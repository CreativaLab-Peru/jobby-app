"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
      // Replace with real API call
      await new Promise((r) => setTimeout(r, 1000));
      alert("Tu reclamo ha sido enviado exitosamente.");
      setForm({ name: "", email: "", phone: "", complaint: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-xl border border-orange-100 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Libro de Reclamaciones
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-gray-600 text-sm text-center">
                Por favor completa el siguiente formulario para registrar tu reclamo o queja.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="border-gray-300 focus-visible:ring-orange-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
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
                    className="border-gray-300 focus-visible:ring-orange-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+51 999 999 999"
                    className="border-gray-300 focus-visible:ring-orange-500"
                  />
                </div>

                {/* Complaint */}
                <div className="space-y-2">
                  <Label htmlFor="complaint" className="text-gray-700">
                    Detalles del reclamo
                  </Label>
                  <Textarea
                    id="complaint"
                    name="complaint"
                    value={form.complaint}
                    onChange={handleChange}
                    placeholder="Describe tu reclamo con el mayor detalle posible..."
                    required
                    className="border-gray-300 focus-visible:ring-orange-500 min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md cursor-pointer"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Reclamo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
