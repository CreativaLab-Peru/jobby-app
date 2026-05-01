"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { Briefcase, GraduationCap, Award, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [
  {
    id: "ESTUDIANTE",
    label: "Estudiante",
    desc: "Cursando pregrado o posgrado.",
    icon: GraduationCap
  },
  {
    id: "RECIEN_EGRESADO",
    label: "Recién egresado",
    desc: "Menos de 2 años desde que terminé.",
    icon: Briefcase
  },
  {
    id: "PROFESIONAL",
    label: "Profesional",
    desc: "Tengo experiencia laboral activa.",
    icon: Award
  },
  {
    id: "EMPRENDEDOR",
    label: "Emprendedor",
    desc: "Tengo o estoy construyendo un proyecto.",
    icon: Award
  },
];

export function ExperienceLevelStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Header Directo */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Etapa profesional</h2>
        <p className="text-muted-foreground italic text-sm">
          Esto nos ayuda a filtrar las vacantes que mejor se adapten a ti.
        </p>
      </div>

      {errors.expLevel && (
        <p className="text-sm text-red-600 mt-1">{errors.expLevel}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
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
                isSelected ? "bg-primary dark:text-levely-dark text-white" : "bg-secondary text-muted-foreground"
              )}>
                <Icon className="w-6 h-6" />
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
                  <Check className="w-4 h-4 text-white dark:text-levely-dark" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
