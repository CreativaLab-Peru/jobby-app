"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoveRight, Route, Sparkles, User, Brain, Search, Check, GraduationCap, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createRoute } from "@/features/routes/actions/create-route";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouteStore } from "@/store/use-route-store";
import { RoutePublicitySuggestion } from "@prisma/client";

const steps = [
  { icon: User, title: "Perfil", label: "Sube tu trayectoria." },
  { icon: Brain, title: "IA", label: "Detectamos brechas." },
  { icon: Sparkles, title: "Matches", label: "Encuentra oportunidades." },
  { icon: Route, title: "Ruta", label: "Visualiza tu camino." },
];


export default function CreateRouteForm({ initialSuggestions = [] }: { initialSuggestions?: RoutePublicitySuggestion[] }) {
  const router = useRouter();
  const { hydrate } = useRouteStore();

  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const suggestions = initialSuggestions;

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
      if (routes.success) {
        hydrate(routes.routes);
      }

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Algo falló.");
    } finally {
      setLoading(false);
    }
  };

  const ICON_MAP: Record<string, LucideIcon> = {
    GraduationCap, Sparkles, Route, User, Brain, Plus, Search,
  };
  const renderIcon = (iconName: string | null) => {
    const Icon = ICON_MAP[iconName || "Sparkles"] ?? Sparkles;
    return <Icon className="h-4 w-4" />;
  };

  const filtered = query === ""
    ? suggestions
    : suggestions.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description?.toLowerCase().includes(query.toLowerCase())
    );

  const handleSelect = (title: string) => {
    setName(title === name ? "" : title);
    setQuery("");
    if (error) setError("");
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
          <p className="text-sm text-muted-foreground">
            Define tu objetivo o elige una sugerencia.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-secondary/30 rounded-xl border text-left">
          {steps.map(({ icon: Icon, title, label }) => (
            <div key={title} className="flex items-start gap-2">
              <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight">{title}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          {/* Search / manual input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busca o escribe tu objetivo..."
              value={query || name}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                setName(val);
                if (error) setError("");
              }}
              disabled={loading}
              className="h-11 pl-10"
            />
          </div>

          {/* Suggestions — always all visible, selected one gets a checkmark */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
              {filtered.map((s) => {
                const selected = name === s.title;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(s.title)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0 transition-colors",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {renderIcon(s.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">{s.title}</p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>
                      )}
                    </div>
                    {selected && (
                      <div className="shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading || !name.trim()} className="w-full h-11">
            {loading ? "Creando..." : (
              <> Comenzar <MoveRight className="ml-2 h-4 w-4" /> </>
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
