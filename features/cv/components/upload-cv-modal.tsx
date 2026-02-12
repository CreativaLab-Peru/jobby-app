"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle, ChevronRight, FileIcon, X } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useCreditsStore } from "@/store/use-credits-store";
import { useCvModalStore } from "../hooks/use-cv-modal-store";
import { CV_TYPE_OPTIONS } from "@/features/cv/consts";

export function UploadCVModal() {
  const { isUploadOpen, onCloseUpload } = useCvModalStore();
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [cvType, setCvType] = useState<CvType>("TECHNOLOGY_ENGINEERING");
  const [opportunityType, setOpportunityType] = useState<OpportunityType>("EMPLOYMENT");
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setStep(1);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("title", title.trim());
      formData.append("cvType", cvType);
      formData.append("opportunityType", opportunityType);

      const response = await fetch("/api/cv/create-from-pdf", { method: "POST", body: formData });
      const data = await response.json();

      if (data.success) {
        toast.success("CV analizado y cargado con éxito");
        onCloseUpload();
        resetForm();
        await refreshCredits();
        router.push(`/cv/${data.cvId}/edit`);
      }
    } catch (error) {
      toast.error("Error al procesar el archivo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isUploadOpen} onOpenChange={(open) => {
      if (!open) {
        onCloseUpload();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[440px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        {/* Indicador de progreso minimalista */}
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
          <div
            className="h-full bg-accent transition-all duration-500 ease-in-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-accent shadow-inner">
              {step === 1 ? <Upload className="h-7 w-7" /> : <CheckCircle className="h-7 w-7" />}
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">
                {step === 1 ? "Importar PDF" : "Configurar CV"}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                {step === 1
                  ? "Sube tu archivo para extraer tu experiencia con IA."
                  : "Personaliza los detalles antes de finalizar."}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="min-h-[200px] flex flex-col justify-center">
            {step === 1 ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                {!file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border/60",
                      "bg-secondary/30 p-10 text-center transition-all hover:border-accent/40 hover:bg-secondary/50 cursor-pointer"
                    )}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setFile(f); setTitle(f.name.replace(".pdf", "")); }
                      }}
                    />
                    <div className="rounded-full bg-background p-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-accent" />
                    </div>
                    <p className="mt-4 text-sm font-bold">Seleccionar archivo</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Solo PDF (máx. 50MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/10 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg shadow-sm text-accent">
                        <FileIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground">Listo para procesar</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Título del documento
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl bg-secondary/50 border-none h-11 font-bold focus-visible:ring-accent/20"
                    placeholder="Ej: CV Senior Frontend"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Categoría profesional
                  </Label>
                  <Select value={cvType} onValueChange={(v) => setCvType(v as CvType)}>
                    <SelectTrigger className="rounded-xl bg-secondary/50 border-none h-11 font-bold focus-visible:ring-accent/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                      {CV_TYPE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="font-medium">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                disabled={!file}
                className="w-full rounded-xl h-12 font-bold text-sm transition-all active:scale-95"
                variant="accent"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl h-12 font-bold text-muted-foreground"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
                  variant="accent"
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Finalizar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
