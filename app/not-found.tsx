"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Ghost, Map, Terminal } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
      {/* Background Decor: Grid de fondo tecnológico */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Visual: Ghost en lugar de FileQuestion */}
          <div className="relative mb-12 inline-block">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 inline-flex items-center justify-center w-40 h-40 bg-card border-2 border-border rounded-3xl shadow-glow"
            >
              <Ghost className="w-20 h-20 text-primary" />
            </motion.div>

            {/* Sombras y Luces AI */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-primary/20 blur-xl rounded-full" />
            <div className="absolute top-0 right-0 w-32 h-32 ai-gradient blur-[80px] opacity-20 -z-10" />
          </div>

          {/* Textos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-muted/20 leading-none">
              404
            </h1>
            <div className="-mt-12 md:-mt-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
                Ruta <span className="ai-gradient-text">No Encontrada</span>
              </h2>
              <p className="text-muted-foreground font-medium max-w-md mx-auto">
                Parece que esta sección aún no ha sido mapeada por nuestra IA.
                Incluso los mejores exploradores se pierden a veces.
              </p>
            </div>
          </motion.div>

          {/* Card de sugerencias estilo "Terminal" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 max-w-lg mx-auto"
          >
            <Card className="bg-card/50 border-border backdrop-blur-md overflow-hidden text-left">
              <div className="bg-muted px-4 py-2 border-b border-border flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-secondary/50" />
              </div>
              <CardContent className="p-6 font-mono text-sm">
                <div className="flex gap-3 mb-3">
                  <span className="text-secondary tracking-widest font-bold">PROMPT:</span>
                  <span className="text-foreground italic">buscar_solucion.sh</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" /> Verificar ortografía de la URL
                  </p>
                  <p className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" /> Consultar el menú lateral
                  </p>
                  <p className="flex items-center gap-2 text-secondary font-bold">
                    {'>'} Intentar regresar al panel principal
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => router.push("/dashboard")}
              className="h-14 px-8 ai-gradient text-white font-black uppercase tracking-widest border-none shadow-glow hover:scale-105 transition-transform"
            >
              <Home className="w-5 h-5 mr-2" />
              Mi Panel
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-14 px-8 border-2 font-black uppercase tracking-widest hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Regresar
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
