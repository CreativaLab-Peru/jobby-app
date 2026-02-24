"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { AREAS } from "@/features/onboarding/consts/talent-onboarding-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function AreaAndRoleStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();

  const selectedIndustries = formData.targetIndustries || [];

  // 1. Toggle para Industrias (Áreas)
  const toggleIndustry = (industryKey: string) => {
    const isSelected = selectedIndustries.includes(industryKey);
    let nextIndustries = isSelected
      ? selectedIndustries.filter((i) => i !== industryKey)
      : [...selectedIndustries, industryKey];

    updateFormData({
      targetIndustries: nextIndustries,
      skills: [],
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* SECCIÓN 1: INDUSTRIAS */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Industrias de interés</h2>
          <p className="text-muted-foreground italic text-sm">
            Selecciona una o más áreas donde quieres trabajar.
          </p>
        </div>

        {/* Errores de validación */}
        { errors .targetIndustries && (
          <p className="text-sm text-red-600 mt-1 text-center">{errors.targetIndustries}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(AREAS).map(([key, value]) => {
            const isSelected = selectedIndustries.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleIndustry(key)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/[0.03] ring-1 ring-primary"
                    : "border-muted bg-card hover:border-slate-300"
                )}
              >
                <span className={cn("font-bold leading-tight", isSelected ? "text-primary" : "text-foreground")}>
                  {value.label}
                </span>
                <div className={cn(
                  "w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white dark:text-levely-dark" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: ROLES DINÁMICOS */}
      {/*{selectedIndustries.length > 0 && (*/}
      {/*  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">*/}
      {/*    <div className="pt-6 border-t text-center sm:text-left">*/}
      {/*      <h2 className="text-xl font-bold tracking-tight">Roles preferidos</h2>*/}
      {/*      <p className="text-muted-foreground italic text-sm">*/}
      {/*        ¿Qué posiciones te interesan en estas áreas?*/}
      {/*      </p>*/}
      {/*    </div>*/}

      {/*    /!* Errores de validación *!/*/}
      {/*    { errors.preferredRoles && (*/}
      {/*      <p className="text-sm text-red-600 mt-1 text-center">{errors.preferredRoles}</p>*/}
      {/*    )}*/}

      {/*    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">*/}
      {/*      {combinedRoles.map((role) => {*/}
      {/*        const isSelected = selectedRoles.includes(role.key);*/}
      {/*        return (*/}
      {/*          <button*/}
      {/*            key={role.key}*/}
      {/*            type="button"*/}
      {/*            onClick={() => toggleRole(role.key)}*/}
      {/*            className={cn(*/}
      {/*              "inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium transition-all",*/}
      {/*              isSelected*/}
      {/*                ? "bg-primary text-white dark:text-levely-dark"*/}
      {/*                : "bg-background border-input hover:border-primary/40 text-muted-foreground"*/}
      {/*            )}*/}
      {/*          >*/}
      {/*            {role.label}*/}
      {/*            {isSelected && <Check className="ml-2 w-3 h-3" strokeWidth={3} />}*/}
      {/*          </button>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
