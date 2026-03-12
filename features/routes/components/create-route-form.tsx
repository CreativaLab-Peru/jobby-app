"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoute } from "@/features/routes/actions/create-route";

export default function CreateRouteForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Ingresa un nombre para tu ruta.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await createRoute(name.trim());
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.message || "Error al crear la ruta.");
      }
    });
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Route className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              Crea tu primera ruta
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Una ruta te guiará paso a paso: crear tu CV, analizarlo con IA y
              encontrar oportunidades que se ajusten a tu perfil.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="route-name">
              Nombre de tu ruta
            </label>
            <Input
              id="route-name"
              placeholder='Ej: "Mi camino en tecnología"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={isPending}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="w-full font-bold"
          >
            {isPending ? (
              "Creando..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Comenzar mi ruta
              </>
            )}
          </Button>
        </div>

        {/* Steps preview */}
        <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Lo que harás
          </p>
          {[
            { step: "1", label: "Crea o sube tu CV" },
            { step: "2", label: "Analízalo con IA y mejóralo" },
            { step: "3", label: "Encuentra oportunidades ideales" },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {s.step}
              </span>
              <span className="text-sm text-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

