"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PERU_CITIES } from "@/features/onboarding/consts/talent-onboarding-data";
import { Monitor, Building2, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MODALITIES = [
  { id: "REMOTE", label: "Remoto", icon: Monitor },
  { id: "HYBRID", label: "Híbrido", icon: Building2 },
  { id: "ONSITE", label: "Presencial", icon: MapPin },
];

export function ModalityStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const toggleModality = (id: string) => {
    const current = formData.workModality || [];
    const next = current.includes(id)
      ? current.filter(m => m !== id)
      : [...current, id];
    updateFormData({ workModality: next });
  };

  const needsCity = formData.workModality?.some(m => ["HYBRID", "ONSITE"].includes(m));

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Preferencia de trabajo</h2>
          <p className="text-muted-foreground italic text-sm">Puedes seleccionar más de una opción.</p>
        </div>

        <div className="grid gap-4">
          {MODALITIES.map(({ id, label, icon: Icon }) => {
            const isSelected = formData.workModality?.includes(id);
            return (
              <button
                key={id}
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
                    isSelected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>
                    {label}
                  </span>
                </div>

                {/* Indicador visual de selección */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "border-muted"
                )}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {needsCity && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="pt-6 border-t">
            <Label className="text-sm font-bold ml-1">¿En qué ciudad te encuentras?</Label>
            <p className="text-xs text-muted-foreground mb-3 italic">Necesario para vacantes con presencialidad.</p>
            <Select
              value={formData.cities?.[0]}
              onValueChange={(val) => updateFormData({ cities: [val] })}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 focus:ring-primary shadow-sm">
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PERU_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
