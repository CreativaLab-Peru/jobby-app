"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Usaremos Switch para relocation
import { Monitor, Building2, MapPin, Check, PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";

const MODALITIES = [
  { id: "REMOTE", label: "Remoto", icon: Monitor },
  { id: "HYBRID", label: "Híbrido", icon: Building2 },
  { id: "ONSITE", label: "Presencial", icon: MapPin },
];

export function ModalityStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();

  const toggleModality = (id: string) => {
    const current = formData.workModality || [];
    const next = current.includes(id)
      ? current.filter(m => m !== id)
      : [...current, id];
    updateFormData({ workModality: next });
  };

  // Lógica para mostrar la opción de reubicación
  const showRelocation = formData.workModality?.some(m => ["HYBRID", "ONSITE"].includes(m));

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Modalidad preferida</h2>
          <div className="max-w-lg mx-auto">
            <p className="text-muted-foreground italic text-sm">
              ¿Buscas inmersión total en el extranjero o prefieres escalar globalmente desde casa?
            </p>
          </div>
        </div>

        {errors.workModality && (
          <p className="text-sm text-red-600 mt-1">{errors.workModality}</p>
        )}

        <div className="grid gap-4">
          {MODALITIES.map(({ id, label, icon: Icon }) => {
            const isSelected = formData.workModality?.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleModality(id)}
                className={cn(
                  "relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left",
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-sm"
                    : "border-muted bg-card hover:border-slate-300"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("font-bold", isSelected ? "text-primary" : "text-gray-500 dark:text-white/60")}>
                    {label}
                  </span>
                </div>

                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "border-muted"
                )}>
                  {isSelected && <Check className="w-4 h-4 text-white dark:text-levely-dark" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nuevo campo: Relocation (según tu esquema de Zod) */}
      {showRelocation && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="pt-6 border-t flex items-center justify-between p-4 rounded-2xl border border-primary gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full shadow-sm">
                <PlaneTakeoff className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">¿Disponibilidad para viajar?</Label>
                <p className="text-xs text-muted-foreground">O reubicación a otra ciudad.</p>
              </div>
            </div>
            <Switch
              checked={formData.relocation}
              onCheckedChange={(val) => updateFormData({ relocation: val })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
