"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { Clock, Calendar, Briefcase, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABILITY_OPTIONS = [
  {
    id: "FULL_TIME",
    label: "Tiempo completo",
    desc: "40h semanales",
    icon: Clock
  },
  {
    id: "PART_TIME",
    label: "Medio tiempo",
    desc: "20h - 30h semanales",
    icon: Calendar
  },
  {
    id: "PROJECT_BASED",
    label: "Por proyecto",
    desc: "Freelance o entregables",
    icon: Briefcase
  },
];

export function AvailabilityStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();

  // Aseguramos que availability siempre sea un array para evitar errores de .includes
  const selectedAvailabilities = formData.availability || [];

  const toggleAvailability = (id: string) => {
    const isSelected = selectedAvailabilities.includes(id);
    const nextValue = isSelected
      ? selectedAvailabilities.filter((item) => item !== id)
      : [...selectedAvailabilities, id];

    updateFormData({ availability: nextValue });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tu disponibilidad</h2>
        <p className="text-muted-foreground italic text-sm">
          ¿Cómo te gustaría comprometerte? Puedes elegir varias opciones.
        </p>
      </div>

      {errors.availability && (
        <p className="text-sm text-red-600 mt-1">{errors.availability}</p>
      )}

      <div className="grid gap-4">
        {AVAILABILITY_OPTIONS.map(({ id, label, desc, icon: Icon }) => {
          const isSelected = selectedAvailabilities.includes(id);

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleAvailability(id)}
              className={cn(
                "relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left w-full",
                isSelected
                  ? "border-primary bg-primary/[0.1] shadow-sm"
                  : "border-muted bg-card hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={cn("font-bold", isSelected ? "text-white" : "text-gray-400")}>
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {desc}
                  </span>
                </div>
              </div>

              {/* Checkbox circular custom */}
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "bg-primary border-primary scale-110" : "border-muted"
              )}>
                {isSelected && <Check className="w-3.5 h-3.5 text-gray-600" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
