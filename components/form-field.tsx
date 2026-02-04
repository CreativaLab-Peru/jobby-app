"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Extendemos los atributos nativos del Input de HTML para no limitar el componente
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  // Quitamos 'register' como obligatorio y usamos {...props} para flexibilidad
  register?: any;
}

export function FormField({
                            label,
                            error,
                            icon: Icon,
                            type = "text",
                            register,
                            placeholder,
                            className,
                            id,
                            ...props // Captura value, onChange, onBlur, etc.
                          }: FormFieldProps) {
  // Generamos un ID único si no se provee para vincular Label e Input (Accesibilidad)
  const generatedId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2 w-full">
      <Label
        htmlFor={generatedId}
        className={cn(error && "text-levely-orange")}
      >
        {label}
      </Label>

      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary">
            <Icon className={cn(
              "h-5 w-5 text-muted-foreground",
              error && "text-destructive/80"
            )} />
          </div>
        )}

        <Input
          id={generatedId}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-12 transition-all shadow-sm",
            Icon ? "pl-10" : "",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...register} // Para React Hook Form
          {...props}    // Para Zustand (value, onChange)
        />
      </div>

      {error && (
        <p className="dark:text-gray-400 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
