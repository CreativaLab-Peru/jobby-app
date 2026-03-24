"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, CheckCircle, ChevronRight, FileIcon, X } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useCredits } from "@/features/credits/hooks/use-credits";
import { useCvModalStore } from "../hooks/use-cv-modal-store";
import { cvTypeOptions } from "@/features/cv/consts";
import { FormSelect } from "@/components/form/select-input";
import {UploadCvFormValues, uploadCvSchema} from "@/features/cv/schema";
import {opportunities} from "@/const";


interface UploadCVModalProps {
  initialFile?: File | Blob | null;
  reset: () => void;
}

export function UploadCVModal({ initialFile, reset: resetParent }: UploadCVModalProps) {
  const { isUploadOpen, onCloseUpload } = useCvModalStore();
  const router = useRouter();
  const { refreshCredits, credits, isLoading: isLoadingCredits } = useCredits();

  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Form Setup ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UploadCvFormValues>({
    resolver: zodResolver(uploadCvSchema as any),
    mode: "onChange",
    defaultValues: {
      title: "",
      cvType: "TECHNOLOGY_ENGINEERING",
      opportunityType: "SCHOLARSHIP",
      templateId: "harvard",
    },
  });

  const currentFile = watch("file");
  const currentTitle = watch("title");

  // Sync initial file with Form State
  useEffect(() => {
    if (initialFile && isUploadOpen) {
      const fileToSet = initialFile instanceof File
        ? initialFile
        : new File([initialFile], "Mi_CV.pdf", { type: "application/pdf" });

      setValue("file", fileToSet, { shouldValidate: true });
      setValue("title", fileToSet.name.replace(/\.pdf$/i, ""), { shouldValidate: true });
    }
  }, [initialFile, isUploadOpen, setValue]);

  const handleClose = () => {
    if (isUploading) return;
    onCloseUpload();
    reset();
    setStep(1);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setValue("file", f, { shouldValidate: true });
      if (!currentTitle) {
        setValue("title", f.name.replace(/\.pdf$/i, ""), { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (data: UploadCvFormValues) => {
    if (credits.manageCvsLimit <= 0) {
      toast.error("No tienes créditos suficientes.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", data.file);
      formData.append("title", data.title.trim());
      formData.append("cvType", data.cvType);
      formData.append("opportunityType", data.opportunityType);
      formData.append("templateId", data.templateId);

      const response = await fetch("/api/cv/create-from-pdf", { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Error al procesar");

      toast.success("Procesando tu CV...");
      handleClose();
      refreshCredits();
      resetParent();
      router.push(`/cv/${result.cvId}/processing`);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isUploadOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary z-50">
          <div
            className="h-full bg-accent transition-all duration-500 ease-in-out"
            style={{ width: isUploading ? '100%' : (step === 1 ? '50%' : '100%') }}
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

          <div className="min-h-[220px] flex flex-col justify-center">
            {step === 1 ? (
              /* --- PASO 1: SUBIDA --- */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                {!currentFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border/60",
                      "bg-secondary/30 p-10 text-center transition-all hover:border-accent/40 hover:bg-secondary/50 cursor-pointer",
                      errors.file && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={onFileChange} />
                    <div className="rounded-full bg-background p-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-accent" />
                    </div>
                    <p className="mt-4 text-sm font-bold">Seleccionar archivo</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Solo PDF (máx. 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/10 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg shadow-sm text-accent">
                        <FileIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[180px]">{currentFile.name}</span>
                        <span className="text-[10px] text-muted-foreground">Listo para procesar</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setValue("file", null as any)}
                      className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {errors.file && <p className="text-xs text-center text-destructive font-bold">{errors.file.message}</p>}
              </div>
            ) : (
              /* --- PASO 2: CONFIGURACIÓN --- */
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs ml-1">
                    Nombre del CV
                  </Label>
                  <Input
                    {...register("title")}
                    className={cn(
                      "rounded-xl bg-secondary/50 border-none h-11 font-bold focus-visible:ring-accent/20",
                      errors.title && "ring-2 ring-destructive"
                    )}
                    placeholder="Ej: CV Senior Frontend"
                    disabled={isUploading}
                  />
                  {errors.title && <p className="text-[10px] text-destructive font-bold ml-1">{errors.title.message}</p>}
                </div>

                <FormSelect
                  label="Diseño del CV"
                  value={watch("templateId")}
                  options={[
                    { key: "harvard", value: "Harvard (Recomendado)" },
                    { key: "europass", value: "Europass Modern" },
                  ]}
                  onChange={(v) => setValue("templateId", v as any, { shouldValidate: true })}
                  disabled={isUploading}
                  error={errors.templateId?.message}
                />

                <FormSelect
                  label="Perfil profesional"
                  value={watch("cvType")}
                  options={cvTypeOptions.map(({ value, label }) => ({ key:value, value:label }))}
                  onChange={(v) => setValue("cvType", v as CvType, { shouldValidate: true })}
                  disabled={isUploading}
                  error={errors.cvType?.message}
                />

                <FormSelect
                  label="Tipo de Oportunidad"
                  value={watch("opportunityType")}
                  options={opportunities}
                  onChange={(v) => setValue("opportunityType", v as OpportunityType, { shouldValidate: true })}
                  disabled={isUploading}
                  error={errors.opportunityType?.message}
                />

                {/* Info Créditos */}
                <div className="mt-4 p-4 rounded-2xl bg-secondary/20 border border-border/50 flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-accent/10 rounded text-accent">
                    <Upload className="h-3 w-3" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-wider text-accent">Créditos</p>
                    <p className="text-[10px] text-muted-foreground/60 leading-tight">
                      Tienes <span className="font-bold text-foreground">{credits.manageCvsLimit}</span> disponibles.
                    </p>
                  </div>
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
                disabled={
                  !currentFile ||
                  !!errors.file ||
                  isLoadingCredits ||
                  (!isLoadingCredits && credits.manageCvsLimit <= 0)
                }
                className="w-full rounded-xl h-12 font-bold transition-all active:scale-95"
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
                  disabled={isUploading}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isUploading || !isValid || credits.manageCvsLimit <= 0}
                  className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
                  variant="accent"
                >
                  {isUploading ? "Subiendo..." : "Finalizar e Importar"}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
