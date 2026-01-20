import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {SKILLS_BY_AREA} from "@/features/onboarding/consts/talent-onboarding-data";

export function SkillsStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const availableSkills = SKILLS_BY_AREA[formData.mainArea as keyof typeof SKILLS_BY_AREA] || [];

  const handleToggleSkill = (skillName: string) => {
    const isSelected = formData.skills.find(s => s.name === skillName);
    if (isSelected) {
      updateFormData({ skills: formData.skills.filter(s => s.name !== skillName) });
    } else if (formData.skills.length < 5) {
      updateFormData({ skills: [...formData.skills, { name: skillName, level: 'Intermedio' }] });
    }
  };

  const updateLevel = (name: string, level: 'Intermedio' | 'Avanzado') => {
    updateFormData({
      skills: formData.skills.map(s => s.name === name ? { ...s, level } : s)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Habilidades en {formData.mainArea}</h2>
      <p className="text-sm text-muted-foreground">Selecciona entre 3 y 5 herramientas.</p>

      <div className="grid grid-cols-1 gap-4">
        {availableSkills.map(skill => {
          const selected = formData.skills.find(s => s.name === skill);
          return (
            <div key={skill} className={`p-4 border rounded-xl transition-all ${selected ? 'border-primary ring-1 ring-primary' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={!!selected} onCheckedChange={() => handleToggleSkill(skill)} />
                  <span className="font-semibold">{skill}</span>
                </div>
                {selected && (
                  <div className="flex gap-2">
                    {['Intermedio', 'Avanzado'].map((lvl) => (
                      <Button
                        key={lvl}
                        variant={selected.level === lvl ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateLevel(skill, lvl as any)}
                      >
                        {lvl}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
