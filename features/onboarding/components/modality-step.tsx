import {Checkbox} from "@/components/ui/checkbox";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {PERU_CITIES} from "@/features/onboarding/consts/talent-onboarding-data";

export function ModalityStep() {
  const {formData, updateFormData} = useOnboardingStore();

  const toggleModality = (id: string) => {
    const current = formData.workModality;
    const next = current.includes(id) ? current.filter(m => m !== id) : [...current, id];
    updateFormData({workModality: next});
  };

  const needsCity = formData.workModality.some(m => ["HYBRID", "ONSITE"].includes(m));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Modalidad de trabajo preferida</h2>
        <div className="grid gap-3">
          {["REMOTE", "HYBRID", "ONSITE"].map((m) => (
            <div key={m} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                checked={formData.workModality.includes(m)}
                onCheckedChange={() => toggleModality(m)}
              />
              <span
                className="capitalize">{m.toLowerCase().replace('remote', 'Remoto').replace('hybrid', 'Híbrido').replace('onsite', 'Presencial')}</span>
            </div>
          ))}
        </div>
      </div>

      {needsCity && (
        <div className="space-y-4 animate-in zoom-in-95">
          <Label>Ciudad de Perú para trabajo presencial/híbrido</Label>
          <Select
            onValueChange={(val) => updateFormData({cities: [val]})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una ciudad"/>
            </SelectTrigger>
            <SelectContent>
              {PERU_CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
