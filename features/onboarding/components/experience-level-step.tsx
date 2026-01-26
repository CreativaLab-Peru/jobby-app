"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { Briefcase, GraduationCap, Award, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [
  {
    id: "EGRESADO",
    label: "Recién egresado/a",
    desc: "Buscando mi primera oportunidad profesional.",
    icon: GraduationCap
  },
  {
    id: "JUNIOR",
    label: "Nivel Junior",
    desc: "Tengo menos de 1 año de experiencia real.",
    icon: Briefcase
  },
  {
    id: "MID",
    label: "Nivel Mid/Senior",
    desc: "Cuento con más de 2 años de trayectoria sólida.",
    icon: Award
  },
];

export function ExperienceLevelStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Header Directo */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Etapa profesional</h2>
        <p className="text-muted-foreground italic text-sm">
          Esto nos ayuda a filtrar las vacantes que mejor se adapten a ti.
        </p>
      </div>

      <div className="grid gap-4">
        {LEVELS.map(({ id, label, desc, icon: Icon }) => {
          const isSelected = formData.expLevel === id;

          return (
            <button
              key={id}
              onClick={() => updateFormData({ expLevel: id })}
              className={cn(
                "relative flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-200 text-left w-full",
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary"
                  : "border-muted bg-card hover:border-slate-300"
              )}
            >
              {/* Icono de estado profesional */}
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                isSelected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
              )}>
                <Icon className="text-gray-400 w-6 h-6" />
              </div>

              <div className="flex-1 space-y-1">
                <p className={cn(
                  "font-bold text-lg",
                  isSelected ? "text-primary" : "text-gray-400"
                )}>
                  {label}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {desc}
                </p>
              </div>

              {/* Check de confirmación */}
              {isSelected && (
                <div className="flex-shrink-0 bg-primary rounded-full p-1 animate-in zoom-in">
                  <Check className="w-4 h-4 text-gray-500" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
