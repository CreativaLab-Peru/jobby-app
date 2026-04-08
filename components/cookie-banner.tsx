"use client";

import { useEffect, useState } from "react";
import { useCookieStore } from "@/store/use-cookie-store";
import { Button } from "@/components/ui/button"; // Asumiendo que usas Shadcn
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const { hasAccepted, setAccepted } = useCookieStore();
  const [mounted, setMounted] = useState(false);

  // Evitar errores de hidratación en Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || hasAccepted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-8 md:max-w-md"
      >
        <div className="bg-background/95 border border-border backdrop-blur-md p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Preferencias de Cookies</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                En <strong>Levely</strong> utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido de nuestra plataforma de IA.
              </p>
            </div>
            <button
              onClick={() => setAccepted(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => window.open('/politica-de-privacidad', '_blank')}
            >
              Leer más
            </Button>
            <Button
              size="sm"
              className="text-xs px-6"
              onClick={() => setAccepted(true)}
            >
              Aceptar todo
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
