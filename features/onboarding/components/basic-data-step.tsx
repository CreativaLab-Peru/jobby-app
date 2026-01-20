import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useOnboardingStore} from "@/features/onboarding/store/talent-onboarding-store";
import {DateInput} from "@/components/form/date-input";

export function BasicDataStep() {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Cuéntanos sobre ti</h2>
        <p className="text-muted-foreground">Información básica para tu perfil profesional.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre y Apellido</Label>
          <Input
            id="name"
            placeholder="Ej: Juan Pérez"
            value={formData.name || ""}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>

        {/* Nuevo Input de Fecha Profesional */}
        <DateInput
          label="Fecha de nacimiento"
          value={formData.birthDate}
          onChange={(val) => updateFormData({ birthDate: val })}
        />

        <div className="grid gap-2">
          <Label>País</Label>
          <Select
            value={formData.country}
            onValueChange={(val) => updateFormData({ country: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent className="max-h-[250px]">
              <SelectItem value="PE">Perú</SelectItem>
              <SelectItem value="AR">Argentina</SelectItem>
              <SelectItem value="CL">Chile</SelectItem>
              <SelectItem value="CO">Colombia</SelectItem>
              <SelectItem value="MX">México</SelectItem>
              <SelectItem value="ES">España</SelectItem>
              <SelectItem value="US">Estados Unidos</SelectItem>
              {/* Agrega más países según sea necesario */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
