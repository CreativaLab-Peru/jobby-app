"use client";

import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { SKILLS_BY_AREA } from "@/features/onboarding/consts/talent-onboarding-data";
import { Check, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillsStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const selectedIndustries = formData.targetIndustries || [];
  const selectedSkills = formData.skills || [];

  // 1. Obtener lista de skills basada en las áreas seleccionadas
  // Extraemos [key, label] de cada área seleccionada
  const availableSkills = selectedIndustries.flatMap((areaKey) => {
    const areaSkills = SKILLS_BY_AREA[areaKey as keyof typeof SKILLS_BY_AREA];
    if (!areaSkills) return [];
    return Object.entries(areaSkills).map(([key, label]) => ({
      id: key,
      label: label,
    }));
  }).sort((a, b) => a.label.localeCompare(b.label)); // Orden alfabético por el label

  const canAddMore = selectedSkills.length < 5;
  const hasMinSkills = selectedSkills.length >= 3;

  const handleToggleSkill = (skillId: string) => {
    const isSelected = selectedSkills.some(s => s.name === skillId);

    if (isSelected) {
      updateFormData({
        skills: selectedSkills.filter(s => s.name !== skillId)
      });
    } else if (canAddMore) {
      updateFormData({
        skills: [...selectedSkills, { name: skillId, level: 'Intermedio' }]
      });
    }
  };

  const toggleLevel = (id: string) => {
    updateFormData({
      skills: selectedSkills.map(s =>
        s.name === id
          ? { ...s, level: s.level === 'Intermedio' ? 'Avanzado' : 'Intermedio' }
          : s
      )
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Header con indicador de validación */}
      <div className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Habilidades clave</h2>
          <p className="text-muted-foreground text-sm italic">
            Basado en tus {selectedIndustries.length > 1 ? "áreas de interés" : "área de interés"}.
          </p>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-2xl font-black transition-colors",
            hasMinSkills ? "text-green-500" : "text-primary"
          )}>
            {selectedSkills.length}
            <span className="text-muted-foreground text-lg font-bold">/5</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
        {availableSkills.length > 0 ? (
          availableSkills.map(skill => {
            const selection = selectedSkills.find(s => s.name === skill.id);
            const isSelected = !!selection;
            const isDisabled = !isSelected && !canAddMore;

            return (
              <div
                key={skill.id}
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/[0.02] shadow-sm"
                    : "border-muted bg-card",
                  isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-slate-300"
                )}
                onClick={() => !isDisabled && handleToggleSkill(skill.id)}
              >
                <div className="flex items-center gap-4 pr-4">
                  <div className={cn(
                    "w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-primary border-primary" : "border-muted group-hover:border-primary/50"
                  )}>
                    {isSelected && <Check className="w-4 h-4 text-white dark:text-levely-dark" strokeWidth={3} />}
                  </div>
                  <span className={cn(
                    "font-bold transition-colors text-sm sm:text-base",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {skill.label}
                  </span>
                </div>

                {isSelected && (
                  <div
                    className="border-gray-400 flex items-center bg-background border rounded-full p-1 shadow-sm shrink-0"
                    onClick={(e) => { e.stopPropagation(); toggleLevel(skill.id); }}
                  >
                    <button
                      type="button"
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black transition-all",
                        selection.level === 'Intermedio' ? "bg-secondary text-foreground" : "text-muted-foreground/30"
                      )}
                    >
                      Intermedio
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black transition-all flex items-center gap-1",
                        selection.level === 'Avanzado' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/30"
                      )}
                    >
                      {selection.level === 'Avanzado' && <Sparkles className="w-3 h-3" />}
                      Avanzado
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground text-sm">Regresa al paso anterior para seleccionar áreas de interés.</p>
          </div>
        )}
      </div>

      {!hasMinSkills && availableSkills.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-xs text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
          <Info className="w-4 h-4 shrink-0" />
          Selecciona al menos 3 herramientas para demostrar tu expertise técnico.
        </div>
      )}
    </div>
  );
}
