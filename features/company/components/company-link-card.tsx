"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CompanyLinkCardProps {
  joinUrl: string;
}

export function CompanyLinkCard({ joinUrl }: CompanyLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("No pudimos copiar el enlace");
    }
  };

  return (
    <Card className="border-primary/15 bg-primary/5 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 data-icon="inline-start" />
          Enlace para compartir
        </CardTitle>
        <CardDescription>
          Usa este enlace para abrir el flujo de unión de Levely Business.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={joinUrl} readOnly className="bg-background" />
          <Button type="button" onClick={handleCopy} className="sm:min-w-36">
            {copied ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            {copied ? "Copiado" : "Copiar enlace"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          También puedes pegarlo en WhatsApp, email o en el CRM interno del equipo.
        </p>
      </CardContent>
    </Card>
  );
}

