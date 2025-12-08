"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Loader2, Mail} from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Replace with real password reset logic
      await new Promise((r) => setTimeout(r, 1200));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: "easeOut"}}
      className="w-full max-w-md"
    >
      <Card className="shadow-xl border  backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full mb-3 border-2 ">
              <Mail className="w-8 h-8 text-white"/>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gradient">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-sm">
            {!sent && 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <a href="/login" className="text-primary hover:underline">
                  Volver al login
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full shadow-md"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Enviar enlace"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="font-medium">
                ¡Revisa tu correo! Hemos enviado un enlace para restablecer tu contraseña.
              </p>
              <a
                href="/login"
                className="inline-block font-medium text-primary"
              >
                Volver al login
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
