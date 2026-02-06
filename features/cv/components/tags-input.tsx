"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface TagsInputProps {
  value: string[] | any[]
  onChange: (tags: string[]) => void
  placeholder: string
}

export function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")

  // Normalizar el valor para manejar tanto strings como objetos
  const normalizedValue = value.map((item) => {
    if (typeof item === "string") {
      return item;
    }
    // Si es un objeto (como {language, proficiency}), convertirlo a string
    if (item && typeof item === "object") {
      if (item.language && item.proficiency) {
        return `${item.language} (${item.proficiency})`;
      }
      if (item.language) {
        return item.language;
      }
      // Fallback: convertir el objeto a string
      return JSON.stringify(item);
    }
    return String(item);
  });

  const addTag = () => {
    if (inputValue.trim() && !normalizedValue.includes(inputValue.trim())) {
      onChange([...normalizedValue, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(normalizedValue.filter((tag: string) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
        />
        <Button type="button" onClick={addTag} size="sm" className="bg-levely-blue hover:bg-levely-blue/90 dark:bg-levely-green dark:hover:bg-levely-green/60">
          <Plus className="w-4 h-4 text-white dark:text-levely-dark" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {normalizedValue.map((tag: string, index: number) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
