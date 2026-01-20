"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {AREAS_AND_ROLES} from "@/features/onboarding/consts/talent-onboarding-data";

export function AreaAndRoleStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleAreaChange = (area: string) => {
    updateFormData({ mainArea: area, primaryRole: undefined }); // Reset role when area changes
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-bold">1. ¿En qué área te gustaría desarrollarte?</Label>
        </div>
        <RadioGroup
          value={formData.mainArea}
          onValueChange={handleAreaChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {Object.keys(AREAS_AND_ROLES).map((area) => (
            <Label key={area} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value={area} />
              <span>{area}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {formData.mainArea && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <Label className="text-lg font-bold text-primary">2. ¿En qué rol quieres que te encuentren?</Label>
          </div>
          <RadioGroup
            value={formData.primaryRole}
            onValueChange={(val) => updateFormData({ primaryRole: val })}
            className="grid grid-cols-1 gap-3"
          >
            {AREAS_AND_ROLES[formData.mainArea as keyof typeof AREAS_AND_ROLES].map((role) => (
              <Label key={role} className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                <RadioGroupItem value={role} />
                <span>{role}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
