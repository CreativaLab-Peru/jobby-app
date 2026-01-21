"use client";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { SKILLS_BY_AREA } from "@/features/onboarding/consts/talent-onboarding-data";
import { Badge } from "@/components/ui/badge";
import { Check, Info, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillsStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const availableSkills = SKILLS_BY_AREA[formData.mainArea as keyof typeof SKILLS_BY_AREA] || [];

  const selectedSkills = formData.skills || [];
  const canAddMore = selectedSkills.length < 5;

  const handleToggleSkill = (skillName: string) => {
    const isSelected = selectedSkills.some(s => s.name === skillName);

    if (isSelected) {
      updateFormData({ skills: selectedSkills.filter(s => s.name !== skillName) });
    } else if (canAddMore) {
      updateFormData({
        skills: [...selectedSkills, { name: skillName, level: 'Intermedio' }]
      });
    }
  };

  const toggleLevel = (name: string) => {
    updateFormData({
      skills: selectedSkills.map(s =>
        s.name === name
          ? { ...s, level: s.level === 'Intermedio' ? 'Avanzado' : 'Intermedio' }
          : s
      )
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Header con contador de progreso */}
      <div className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Habilidades clave</h2>
          <p className="text-muted-foreground text-sm italic">
            Selecciona tus herramientas más fuertes.
          </p>
        </div>
        <div className="text-right">
          <span className={cn(
            "text-2xl font-black",
            selectedSkills.length >= 3 ? "text-green-500" : "text-primary"
          )}>
            {selectedSkills.length}
          </span>
          <span className="text-muted-foreground font-bold">/5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {availableSkills.map(skill => {
          const selection = selectedSkills.find(s => s.name === skill);
          const isSelected = !!selection;
          const isDisabled = !isSelected && !canAddMore;

          return (
            <div
              key={skill}
              className={cn(
                "group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/[0.02] shadow-sm"
                  : "border-muted bg-card",
                isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-slate-300"
              )}
              onClick={() => !isDisabled && handleToggleSkill(skill)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary" : "border-muted group-hover:border-primary/50"
                )}>
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <span className={cn(
                  "font-bold transition-colors",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {skill}
                </span>
              </div>

              {/* Selector de Nivel: Estilo minimalista */}
              {isSelected && (
                <div
                  className="flex items-center bg-white dark:bg-slate-900 border rounded-full p-1 shadow-sm"
                  onClick={(e) => { e.stopPropagation(); toggleLevel(skill); }}
                >
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black transition-all",
                    selection.level === 'Intermedio' ? "bg-slate-100 text-slate-600" : "text-muted-foreground/40"
                  )}>
                    Intermedio
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black transition-all",
                    selection.level === 'Avanzado' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/40"
                  )}>
                    Avanzado
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-4 bg-secondary/30 rounded-xl text-xs text-muted-foreground">
        <Info className="w-4 h-4" />
        Para mejores resultados, elige al menos 3 habilidades.
      </div>
    </div>
  );
}
