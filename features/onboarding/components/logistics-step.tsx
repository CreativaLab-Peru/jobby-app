import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe, Building2, Home } from "lucide-react";
import {TalentOnboardingFormData} from "@/features/onboarding/schemas";

const WORK_MODALITIES = [
  { id: "REMOTE", label: "Remoto", icon: Globe },
  { id: "HYBRID", label: "Híbrido", icon: Building2 },
  { id: "ONSITE", label: "Presencial", icon: Home },
];

export function LogisticsStep({ form }: { form: UseFormReturn<TalentOnboardingFormData> }) {
  const selectedWork = form.watch("work");

  const toggleWork = (id: string) => {
    const current = new Set(selectedWork);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    form.setValue("work", Array.from(current));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Logística y Salario</h2>
        <p className="text-muted-foreground">Ayúdanos a filtrar ofertas que se ajusten a tu realidad.</p>
      </div>

      {/* Modalidad de Trabajo */}
      <div className="space-y-4">
        <Label>¿Cómo prefieres trabajar? (Selecciona todas las que apliquen)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WORK_MODALITIES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedWork.includes(mode.id);
            return (
              <div
                key={mode.id}
                onClick={() => toggleWork(mode.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all gap-2",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-muted hover:border-primary/30"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{mode.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salario Mínimo */}
      <div className="space-y-4">
        <Label>Expectativa salarial mínima mensual</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="Ej: 1500"
                className="pl-8 h-12"
                {...form.register("minSalary")}
              />
            </div>
          </div>
          <div className="w-32">
            <Select
              defaultValue="USD"
              onValueChange={(v) => form.setValue("currency", v)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="MXN">MXN</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Sugerencia: Investiga el promedio para tu rol si eres universitario.
        </p>
      </div>
    </div>
  );
}
