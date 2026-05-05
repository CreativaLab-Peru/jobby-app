"use client";

import { useCompanyOnboardingStore } from "../../store/company-onboarding-store";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CompanySeekingType } from "@prisma/client";
import { Users, GraduationCap, Briefcase, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPOSES = [
  {
    id: CompanySeekingType.TALENT,
    title: "Talento",
    description: "Encuentra y gestiona el mejor talento activo para tu organización.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: CompanySeekingType.SCHOLARSHIPS,
    title: "Becas, intercambios, aceleradoras",
    description: "Promueve programas académicos y de crecimiento profesional.",
    icon: GraduationCap,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  {
    id: CompanySeekingType.EMPLOYMENT,
    title: "Empleos",
    description: "Publica vacantes directas y conecta con profesionales calificados.",
    icon: Briefcase,
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
];

export function StepPurpose() {
  const { formData, updateFormData, errors } = useCompanyOnboardingStore();

  const togglePurpose = (type: CompanySeekingType) => {
    const current = formData.seekingTypes;
    if (current.includes(type)) {
      updateFormData({ seekingTypes: current.filter((t) => t !== type) });
    } else {
      updateFormData({ seekingTypes: [...current, type] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Diferencial</h2>
        <p className="text-muted-foreground">
          ¿Cuál es el propósito principal de tu empresa en Levely?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PURPOSES.map((purpose) => {
          const isSelected = formData.seekingTypes.includes(purpose.id);
          const Icon = purpose.icon;

          return (
            <Card
              key={purpose.id}
              onClick={() => togglePurpose(purpose.id)}
              className={cn(
                "relative group cursor-pointer p-6 space-y-4 border-2 transition-all duration-300 hover:shadow-lg active:scale-95 rounded-[2rem]",
                isSelected
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border/60 bg-card/50 hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  purpose.color,
                )}
              >
                <Icon className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight">{purpose.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {purpose.description}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="h-4 w-4 text-white stroke-[3px]" />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {errors.seekingTypes && (
        <p className="text-center text-sm text-destructive font-medium animate-bounce">
          {errors.seekingTypes}
        </p>
      )}
    </div>
  );
}
