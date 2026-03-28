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
import {cn} from "@/lib/utils";

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

  // 1. Notificar cambios al padre (Modal)
  useEffect(() => {
    const currentValuesStr = JSON.stringify(allValues);
    if (prevValuesRef.current !== currentValuesStr) {
      prevValuesRef.current = currentValuesStr;
      onValuesChange(allValues);
    }
  }, [allValues, onValuesChange]);

  // 2. Lógica de Recomendación Automática de Secciones
  useEffect(() => {
    if (selectedOpportunity) {
      const suggested = RECOMMENDATIONS_BY_OPPORTUNITY[selectedOpportunity] || [];
      setValue("sections", suggested, { shouldValidate: true });
    }
  }, [selectedOpportunity, setValue]);

  return (
    <div className="space-y-6 py-4">
      {/* Nombre del CV */}
      <FormField
        label="Nombre del CV"
        placeholder="Ejemplo: CV Ingeniero de Software"
        register={register("title")}
        error={errors.title?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diseño del CV */}
        <FormSelect
          label="Diseño"
          value={watch("templateId")}
          options={[
            { key: "harvard", value: "Harvard (Clásico)" },
            { key: "europass", value: "Europass Modern" },
          ]}
          onChange={(v) => setValue("templateId", v as any, { shouldValidate: true })}
          error={errors.templateId?.message}
        />

        {/* Idioma */}
        <FormSelect
          label="Idioma"
          value={watch("language")}
          options={languages}
          onChange={(v) => setValue("language", v as any, { shouldValidate: true })}
          error={errors.language?.message}
        />
      </div>

      {/* Tipo de Oportunidad */}
      <FormSelect
        label="Tipo de Oportunidad"
        placeholder="¿A qué aplicas?"
        value={selectedOpportunity}
        options={opportunities}
        onChange={(v) => setValue("opportunityType", v as any, { shouldValidate: true })}
        error={errors.opportunityType?.message}
      />

      {/* Perfil Profesional */}
      <div className="space-y-2">
        <Label className={errors.cvType ? "text-destructive" : ""}>Perfil profesional</Label>
        <Select
          onValueChange={(v) => setValue("cvType", v as any, { shouldValidate: true })}
          value={watch("cvType")}
        >
          <SelectTrigger className={cn("rounded-xl h-11 bg-secondary/30 border-none font-medium", errors.cvType && "ring-2 ring-destructive")}>
            <SelectValue placeholder="Selecciona tu perfil" />
          </SelectTrigger>
          <SelectContent>
            {cvTypes.map((t) => (
              <SelectItem key={t.key} value={t.key}>{t.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cvType && (
          <p className="text-[10px] font-bold text-destructive ml-1">{errors.cvType.message}</p>
        )}
      </div>

      {/* --- SECCIÓN NUEVA: Selector de Secciones --- */}
      <div className="pt-4 border-t border-secondary/10">
        <CvSectionSelector
          selectedSections={watch("sections") || []}
          onChange={(newSections) => setValue("sections", newSections, { shouldValidate: true })}
          opportunityType={watch("opportunityType") as any}
        />
        {errors.sections && (
          <p className="text-[10px] font-bold text-destructive mt-2 ml-1">
            {errors.sections.message}
          </p>
        )}
      </div>
    </div>
  )
}
