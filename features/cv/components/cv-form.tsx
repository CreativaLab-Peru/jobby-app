"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import { CVFormData, cvFormSchema } from "@/features/cv/schema";
import {cvTypes, languages, opportunities} from "@/const";
import {useEffect, useRef} from "react";
import {FormSelect} from "@/components/form/select-input";

interface CVFormProps {
  defaultValues?: Partial<CVFormData>;
  onValuesChange: (data: CVFormData) => void;
}

export function CVForm({ defaultValues, onValuesChange }: CVFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors},
  } = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      title: "",
      templateId: "harvard",
      ...defaultValues,
    },
  });

  const allValues = watch();
  const prevValuesRef = useRef<string>("");

  useEffect(() => {
    const currentValuesStr = JSON.stringify(allValues);

    // Solo notificamos al padre si los datos realmente cambiaron
    if (prevValuesRef.current !== currentValuesStr) {
      prevValuesRef.current = currentValuesStr;
      onValuesChange(allValues);
    }
  }, [allValues, onValuesChange]);

  // Suscripción a valores para lógica condicional y descripciones
  // const selectedOpportunity = watch("opportunityType");
  // const selectedTemplate = watch("templateId");

  return (
    <form className="space-y-6 py-4">

      {/* 1. Título - Usando tu FormField Custom con register */}
      <FormField
        label="Nombre del CV"
        placeholder="Ejemplo: CV Ingeniero de Software"
        register={register("title")}
        error={errors.title?.message}
      />

      {/* 1. Diseño del CV */}
      <FormSelect
        label="Diseño del CV"
        value={watch("templateId")}
        options={[
          { key: "harvard", value: "Harvard (Recomendado)" },
          { key: "europass", value: "Europass Modern" },
        ]}
        onChange={(v) => setValue("templateId", v as any, { shouldValidate: true })}
        error={errors.templateId?.message}
      />

      {/* 3. Tipo de Oportunidad - Select (Manual porque Radix no usa ref) */}
      <FormSelect
        label="Tipo de Oportunidad"
        placeholder="Selecciona el tipo"
        value={watch("opportunityType")}
        options={opportunities}
        onChange={(v) => setValue("opportunityType", v as any, { shouldValidate: true })}
        error={errors.opportunityType?.message}
      />

      {/* 4. Perfil Profesional */}
      <div className="space-y-2">
        <Label className={errors.cvType ? "text-destructive" : ""}>Perfil profesional</Label>
        <Select
          onValueChange={(v) => setValue("cvType", v as any, { shouldValidate: true })}
          defaultValue={defaultValues?.cvType}
        >
          <SelectTrigger className={errors.cvType ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona tu perfil" />
          </SelectTrigger>
          <SelectContent>
            {cvTypes.map((t) => (
              <SelectItem key={t.key} value={t.key}>{t.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cvType && (
          <p className="text-xs font-semibold text-destructive">{errors.cvType.message}</p>
        )}
      </div>

      {/* 5. Idioma del CV */}
      <FormSelect
        label="Idioma del Currículum"
        placeholder="Selecciona el idioma"
        value={watch("language")}
        options={languages}
        onChange={(v) => setValue("language", v as any, { shouldValidate: true })}
        error={errors.language?.message}
        description="El contenido del CV se generará en este idioma."
      />

    </form>
  )
}
