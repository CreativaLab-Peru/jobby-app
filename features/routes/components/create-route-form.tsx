"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoveRight, Route, Sparkles, User, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoute } from "@/features/routes/actions/create-route";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouteStore } from "@/store/use-route-store";

const suggestions = ["Máster en UK", "MBA en Europa", "Becas en STEM"];

const steps = [
  { icon: User, title: "Perfil", label: "Sube tu trayectoria." },
  { icon: Brain, title: "IA", label: "Detectamos brechas." },
  { icon: Sparkles, title: "Matches", label: "Encuentra oportunidades." },
  { icon: Route, title: "Ruta", label: "Visualiza tu camino." },
];

export default function CreateRouteForm() {
  const router = useRouter();
  const { hydrate } = useRouteStore();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const value = name.trim();
    if (!value) return setError("Ingresa un nombre.");

    try {
      setLoading(true);
      setError("");

      const res = await createRoute(value);
      if (!res.success) throw new Error(res.message);

      const routes = await getRoutesForUser();
      if (!routes.success) throw new Error(routes.message);

      hydrate(routes.routes);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Algo falló.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-primary/10">
            <Route className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary">Crea tu ruta</h1>
          <p className="text-sm text-muted-foreground">Define tu objetivo.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Ej: Master en UK"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setName(s)}
                className="text-xs px-3 py-1 rounded-full border bg-primary/5 text-primary"
              >
                {s}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading || !name.trim()} className="w-full">
            {loading ? (
              "Creando..."
            ) : (
              <>
                Comenzar <MoveRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Steps */}
        <div className="my-10 border rounded-xl p-4 space-y-3 bg-secondary/30">
          {steps.map(({ icon: Icon, title, label }) => (
            <div key={title} className="flex gap-3">
              <Icon className="h-4 w-4 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
