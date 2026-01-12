"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Home, Bug, ArrowLeft, Cpu, AlertCircle } from "lucide-react";

export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podrías integrar Sentry o LogRocket
    console.error("Segment error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="container max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Hero Icon Section */}
          <div className="relative inline-block">
            <motion.div
              animate={{
                rotate: [0, -5, 5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-card border-2 border-border rounded-[2.5rem] flex items-center justify-center shadow-glow relative z-10"
            >
              <Cpu className="w-14 h-14 text-primary" />
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2"
              >
                <AlertCircle className="w-6 h-6 text-secondary" />
              </motion.div>
            </motion.div>
            <div className="absolute -inset-2 bg-secondary/20 blur-2xl rounded-full -z-10 animate-pulse" />
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Proceso <span className="ai-gradient-text text-white">Interrumpido</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto leading-relaxed">
              La IA encontró un obstáculo inesperado al procesar esta sección. No es tu culpa, vamos a reintentarlo.
            </p>
          </div>

          {/* Action Card */}
          <Card className="bg-card/50 border-border backdrop-blur-xl shadow-2xl">
            <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 text-left">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Bug className="w-4 h-4 text-secondary" /> Protocolo de recuperación
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-left space-y-6">
              <div className="grid gap-4">
                {[
                  { text: "Intentar reiniciar el motor de la página", color: "bg-primary" },
                  { text: "Verificar si hay problemas de conexión", color: "bg-secondary" },
                  { text: "Navegar de vuelta al centro de mando", color: "bg-muted-foreground" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-1.5 h-1.5 rounded-full ${step.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                    <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-red-400/80 break-all leading-relaxed">
                  <p className="font-bold text-red-400 mb-1 tracking-widest uppercase underline">Trace log:</p>
                  {error.message}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Final Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={reset}
              className="h-14 px-10 ai-gradient text-white font-black uppercase tracking-widest border-none shadow-glow hover:scale-105 transition-all w-full sm:w-auto"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Intentar de nuevo
            </Button>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="h-14 flex-1 sm:px-8 border-2 font-black uppercase tracking-widest hover:bg-muted"
              >
                <Home className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="h-14 flex-1 sm:px-8 font-black uppercase tracking-widest hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Atrás
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
