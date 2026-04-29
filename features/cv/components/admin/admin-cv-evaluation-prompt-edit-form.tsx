"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { routes } from "@/lib/routes";
import { AdminCvEvaluationPromptDetail } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompt-by-id";
import { updateAdminCvEvaluationPrompt } from "@/features/cv/actions/admin/update-admin-cv-evaluation-prompt";

interface AdminCvEvaluationPromptEditFormProps {
  prompt: AdminCvEvaluationPromptDetail;
}

const safeStringify = (value: unknown) => {
  if (!value) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
};

const parseMetadata = (value: string) => {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return "__invalid__";
  }
};

export function AdminCvEvaluationPromptEditForm({ prompt }: AdminCvEvaluationPromptEditFormProps) {
  const [beca, setBeca] = useState(prompt.beca);
  const [promptText, setPromptText] = useState(prompt.prompt);
  const [metadata, setMetadata] = useState(safeStringify(prompt.metadata));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beca.trim() || !promptText.trim()) {
      toast.error("Beca y prompt son requeridos");
      return;
    }

    const parsedMetadata = parseMetadata(metadata);
    if (parsedMetadata === "__invalid__") {
      toast.error("Metadata invalida. Debe ser JSON valido.");
      return;
    }

    setIsLoading(true);
    const result = await updateAdminCvEvaluationPrompt(prompt.id, {
      beca: beca.trim(),
      prompt: promptText.trim(),
      metadata: parsedMetadata || null,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.cvEvaluationPrompts.detail(prompt.id));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando prompt";
      toast.error(errorMsg);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.detail(prompt.id))}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader title="Editar Prompt" description={`Editando "${prompt.beca}"`} />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Beca *</Label>
                <Input value={beca} onChange={(e) => setBeca(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Prompt *</Label>
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={8}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Metadata (JSON)</Label>
                <Textarea
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.detail(prompt.id))}
                  disabled={isLoading}
                  className="rounded-lg font-bold"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-lg font-bold shadow-sm">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

