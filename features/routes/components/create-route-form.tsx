"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoveRight, Route, Sparkles, User, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoute } from "@/features/routes/actions/create-route";
import { useRouteStore } from "@/store/use-route-store";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";

export default function CreateRouteForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const { hydrate } = useRouteStore();

  const suggestions = [
    "Máster en UK",
    "MBA en Europa",
    "Becas en STEM",
  ];

  const handleSuggestionClick = (value: string) => {
    setName(value);
    setError("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Ingresa un nombre para tu ruta.");
      return;
    }
    setError("");

    startTransition(async () => {
      const result = await createRoute(name.trim());
      if (!result.success) {
        setError(result.message || "Error al crear la ruta.");
        return;
      }

      const routesResult = await getRoutesForUser();
      if (!routesResult.success) {
        setError(
          routesResult.message ||
            "Ruta creada, pero no se pudieron cargar las rutas."
        );
        return;
      }

      hydrate(routesResult.routes);
      router.refresh();
      router.push("/dashboard");
    });
  };

  const steps = [
    {
      icon: User,
      title: "Sincronización de Perfil",
      label: "Sube tu trayectoria para el diagnóstico inicial.",
    },
    {
      icon: Brain,
      title: "Auditoría de IA",
      label: "Identificamos tus brechas de competitividad global.",
    },
    {
      icon: Sparkles,
      title: "Revelación de Matches",
      label:
        "Acceso a fondos, becas y vacantes de alta compatibilidad listos para que apliques.",
    },
  ];

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Route className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              Crea tu primera ruta
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Localizamos Becas Full Funded en USA/UK/EU, Fellowships y Grants para tus proyectos que encajan con tu perfil real.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="route-name">
              Define el propósito de tu ruta
            </label>

            <Input
              id="route-name"
              placeholder='Ej: "Master en UK, Fellowship en IA, etc."'
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={isPending}
            />

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  disabled={isPending}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

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
                Comenzar
                <MoveRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Steps */}
        <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Auditoría en Tiempo Real
          </p>

          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <div key={i} className="flex items-start gap-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </span>

                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-semibold text-foreground leading-none">
                    {s.title}
                  </span>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}