"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { AREAS_AND_ROLES } from "@/features/onboarding/consts/talent-onboarding-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function AreaAndRoleStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleAreaChange = (area: string) => {
    updateFormData({ mainArea: area, primaryRole: undefined });
  };

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* 1. Selección de Área */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Especialidad principal</h2>
          <p className="text-muted-foreground italic text-sm">¿En qué sector te desempeñas?</p>
        </div>

        <RadioGroup
          value={formData.mainArea}
          onValueChange={handleAreaChange}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {Object.keys(AREAS_AND_ROLES).map((area) => {
            const isSelected = formData.mainArea === area;
            return (
              <div key={area}>
                <RadioGroupItem value={area} id={area} className="sr-only" />
                <Label
                  htmlFor={area}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/[0.03] ring-1 ring-primary"
                      : "border-muted bg-card hover:border-slate-300"
                  )}
                >
                  <span className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>
                    {area}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-primary" strokeWidth={3} />}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* 2. Selección de Rol (Solo si hay área) */}
      {formData.mainArea && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="pt-6 border-t text-center sm:text-left">
            <h2 className="text-xl font-bold tracking-tight">Tu rol específico</h2>
            <p className="text-muted-foreground italic text-sm">Selecciona el cargo que mejor te define.</p>
          </div>

          <RadioGroup
            value={formData.primaryRole}
            onValueChange={(val) => updateFormData({ primaryRole: val })}
            className="flex flex-wrap gap-2 justify-center sm:justify-start"
          >
            {AREAS_AND_ROLES[formData.mainArea as keyof typeof AREAS_AND_ROLES].map((role) => {
              const isSelected = formData.primaryRole === role;
              return (
                <div key={role}>
                  <RadioGroupItem value={role} id={role} className="sr-only" />
                  <Label
                    htmlFor={role}
                    className={cn(
                      "inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm scale-105"
                        : "bg-background border-input hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {role}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
