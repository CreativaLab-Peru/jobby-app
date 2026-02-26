"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {OPPORTUNITY_CONFIG} from "@/const";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(OPPORTUNITY_CONFIG).map(([key, label]) => {
          const isSelected = selectedTypes.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleType(key)}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left group",
                isSelected
                  ? "border-primary bg-primary/[0.04] ring-1 ring-primary"
                  : "border-muted bg-card hover:border-primary/30"
              )}
            >
              <span className={cn(
                "font-semibold text-base",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {label}
              </span>

              <div className={cn(
                "w-6 h-6 shrink-0 rounded-full border flex items-center justify-center transition-all",
                isSelected
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30 group-hover:border-primary/50"
              )}>
                {isSelected && <Check className="w-3.5 h-3.5 text-black dark:text-secondary" strokeWidth={4} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
