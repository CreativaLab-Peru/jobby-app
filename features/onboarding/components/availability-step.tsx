"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Briefcase, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Definimos las opciones con metadatos para limpiar el render
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
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tu disponibilidad</h2>
        <p className="text-muted-foreground italic text-sm">
          ¿Cómo te gustaría comprometerte con tu próximo reto?
        </p>
      </div>

      <RadioGroup
        value={formData.availability}
        onValueChange={(v) => updateFormData({ availability: v })}
        className="grid gap-4"
      >
        {AVAILABILITY_OPTIONS.map(({ id, label, desc, icon: Icon }) => {
          const isSelected = formData.availability === id;

          return (
            <div key={id}>
              <RadioGroupItem value={id} id={id} className="sr-only" />
              <Label
                htmlFor={id}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-sm"
                    : "border-muted bg-card hover:border-slate-300"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    isSelected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {desc}
                    </span>
                  </div>
                </div>

                {/* Check animado a la derecha */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary scale-110" : "border-muted"
                )}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
