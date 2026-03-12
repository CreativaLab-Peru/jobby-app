"use client"

import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { FieldWithRecommendations } from "./field-with-recommendations"
import { CvPhotoUpload } from "./cv-photo-upload"
import type { CVSection } from "@/types/cv"
import { toast } from "sonner"

interface CVSectionFormProps {
  section: CVSection
  data: any
  onChange: (data: any) => void
}

export interface CVSectionFormRef {
  validate: () => boolean
}

export const CVSectionForm = forwardRef<CVSectionFormRef, CVSectionFormProps>(({ section, data, onChange }, ref) => {
  const [formData, setFormData] = useState(() => {
    if (section.multiple) {
      return {
        items: data.items && data.items.length > 0 ? data.items : [{}],
      }
    }
    return data || {}
  })
  const [errors, setErrors] = useState<any>({});

  // Validación de campos obligatorios
  const validateFields = useCallback((item: any) => {
    const newErrors: Record<string, string> = {};
    section.fields.forEach((field) => {
      if (field.required) {
        const value = item[field.name];
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.name] = "Este campo es obligatorio";
        }
      }
      if (field.pattern && item[field.name]) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(item[field.name])) {
          newErrors[field.name] = field.patternError || "Formato inválido";
        }
      }
    });
    return newErrors;
  }, [section.fields]);

  // Validar todos los datos antes de avanzar
  const validateAll = useCallback(() => {
    if (section.multiple) {
      const items = formData.items || [];

      // Si no hay items, verificar si hay algún campo requerido
      if (items.length === 0) {
        const hasRequiredFields = section.fields.some(field => field.required);

        // Si no hay campos requeridos, permitir avanzar sin items
        if (!hasRequiredFields) {
          return true;
        }
        // Si hay campos requeridos pero no hay items, mostrar error
        toast.error("Por favor agrega al menos una entrada o completa los campos obligatorios");
        return false;
      }

      // Si hay items, validar cada uno
      const allErrors: any[] = [];
      let hasErrors = false;

      items.forEach((item: any, index: number) => {
        const itemErrors = validateFields(item);
        allErrors[index] = itemErrors;
        if (Object.keys(itemErrors).length > 0) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setErrors({ items: allErrors });
        toast.error("Por favor completa todos los campos obligatorios antes de continuar");
        return false;
      }
    } else {
      const fieldErrors = validateFields(formData);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        toast.error("Por favor completa todos los campos obligatorios antes de continuar");
        return false;
      }
    }
    return true;
  }, [section.multiple, section.fields, formData, validateFields]);

  // Exponer la función de validación al componente padre
  useImperativeHandle(ref, () => ({
    validate: validateAll
  }), [validateAll]);

  const handleInputChange = useCallback(
    (fieldName: string, value: string, index?: number) => {
      let newData
      if (section.multiple && index !== undefined) {
        const items = formData.items || []
        const updatedItems = [...items]
        updatedItems[index] = { ...(updatedItems[index] || {}), [fieldName]: value }
        newData = { ...formData, items: updatedItems }
      } else {
        newData = { ...formData, [fieldName]: value }
      }
      setFormData(newData)
      onChange(newData)
    },
    [formData, section.multiple, onChange],
  )

  const handleTagsChange = useCallback(
    (fieldName: string, tags: string[]) => {
      const newData = { ...formData, [fieldName]: tags }
      setFormData(newData)
      onChange(newData)
    },
    [formData, onChange],
  )

  const addItem = () => {
    if (section.multiple) {
      const newData = {
        ...formData,
        items: [...(formData.items || []), {}],
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  const removeItem = (index: number) => {
    if (section.multiple) {
      const newData = {
        ...formData,
        items: (formData.items || []).filter((_: any, i: number) => i !== index),
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  if (section.multiple) {
    const items = formData.items || [{}];
    const itemsErrors = errors.items || [];

    return (
      <div className="space-y-8">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border border-border rounded-xl bg-muted/20 relative group transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {section.title} #{index + 1}
              </h3>

              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <FieldWithRecommendations
                    field={field}
                    value={item[field.name] || ""}
                    onChange={(value) => handleInputChange(field.name, value, index)}
                    onSelectChange={(value) => handleInputChange(field.name, value, index)}
                  />
                  {itemsErrors[index]?.[field.name] && (
                    <p className="text-xs text-destructive mt-1">{itemsErrors[index][field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full py-8 border-2 border-dashed border-border text-muted-foreground transition-all rounded-xl group"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="font-medium">Agregar {section.title.toLowerCase()}</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {section.fields.map((field) => (
        <div key={field.name}>
          {field.type === "photo" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {field.label}
              </label>
              {field.tip && (
                <p className="text-xs text-muted-foreground">{field.tip}</p>
              )}
              <CvPhotoUpload
                value={formData[field.name] || ""}
                onChange={(url) => handleInputChange(field.name, url)}
              />
            </div>
          ) : (
            <FieldWithRecommendations
              field={field}
              value={formData[field.name] || []}
              onChange={(value) => handleInputChange(field.name, value)}
              onSelectChange={(value) => handleInputChange(field.name, value)}
              onTagsChange={(tags) => handleTagsChange(field.name, tags)}
            />
          )}
          {errors[field.name] && (
            <p className="text-xs text-destructive mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
});

CVSectionForm.displayName = "CVSectionForm";
