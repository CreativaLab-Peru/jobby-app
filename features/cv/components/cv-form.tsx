"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import { CVFormData, cvFormSchema } from "@/features/cv/schema";
import { cvTypes, languages, opportunities, RECOMMENDATIONS_BY_OPPORTUNITY } from "@/const";
import { useEffect, useRef } from "react";
import { FormSelect } from "@/components/form/select-input";
import { CvSectionSelector } from "@/features/cv/components/cv-section-selector";
import { cn } from "@/lib/utils";

interface CVFormProps {
  defaultValues?: Partial<CVFormData>;
  onValuesChange: (data: CVFormData) => void;
}

export function CVForm({ defaultValues, onValuesChange }: CVFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      title: "",
      templateId: "harvard",
      sections: [],
      ...defaultValues,
    },
  });

  const allValues = watch();
  const selectedOpportunity = watch("opportunityType");
  const prevValuesRef = useRef<string>("");

  useEffect(() => {
    const currentValuesStr = JSON.stringify(allValues);
    if (prevValuesRef.current !== currentValuesStr) {
      prevValuesRef.current = currentValuesStr;
      onValuesChange(allValues);
    }
  }, [allValues, onValuesChange]);

  useEffect(() => {
    if (selectedOpportunity) {
      const suggested = RECOMMENDATIONS_BY_OPPORTUNITY[selectedOpportunity] || [];
      setValue("sections", suggested, { shouldValidate: true });
    }
  }, [selectedOpportunity, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full bg-background">

      {/* COLUMNA 1: Configuración Principal */}
      <div className="p-6 md:p-8 space-y-8 border-b md:border-b-0 md:border-r border-border">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">01. Identidad</h3>
          <p className="text-xs text-muted-foreground">Define los parámetros básicos de tu documento.</p>
        </div>

        <div className="space-y-6">
          <FormField
            label="Nombre del CV"
            placeholder="Ej: CV Backend Senior"
            register={register("title")}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Diseño"
              value={watch("templateId")}
              options={[
                { key: "harvard", value: "Harvard" },
                { key: "europass", value: "Moderno" },
              ]}
              onChange={(v) => setValue("templateId", v as any, { shouldValidate: true })}
            />

            <FormSelect
              label="Idioma"
              value={watch("language")}
              options={languages}
              onChange={(v) => setValue("language", v as any, { shouldValidate: true })}
            />
          </div>

          <FormSelect
            label="Tipo de Oportunidad"
            value={selectedOpportunity}
            options={opportunities}
            onChange={(v) => setValue("opportunityType", v as any, { shouldValidate: true })}
          />

          <div className="space-y-2">
            <Label className={cn("text-xs font-semibold", errors.cvType && "text-destructive")}>
              Perfil profesional
            </Label>
            <Select
              onValueChange={(v) => setValue("cvType", v as any, { shouldValidate: true })}
              value={watch("cvType")}
            >
              <SelectTrigger className="rounded-lg h-10 bg-secondary/30 border-border font-medium">
                <SelectValue placeholder="Selecciona especialidad" />
              </SelectTrigger>
              <SelectContent>
                {cvTypes.map((t) => (
                  <SelectItem key={t.key} value={t.key}>{t.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cvType && (
              <p className="text-[10px] font-medium text-destructive mt-1 italic">{errors.cvType.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* COLUMNA 2: Selección de Secciones */}
      <div className="p-6 md:p-8 bg-secondary/5 overflow-y-auto">
        <div className="space-y-1 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">02. Estructura</h3>
          <p className="text-xs text-muted-foreground">Activa y ordena los módulos de información.</p>
        </div>

        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <CvSectionSelector
            selectedSections={watch("sections") || []}
            onChange={(newSections) => setValue("sections", newSections, { shouldValidate: true })}
            opportunityType={watch("opportunityType") as any}
          />
        </div>

        {errors.sections && (
          <div className="mt-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-center">
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.sections.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
