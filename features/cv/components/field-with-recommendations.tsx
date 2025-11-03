"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Lightbulb, Info, CheckCircle } from "lucide-react"
import { TagsInput } from "./tags-input"
import type { CVField } from "@/types/cv"

interface FieldWithRecommendationsProps {
  field: CVField
  value: any
  onChange: (value: string) => void
  onSelectChange?: (value: string) => void
  onTagsChange?: (tags: string[]) => void
}

export function FieldWithRecommendations({
  field,
  value,
  onChange,
  onSelectChange,
  onTagsChange,
}: FieldWithRecommendationsProps) {
  const [tipPopoverOpen, setTipPopoverOpen] = useState(false)
  const [examplePopoverOpen, setExamplePopoverOpen] = useState(false)

  const useExample = () => {
    if (field.type === "tags" && field.example) {
      const exampleTags = field.example.split(", ")
      onTagsChange?.(exampleTags)
    } else if (field.example) {
      onChange(field.example)
    }
    setExamplePopoverOpen(false)
  }

  const getFieldValue = () => {
    if (field.type === "tags") {
      return Array.isArray(value) ? value : []
    }
    return value || ""
  }

  const fieldValue = getFieldValue()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {/* Tip Popover */}
          {field.tip && (
            <Popover open={tipPopoverOpen} onOpenChange={setTipPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-700 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-300 border border-blue-300 hover:border-blue-400 text-xs font-medium shadow-sm hover:shadow-md animate-pulse hover:animate-none"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Consejo</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white w-80" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 font-medium mb-1">💡 Consejo:</p>
                      <p className="text-sm text-blue-700 leading-relaxed">{field.tip}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setTipPopoverOpen(false)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100 text-xs bg-transparent"
                      variant="outline"
                    >
                      Entendido
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Example Popover */}
          {field.example && (
            <Popover open={examplePopoverOpen} onOpenChange={setExamplePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-700 hover:text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all duration-300 border border-green-500 hover:border-green-300 text-xs font-medium shadow-sm hover:shadow-md animate-pulse hover:animate-none"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ejemplo</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="border-gray-200 bg-white w-80" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-medium mb-1">📝 Ejemplo:</p>
                      <p className="text-sm text-green-700 italic leading-relaxed">{field.example}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={useExample}
                      className="flex-1 text-green-600 border-green-300 hover:bg-green-100 text-xs bg-transparent"
                      variant="outline"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Usar este ejemplo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setExamplePopoverOpen(false)}
                      className="text-gray-600 border-gray-300 hover:bg-gray-100 text-xs bg-transparent"
                      variant="outline"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Field Input */}
      {field.type === "textarea" ? (
        <Textarea
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
          className="min-h-[200px]"
        />
      ) : field.type === "tags" ? (
        <TagsInput
          value={fieldValue}
          onChange={onTagsChange || (() => { })}
          placeholder={`Agrega ${field.label.toLowerCase()}`}
        />
      ) : field.type === "select" ? (
        <select
          value={fieldValue}
          onChange={(e) => onSelectChange?.(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecciona una opción</option>
          {field.options?.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={field.type}
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
        />
      )}
    </div>
  )
}
