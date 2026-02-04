import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import { DateInput } from "@/components/form/date-input";
import {FormField} from "@/components/form-field";
import {Mail} from "lucide-react";

export function BasicDataStep() {
  const { formData, updateFormData, errors } = useOnboardingStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Título y Subtítulo: Directo al grano */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Información Personal</h2>
        <p className="text-muted-foreground italic">
          Esto nos ayuda a personalizar tu perfil profesional.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Nombre: El campo más importante primero */}
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-bold ml-1">
            Nombre completo
          </Label>
          <Input
            id="name"
            placeholder="Ej: Juan Pérez"
            className="h-12 text-base rounded-xl border-slate-200 focus:ring-primary shadow-sm"
            value={formData.name || ""}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Grid para agrupar Fecha y País en Desktop, apilados en Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <DateInput
              label="Fecha de nacimiento"
              value={formData.birthDate}
              onChange={(val) => updateFormData({ birthDate: val })}
              // Asegúrate que DateInput use internamente un estilo similar al Input h-12
            />
            {errors.birthDate && (
              <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-bold ml-1 text-slate-700">País</Label>
            <Select
              value={formData.country}
              onValueChange={(val) => updateFormData({ country: val })}
            >
              <SelectTrigger className="h-12 text-base rounded-xl border-slate-200 shadow-sm">
                <SelectValue placeholder="¿Dónde resides?" />
              </SelectTrigger>
              <SelectContent className="max-h-[250px] rounded-xl border-slate-200 shadow-lg">
                <SelectItem value="PE">🇵🇪 Perú</SelectItem>
                <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                <SelectItem value="CL">🇨🇱 Chile</SelectItem>
                <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                <SelectItem value="MX">🇲🇽 México</SelectItem>
                <SelectItem value="ES">🇪🇸 España</SelectItem>
                <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
