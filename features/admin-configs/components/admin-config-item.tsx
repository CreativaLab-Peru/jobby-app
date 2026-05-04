"use client";

import { useState } from "react";
import { Edit2, Eye, EyeOff, Trash2, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AppConfig } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminConfigItemProps {
  config: AppConfig;
  onEdit: (config: AppConfig) => void;
  onDelete: (config: AppConfig) => void;
}

export function AdminConfigItem({ config, onEdit, onDelete }: AdminConfigItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<"key" | "value" | null>(null);

  const handleCopy = async (text: string, field: "key" | "value") => {
    try {
      const textToCopy = field === "key" ? text.toUpperCase() : text;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedField(field);
      toast.success(`${field === "key" ? "Clave" : "Valor"} copiado al portapapeles`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Error al copiar");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className="hover:border-primary/30 transition-colors shadow-sm">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 group">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded">
                KEY
              </span>
              <h3 className="font-bold text-foreground truncate uppercase tracking-tight">
                {config.key}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded shrink-0 hover:bg-muted transition-colors"
                onClick={() => handleCopy(config.key, "key")}
              >
                {copiedField === "key" ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 pt-1 group">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                VALUE
              </span>
              <p className="text-sm text-muted-foreground break-all font-mono">
                {isVisible ? config.value : "••••••••••••••••"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded shrink-0 hover:bg-muted transition-colors"
                onClick={() => handleCopy(config.value, "value")}
              >
                {copiedField === "value" ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full shrink-0 hover:bg-muted transition-colors"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Eye className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
              onClick={() => onEdit(config)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-all"
              onClick={() => onDelete(config)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
