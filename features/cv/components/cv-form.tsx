"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import { CVFormData, cvFormSchema } from "@/features/cv/schema";
import {cvTypes, languages, opportunities} from "@/const";
import {useEffect, useRef} from "react";

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
  const selectedOpportunity = watch("opportunityType");
  const selectedTemplate = watch("templateId");

  return (
    <form className="space-y-6 py-4">

      {/* 1. Título - Usando tu FormField Custom con register */}
      <FormField
        label="Nombre del CV"
        placeholder="Ejemplo: CV Ingeniero de Software"
        register={register("title")}
        error={errors.title?.message}
      />

      {/* 2. Tipo de Oportunidad - Select (Manual porque Radix no usa ref) */}
      <div className="space-y-2">
        <Label className={errors.opportunityType ? "text-destructive" : ""}>
          Tipo de Oportunidad
        </Label>
        <Select
          onValueChange={(v) => setValue("opportunityType", v as any, { shouldValidate: true })}
          defaultValue={defaultValues?.opportunityType}
        >
          <SelectTrigger className={errors.opportunityType ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            {opportunities.map((t) => (
              <SelectItem key={t.key} value={t.key}>{t.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/*<p className="text-sm text-muted-foreground">*/}
        {/*  {OPPORTUNITY_DESCRIPTIONS[selectedOpportunity] || OPPORTUNITY_DESCRIPTIONS.default}*/}
        {/*</p>*/}
        {errors.opportunityType && (
          <p className="text-xs font-semibold text-destructive">{errors.opportunityType.message}</p>
        )}
      </div>

      {/* 3. Diseño del CV */}
      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
        <Label className={errors.templateId ? "text-destructive" : ""}>Diseño del CV</Label>
        <Select
          onValueChange={(v) => setValue("templateId", v, { shouldValidate: true })}
          defaultValue={selectedTemplate || "harvard"}
        >
          <SelectTrigger className={errors.templateId ? "border-destructive" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="harvard">Harvard (Clásico)</SelectItem>
            <SelectItem value="europass">Europass Modern</SelectItem>
          </SelectContent>
        </Select>
        {/*<p className="text-sm text-muted-foreground">*/}
        {/*  {TEMPLATE_DESCRIPTIONS[selectedTemplate!] || TEMPLATE_DESCRIPTIONS.default}*/}
        {/*</p>*/}
        {errors.templateId && (
          <p className="text-xs font-semibold text-destructive">{errors.templateId.message}</p>
        )}
      </div>

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
        {/*<p className="text-sm text-muted-foreground">*/}
        {/*  {CV_TYPE_DESCRIPTIONS[selectedCvType] || CV_TYPE_DESCRIPTIONS.default}*/}
        {/*</p>*/}
        {errors.cvType && (
          <p className="text-xs font-semibold text-destructive">{errors.cvType.message}</p>
        )}
      </div>

      {/* 5. Idioma del CV */}
      <div className="space-y-2">
        <Label className={errors.language ? "text-destructive" : ""}>
          Idioma del Currículum
        </Label>
        <Select
          onValueChange={(v) => setValue("language", v as any, { shouldValidate: true })}
          defaultValue={defaultValues?.language}
        >
          <SelectTrigger className={errors.language ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona el idioma" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.key} value={lang.key}>
                {lang.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          El contenido del CV se generará en este idioma.
        </p>
        {errors.language && (
          <p className="text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
            {errors.language.message}
          </p>
        )}
      </div>

    </form>
  )
}
