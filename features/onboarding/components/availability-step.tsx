import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export function AvailabilityStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Disponibilidad actual</h2>
      <RadioGroup
        value={formData.availability}
        onValueChange={(v) => updateFormData({ availability: v })}
        className="grid gap-4"
      >
        {["Tiempo completo", "Medio tiempo", "Por proyecto"].map((opt) => (
          <Label key={opt} className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-accent">
            <RadioGroupItem value={opt} />
            <span>{opt}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
