"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { FieldWithRecommendations } from "./field-with-recommendations"
import type { CVSection } from "@/types/cv"

interface CVSectionFormProps {
  section: CVSection
  data: any
  onChange: (data: any) => void
}

export function CVSectionForm({ section, data, onChange }: CVSectionFormProps) {
  // ... (Lógica de estado y handlers se mantiene igual)
  const [formData, setFormData] = useState(() => {
    if (section.multiple) {
      return {
        items: data.items && data.items.length > 0 ? data.items : [{}],
      }
    }
    return data || {}
  })

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
    const items = formData.items || [{}]

    return (
      <div className="space-y-8">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // REFACTOR: Usamos border-border y bg-muted/30 para un look más limpio
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
                  // REFACTOR: Usamos destructive para acciones de borrado
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <FieldWithRecommendations
                  key={field.name}
                  field={field}
                  value={item[field.name] || ""}
                  onChange={(value) => handleInputChange(field.name, value, index)}
                  onSelectChange={(value) => handleInputChange(field.name, value, index)}
                />
              ))}
            </div>
          </motion.div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          // REFACTOR: Estilo tipo "Empty state" usando tus variables de marca
          className="w-full py-8 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all rounded-xl group"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="font-medium">Agregar {section.title.toLowerCase()}</span>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {section.fields.map((field) => (
        <FieldWithRecommendations
          key={field.name}
          field={field}
          value={formData[field.name] || []}
          onChange={(value) => handleInputChange(field.name, value)}
          onSelectChange={(value) => handleInputChange(field.name, value)}
          onTagsChange={(tags) => handleTagsChange(field.name, tags)}
        />
      ))}
    </div>
  )
}
