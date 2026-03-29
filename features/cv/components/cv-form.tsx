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
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full overflow-hidden">

      {/* COLUMNA 1: Configuración Principal */}
      <div className="p-8 space-y-8 border-r border-border/40 overflow-y-auto bg-background">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">01. Identidad</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Define la base de tu documento</p>
        </div>

        <div className="space-y-6">
          <FormField
            label="Nombre del CV"
            placeholder="Ej: CV Backend Senior - Nivel 3"
            register={register("title")}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Diseño"
              value={watch("templateId")}
              options={[
                { key: "harvard", value: "Harvard (Clásico)" },
                { key: "europass", value: "Modern (Standard)" },
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
            placeholder="¿A qué estás aplicando?"
            value={selectedOpportunity}
            options={opportunities}
            onChange={(v) => setValue("opportunityType", v as any, { shouldValidate: true })}
          />

          <div className="space-y-2">
            <Label className={cn("text-xs font-bold ml-1", errors.cvType && "text-destructive")}>
              Perfil profesional
            </Label>
            <Select
              onValueChange={(v) => setValue("cvType", v as any, { shouldValidate: true })}
              value={watch("cvType")}
            >
              <SelectTrigger className="rounded-2xl h-12 bg-secondary/20 border-border/40 font-medium transition-all focus:ring-primary/20">
                <SelectValue placeholder="Selecciona tu especialidad" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-xl">
                {cvTypes.map((t) => (
                  <SelectItem key={t.key} value={t.key} className="rounded-lg">{t.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cvType && (
              <p className="text-[10px] font-bold text-destructive ml-1 italic">{errors.cvType.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* COLUMNA 2: Selección de Secciones */}
      <div className="p-8 bg-secondary overflow-y-auto">
        <div className="space-y-1 mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">02. Estructura</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Selecciona y ordena los bloques</p>
        </div>

        <div className="bg-background/40 border border-border/40 rounded-[2rem] p-6 shadow-sm">
          <CvSectionSelector
            selectedSections={watch("sections") || []}
            onChange={(newSections) => setValue("sections", newSections, { shouldValidate: true })}
            opportunityType={watch("opportunityType") as any}
          />
        </div>

        {errors.sections && (
          <div className="mt-6 p-3 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
            <p className="text-[10px] font-black text-destructive uppercase tracking-widest leading-none">
              {errors.sections.message}
            </p>
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl border border-dashed border-primary/20 bg-primary/5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-black text-xs">
            {watch("sections")?.length || 0}
          </div>
          <div>
            <p className="text-[11px] font-bold text-foreground">Secciones Activas</p>
            <p className="text-[10px] text-muted-foreground italic">El orden de los números indica la secuencia en tu formulario.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
