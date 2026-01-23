"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { AREAS_AND_ROLES } from "@/features/onboarding/consts/talent-onboarding-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function AreaAndRoleStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const selectedIndustries = formData.targetIndustries || [];
  const selectedRoles = formData.preferredRoles || [];

  // 1. Toggle para Industrias
  const toggleIndustry = (industry: string) => {
    const isSelected = selectedIndustries.includes(industry);
    const nextValue = isSelected
      ? selectedIndustries.filter((i) => i !== industry)
      : [...selectedIndustries, industry];

    // Al quitar una industria, limpiamos los roles que pertenecen exclusivamente a ella
    // Para simplificar KISS: Si cambia industrias, puede ser útil resetear roles o filtrar
    updateFormData({ targetIndustries: nextValue });
  };

  // 2. Toggle para Roles
  const toggleRole = (role: string) => {
    const isSelected = selectedRoles.includes(role);
    const nextValue = isSelected
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    updateFormData({ preferredRoles: nextValue });
  };

  // 3. Obtener lista combinada de roles según industrias seleccionadas
  const combinedRoles = Array.from(
    new Set(
      selectedIndustries.flatMap(
        (ind) => AREAS_AND_ROLES[ind as keyof typeof AREAS_AND_ROLES] || []
      )
    )
  );

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(AREAS_AND_ROLES).map((industry) => {
            const isSelected = selectedIndustries.includes(industry);
            return (
              <button
                key={industry}
                type="button"
                onClick={() => toggleIndustry(industry)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/[0.03] ring-1 ring-primary"
                    : "border-muted bg-card hover:border-slate-300"
                )}
              >
                <span className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>
                  {industry}
                </span>
                <div className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: ROLES DINÁMICOS */}
      {selectedIndustries.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
          <div className="pt-6 border-t text-center sm:text-left">
            <h2 className="text-xl font-bold tracking-tight">Roles preferidos</h2>
            <p className="text-muted-foreground italic text-sm">
              ¿Qué posiciones te interesan en estas áreas?
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {combinedRoles.map((role) => {
              const isSelected = selectedRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium transition-all",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md scale-105"
                      : "bg-background border-input hover:border-primary/40 text-muted-foreground"
                  )}
                >
                  {role}
                  {isSelected && <Check className="ml-2 w-3 h-3" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
