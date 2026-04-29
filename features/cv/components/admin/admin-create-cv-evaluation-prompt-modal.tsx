"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAdminCvEvaluationPrompt } from "@/features/cv/actions/admin/create-admin-cv-evaluation-prompt";

interface AdminCreateCvEvaluationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (promptId: string) => void;
}

const parseMetadata = (value: string) => {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return "__invalid__";
  }
};

export function AdminCreateCvEvaluationPromptModal({
  isOpen,
  onClose,
  onCreated,
}: AdminCreateCvEvaluationPromptModalProps) {
  const [isPending, startTransition] = useTransition();
  const [beca, setBeca] = useState("");
  const [prompt, setPrompt] = useState("");
  const [metadata, setMetadata] = useState("");

  const handleCreate = () => {
    if (!beca.trim() || !prompt.trim() || isPending) return;

    const parsedMetadata = parseMetadata(metadata);
    if (parsedMetadata === "__invalid__") {
      toast.error("Metadata invalida. Debe ser JSON valido.");
      return;
    }

    startTransition(() => {
      createAdminCvEvaluationPrompt({
        beca: beca.trim(),
        prompt: prompt.trim(),
        metadata: parsedMetadata || null,
      }).then((result) => {
        if (result.success) {
          toast.success(result.message);
          onCreated(result.data.id);
          setBeca("");
          setPrompt("");
          setMetadata("");
        } else {
          const errorMsg = (result as { error: string }).error || "Error al crear prompt";
          toast.error(errorMsg);
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">Crear Prompt</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                Configura el prompt por beca para las evaluaciones de CV.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Beca *</Label>
              <Input value={beca} onChange={(e) => setBeca(e.target.value)} placeholder="Ej: fulbright-2026" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Prompt *</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Instrucciones especificas para esta beca..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Metadata (JSON)</Label>
              <Textarea
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                placeholder='{"source": "manual"}'
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-12 font-bold text-muted-foreground">
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!beca.trim() || !prompt.trim() || isPending}
              variant="accent"
              className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Crear Prompt
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

