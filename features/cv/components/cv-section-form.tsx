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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {section.title} {index + 1}
              </h3>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
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
          className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 bg-transparent"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar {section.title.toLowerCase()}
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
