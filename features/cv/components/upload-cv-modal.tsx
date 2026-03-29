"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ChevronRight, FileIcon, X, Sparkles, CreditCard } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { useCvModalStore } from "../hooks/use-cv-modal-store";
import { cvTypeOptions } from "@/features/cv/consts";
import { FormSelect } from "@/components/form/select-input";
import { UploadCvFormValues, uploadCvSchema } from "@/features/cv/schema";
import { opportunities, RECOMMENDATIONS_BY_OPPORTUNITY } from "@/const";
import { CvSectionSelector } from "@/features/cv/components/cv-section-selector";
import { createCvFromPdfAction } from "@/features/cv/actions/create-cv-from-pdf";
import { useCreditsStore } from "@/store/use-credits-store";

interface UploadCVModalProps {
  initialFile?: File | Blob | null;
  reset: () => void;
}

export function UploadCVModal({ initialFile, reset: resetParent }: UploadCVModalProps) {
  const router = useRouter();
  const { refreshCredits, credits } = useCreditsStore();

  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploadOpen, onCloseUpload } = useCvModalStore();

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
      sections: [],
    },
  });

  const currentFile = watch("file");
  const currentTitle = watch("title");
  const currentOpportunity = watch("opportunityType");
  const currentSections = watch("sections") || [];

  useEffect(() => {
    if (initialFile && isUploadOpen) {
      const fileToSet = initialFile instanceof File
        ? initialFile
        : new File([initialFile], "Mi_CV.pdf", { type: "application/pdf" });

      setValue("file", fileToSet, { shouldValidate: true });
      setValue("title", fileToSet.name.replace(/\.pdf$/i, ""), { shouldValidate: true });
    }
  }, [initialFile, isUploadOpen, setValue]);

  useEffect(() => {
    if (currentOpportunity) {
      const suggested = RECOMMENDATIONS_BY_OPPORTUNITY[currentOpportunity] || [];
      setValue("sections", suggested, { shouldValidate: true });
    }
  }, [currentOpportunity, setValue]);

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
      formData.append("sections", JSON.stringify(data.sections));

      const result = await createCvFromPdfAction(formData);

      if (result?.error) {
        toast.error(result.error || 'No se pudo agregar tu CV');
        return;
      }

      toast.success("Extrayendo datos con IA...");
      setTimeout(() => {
        handleClose();
        refreshCredits();
        resetParent();
        router.push(`/cv/${result.cvId}/processing`);
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isUploadOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "overflow-hidden transition-all duration-500 ease-in-out p-0 border-none bg-background shadow-2xl rounded-[2.5rem]",
        step === 1 ? "max-w-[500px]" : "max-w-[1000px]"
      )}>

        {/* Barra de Progreso Superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary/30 z-50">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            style={{ width: isUploading ? '100%' : (step === 1 ? '33%' : '66%') }}
          />
        </div>

        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header Principal */}
          <div className="p-8 pb-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shrink-0">
                {step === 1 ? <Upload className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-2xl font-black tracking-tight">
                  {step === 1 ? "Importar desde PDF" : "Estructura del nuevo CV"}
                </DialogTitle>
                <DialogDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {step === 1 ? "Paso 01: Archivo fuente" : "Paso 02: Configuración de IA"}
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className={cn(
            "flex-1 overflow-y-auto",
            step === 2 && "grid grid-cols-1 lg:grid-cols-2"
          )}>

            {/* COLUMNA 1 / PASO 1 */}
            <div className={cn(
              "p-8 space-y-6",
              step === 2 && "border-r border-border/40"
            )}>
              {step === 1 ? (
                /* Layout Paso 1: Centrado */
                <div className="space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
                  {!currentFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary/20 bg-secondary/10 p-12 text-center transition-all hover:border-primary/40 hover:bg-secondary/20 cursor-pointer"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={onFileChange} />
                      <div className="rounded-2xl bg-background p-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="mt-4 text-sm font-black">Haz clic o arrastra tu PDF</p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-tight">Límite 5MB por archivo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 border-dashed animate-in slide-in-from-bottom-4">
                      <div className="p-4 bg-background rounded-2xl shadow-sm text-primary ring-4 ring-primary/5">
                        <FileIcon className="h-10 w-10" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-foreground max-w-[250px] truncate">{currentFile.name}</p>
                        <p className="text-[10px] font-bold text-primary uppercase mt-1">Archivo seleccionado</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setValue("file", null as any)}
                        className="rounded-xl hover:bg-destructive/10 text-destructive font-bold text-[10px]"
                      >
                        REEMPLAZAR ARCHIVO
                      </Button>
                    </div>
                  )}
                  {errors.file && <p className="text-[10px] text-center text-destructive font-black uppercase italic">{errors.file.message}</p>}
                </div>
              ) : (
                /* Contenido Columna Izquierda en Paso 2 */
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <Label className="text-xs font-black ml-1 uppercase text-muted-foreground">Nombre del proyecto</Label>
                    <Input
                      {...register("title")}
                      className="rounded-2xl bg-secondary/30 border-none h-12 font-bold px-4"
                      placeholder="Ej: CV Estratégico 2026"
                      disabled={isUploading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Plantilla"
                      value={watch("templateId")}
                      options={[
                        { key: "harvard", value: "Harvard" },
                        { key: "europass", value: "Modern" },
                      ]}
                      onChange={(v) => setValue("templateId", v as any)}
                    />
                    <FormSelect
                      label="Perfil"
                      value={watch("cvType")}
                      options={cvTypeOptions.map(({ value, label }) => ({ key: value, value: label }))}
                      onChange={(v) => setValue("cvType", v as CvType)}
                    />
                  </div>

                  <FormSelect
                    label="Oportunidad Objetivo"
                    value={watch("opportunityType")}
                    options={opportunities}
                    onChange={(v) => setValue("opportunityType", v as OpportunityType)}
                  />

                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Costo de importación</p>
                      <p className="text-[11px] font-bold text-muted-foreground mt-1">
                        Utilizarás 1 crédito de tus <span className="text-foreground">{credits.manageCvsLimit}</span> disponibles.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA 2 (Solo Paso 2) */}
            {step === 2 && (
              <div className="p-8 bg-secondary/5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1 mb-4">
                  <h4 className="text-sm font-black uppercase text-primary tracking-tight">Bloques de Extracción</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">IA extraerá datos solo para estas secciones</p>
                </div>

                <div className="bg-background/60 p-6 rounded-[2rem] border border-border/40 shadow-sm">
                  <CvSectionSelector
                    opportunityType={currentOpportunity}
                    selectedSections={currentSections}
                    onChange={(newSections) => setValue("sections", newSections, { shouldValidate: true })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Unificado */}
          <DialogFooter className="p-8 bg-background border-t border-border/40 shrink-0">
            <div className="flex w-full gap-4">
              {step === 1 ? (
                <Button
                  onClick={() => setStep(2)}
                  disabled={!currentFile || !!errors.file || (credits.manageCvsLimit <= 0)}
                  className="w-full rounded-2xl h-14 font-black transition-all active:scale-95 shadow-xl shadow-primary/20"
                  variant="accent"
                >
                  CONFIGURAR EXTRACCIÓN
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-2xl h-14 font-bold text-muted-foreground hover:bg-secondary/20 transition-all"
                    disabled={isUploading}
                  >
                    ATRÁS
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUploading || !isValid || credits.manageCvsLimit <= 0}
                    className="flex-[2] rounded-2xl h-14 font-black shadow-xl shadow-primary/20 transition-all active:scale-95"
                    variant="accent"
                  >
                    {isUploading ? "PROCESANDO ARCHIVO..." : "INICIAR IMPORTACIÓN IA"}
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
