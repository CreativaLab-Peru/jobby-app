"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as LucideIcons from "lucide-react";
import {
  Sparkles,
  GraduationCap,
  Map,
  Briefcase,
  Globe,
  Rocket,
  Heart,
  Star,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { RoutePublicitySuggestion } from "@prisma/client";

// Mapeo de iconos para acceso rápido
const iconsMap = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean(),
});

export type PublicityFormValues = z.infer<typeof formSchema>;

interface PublicityFormProps {
  initialData?: RoutePublicitySuggestion | null;
  onSubmit: (values: PublicityFormValues) => Promise<void>;
  isPending: boolean;
  onCancel: () => void;
}

export function PublicityForm({ initialData, onSubmit, isPending, onCancel }: PublicityFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PublicityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "Sparkles",
      isActive: initialData?.isActive ?? true,
    },
  });

  // Observamos los valores para actualizar la UI en tiempo real
  const currentIcon = watch("icon");
  const isActive = watch("isActive");

  const commonIcons = [
    "Sparkles", "GraduationCap", "Map", "Briefcase", "Globe",
    "Rocket", "Heart", "Star", "Target", "Zap"
  ];

  const renderIcon = (iconName: string | undefined) => {
    const IconComponent = iconsMap[iconName || "Sparkles"] || LucideIcons.Sparkles;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            {...register("title")}
            placeholder="Ej: Master en UK"
            disabled={isPending}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Explica de qué trata esta sugerencia..."
            disabled={isPending}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          <Field>
            <FieldLabel htmlFor="icon">Icono</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="icon"
                {...register("icon")}
                placeholder="Nombre del icono..."
                disabled={isPending}
              />
              <div className="p-2 border rounded-md bg-muted flex items-center justify-center min-w-[40px]">
                {renderIcon(currentIcon)}
              </div>
            </div>

            {/* Selector rápido de iconos */}
            <div className="flex flex-wrap gap-1 mt-2">
              {commonIcons.map((iconName) => {
                const Icon = iconsMap[iconName];
                return (
                  <Button
                    key={iconName}
                    type="button"
                    variant={currentIcon === iconName ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setValue("icon", iconName, { shouldDirty: true })}
                    disabled={isPending}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </Button>
                );
              })}
            </div>
          </Field>

          <Field className="flex items-center gap-3 pt-8">
            <FieldLabel htmlFor="isActive" className="mb-0 cursor-pointer">
              Activo
            </FieldLabel>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked, { shouldDirty: true })}
              disabled={isPending}
            />
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter className="pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogFooter>
    </form>
  );
}