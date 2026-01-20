import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";

const LEVELS = [
  { id: "EGRESADO", label: "Recién egresado/a", desc: "Buscando mi primera oportunidad" },
  { id: "JUNIOR", label: "Nivel Junior", desc: "Menos de 1 año de experiencia" },
  { id: "MID", label: "Experiencia de 1 a 3 años", desc: "Ya cuento con trayectoria en el área" },
];

export function ExperienceLevelStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">¿En qué etapa profesional te encuentras?</h2>
      <div className="grid gap-4">
        {LEVELS.map((level) => (
          <div
            key={level.id}
            onClick={() => updateFormData({ expLevel: level.id })}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              formData.expLevel === level.id
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/20"
            }`}
          >
            <p className="font-bold">{level.label}</p>
            <p className="text-sm text-muted-foreground">{level.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
