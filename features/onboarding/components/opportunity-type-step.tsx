"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { OPPORTUNITY_MAP } from "@/const";

export function OpportunityTypeStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();
  const selectedTypes = formData.opportunityTypes || [];

  const toggleType = (key: string) => {
    const isSelected = selectedTypes.includes(key);
    const nextTypes = isSelected
      ? selectedTypes.filter((t) => t !== key)
      : [...selectedTypes, key];

    updateFormData({ opportunityTypes: nextTypes });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight">¿Qué estás buscando?</h2>
        <p className="text-muted-foreground italic text-sm">
          Selecciona los tipos de oportunidades que te interesan.
        </p>
      </div>

      {errors.opportunityType && (
        <p className="text-sm text-red-600 mt-1 text-center font-medium">
          {errors.opportunityType}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {/* NOTA: Quitar el filter de internship y employment para que muestre todas las oportunidades*/}
        {Object.entries(OPPORTUNITY_MAP)
          .filter(([key]) => !["INTERNSHIP", "EMPLOYMENT"].includes(key))
          .map(([key, { label, description }]) => {
            const isSelected = selectedTypes.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleType(key)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group w-full",
                  isSelected
                    ? "border-primary bg-primary/[0.04] ring-1 ring-primary"
                    : "border-muted bg-card hover:border-primary/30"
                )}
              >
                <div className="flex flex-col gap-1 pr-4 flex-1">
                  <span className={cn(
                    "font-semibold text-base leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {label}
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-2 leading-snug">
                    {description}
                  </span>
                </div>

                <div className={cn(
                  "w-6 h-6 shrink-0 rounded-full border flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                )}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-secondary" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
