'use client';

import { useState, useRef, useEffect } from "react";
import { Check, Edit, Loader2, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TitleAndFormProps {
  title: string;
  onSubmit: (newValue: string) => void;
  isSubmitting: boolean;
  className?: string; // Permitir extender estilos desde el padre
}

export const TitleAndForm = ({
                               title,
                               onSubmit,
                               isSubmitting,
                               className
                             }: TitleAndFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(title || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus al entrar en modo edición
  useEffect(() => {
    if (isEditMode) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditMode]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedValue = value.trim();

    if (trimmedValue.length > 0 && trimmedValue !== title) {
      onSubmit(trimmedValue);
      setIsEditMode(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setValue(title || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleCancel();
  };

  if (!isEditMode) {
    return (
      <div
        className={cn(
          "group/title flex items-center gap-2 cursor-pointer transition-colors",
          className
        )}
        onDoubleClick={() => setIsEditMode(true)}
      >
        <span className="truncate max-w-[200px] md:max-w-[300px]">
          {title || 'Sin título'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditMode(true);
          }}
          className="opacity-0 group-hover/title:opacity-100 p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-[350px] animate-in fade-in zoom-in-95 duration-200"
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        placeholder="Título del CV..."
        className="h-9 pr-20 rounded-xl border-2 border-primary/30 focus-visible:ring-primary/20 bg-background font-bold"
      />

      <div className="absolute right-1.5 flex items-center gap-1">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={isSubmitting || value.trim().length === 0}
          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};
