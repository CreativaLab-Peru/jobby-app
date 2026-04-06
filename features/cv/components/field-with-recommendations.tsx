"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Lightbulb, Info, CheckCircle } from "lucide-react"
import { TagsInput } from "./tags-input"
import type { CVField } from "@/types/cv"
import { resolveLocalizedText } from "@/features/cv/utils/localized-text"

interface FieldWithRecommendationsProps {
  field: CVField
  language?: "ES" | "EN"
  value: any
  onChange: (value: string) => void
  onSelectChange?: (value: string) => void
  onTagsChange?: (tags: string[]) => void
}

export function FieldWithRecommendations({
                                           field,
                                           language = "ES",
                                           value,
                                           onChange,
                                           onSelectChange,
                                           onTagsChange,
                                         }: FieldWithRecommendationsProps) {
  const [tipPopoverOpen, setTipPopoverOpen] = useState(false)
  const [examplePopoverOpen, setExamplePopoverOpen] = useState(false)

  const labelText = resolveLocalizedText(field.label, "ES")
  const tipText = field.tip ? resolveLocalizedText(field.tip, "ES") : ""
  const exampleText = field.example ? resolveLocalizedText(field.example, language) : ""

  const useExample = () => {
    if (field.type === "tags" && exampleText) {
      const exampleTags = exampleText.split(", ")
      onTagsChange?.(exampleTags)
    } else if (exampleText) {
      onChange(exampleText)
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
        <label className="block text-sm font-medium text-foreground">
          {labelText} {field.required && <span className="text-destructive">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {/* Tip Popover */}
          {tipText && (
            <Popover open={tipPopoverOpen} onOpenChange={setTipPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5  rounded-lg transition-all duration-300 border text-xs font-medium shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2"
                >
                  <Lightbulb className=" w-3.5 h-3.5" />
                  <span>Consejo</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-card w-80 text-card-foreground" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5  mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1">Consejo:</p>
                      <p className="text-sm leading-relaxed">{tipText}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setTipPopoverOpen(false)}
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
          {exampleText && (
            <Popover open={examplePopoverOpen} onOpenChange={setExamplePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Ver ejemplo"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5  rounded-lg transition-all duration-300 border text-xs font-medium shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ejemplo</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="border-border bg-card w-80 text-card-foreground" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5  mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1 text-secondary-foreground/80">Ejemplo:</p>
                      <p className="text-sm italic leading-relaxed">{exampleText}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={useExample}
                      className="flex-1 text-xs bg-transparent"
                      variant="outline"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Usar este ejemplo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setExamplePopoverOpen(false)}
                      className=" border-border hover:bg-muted text-xs bg-transparent"
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
          placeholder={`Ingresa ${labelText.toLowerCase()}`}
          className="min-h-[200px] bg-input text-foreground border-border focus:ring-ring focus:ring-2 focus:ring-offset-2"
        />
      ) : field.type === "tags" ? (
        <TagsInput
          value={fieldValue}
          onChange={onTagsChange || (() => {})}
          placeholder={`Agrega ${labelText.toLowerCase()}`}
        />
      ) : field.type === "select" ? (
        <Select value={fieldValue} onValueChange={(val) => onSelectChange?.(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una opcion" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={field.type}
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Ingresa ${labelText.toLowerCase()}`}
        />
      )}
    </div>
  )
}
