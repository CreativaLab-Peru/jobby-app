import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch"; // Shadcn
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {TalentOnboardingFormData} from "@/features/onboarding/schemas";

const INDUSTRIES = ["Fintech", "E-commerce", "SaaS", "Healthtech", "AI & ML", "EdTech"];

export function CultureStep({ form }: { form: UseFormReturn<TalentOnboardingFormData> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Disponibilidad y Sectores</h2>
        <p className="text-muted-foreground">Últimos detalles para personalizar tu búsqueda.</p>
      </div>

      {/* Disponibilidad */}
      <div className="space-y-4">
        <Label>¿Cuándo podrías empezar?</Label>
        <RadioGroup
          onValueChange={(v) => form.setValue("availability", v)}
          className="grid grid-cols-1 gap-3"
        >
          {[
            { id: "IMMEDIATE", label: "Inmediata" },
            { id: "TWO_WEEKS", label: "En 2 semanas" },
            { id: "ONE_MONTH", label: "En 1 mes" },
            { id: "LISTENING", label: "Solo escucho ofertas" },
          ].map((item) => (
            <Label
              key={item.id}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              <RadioGroupItem value={item.id} />
              <span>{item.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Relocación */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>¿Estás abierto a mudarte?</Label>
          <p className="text-sm text-muted-foreground">Si la oferta requiere trabajo presencial en otra ciudad.</p>
        </div>
        <Switch
          onCheckedChange={(checked) => form.setValue("relocation", checked)}
        />
      </div>
    </div>
  );
}
