"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface TagsInputProps {
  value: string[] | any[]
  onChange: (tags: string[] | any[]) => void
  placeholder: string
}

export function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")

  // Detectar si el valor original contiene objetos
  const isObjectArray = value.length > 0 && value.some(item => typeof item === "object" && item !== null);

  // Normalizar el valor para mostrar (convertir objetos a strings)
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

  // Parsear un string a objeto si es necesario
  const parseTagToOriginalFormat = (tag: string): string | { language: string; proficiency: string } => {
    if (!isObjectArray) {
      return tag;
    }
    
    // Intentar parsear formato "Idioma (Nivel)"
    const match = tag.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return {
        language: match[1].trim(),
        proficiency: match[2].trim()
      };
    }
    
    // Si no tiene ese formato, crear objeto solo con language
    return { language: tag, proficiency: "" };
  };

  const addTag = () => {
    if (inputValue.trim() && !normalizedValue.includes(inputValue.trim())) {
      const newTag = parseTagToOriginalFormat(inputValue.trim());
      onChange([...value, newTag]);
      setInputValue("");
    }
  }

  const removeTag = (tagToRemove: string) => {
    const indexToRemove = normalizedValue.indexOf(tagToRemove);
    if (indexToRemove !== -1) {
      const newValue = [...value];
      newValue.splice(indexToRemove, 1);
      onChange(newValue);
    }
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
        <Button type="button" onClick={addTag} size="sm" className="bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/60">
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
