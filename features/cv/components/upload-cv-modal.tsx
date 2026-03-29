"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ChevronRight, FileIcon, X, Sparkles, CreditCard, Loader2 } from "lucide-react";
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
  const { isUploadOpen, onCloseUpload } = useCvModalStore();

  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const currentOpportunity = watch("opportunityType");
  const currentSections = watch("sections") || [];

  // Efectos de inicialización y sincronización
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
        toast.error(result.error);
        return;
      }

      toast.success("Importación iniciada");
      handleClose();
      refreshCredits();
      resetParent();
      router.push(`/cv/${result.cvId}/processing`);
    } catch (error: any) {
      toast.error("Error inesperado al procesar el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isUploadOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "p-0 border-border bg-background shadow-lg transition-all duration-300",
        step === 1 ? "max-w-lg" : "max-w-5xl w-[95vw]"
      )}>

        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header Minimalista */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                {step === 1 ? <Upload size={20} /> : <Sparkles size={20} />}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {step === 1 ? "Importar archivo" : "Configuración de extracción"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {step === 1 ? "Selecciona el PDF de tu CV actual." : "Confirma cómo la IA procesará tu información."}
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className={cn(
            "flex-1 overflow-y-auto min-h-[300px]",
            step === 2 && "grid grid-cols-1 md:grid-cols-2"
          )}>

            {/* COLUMNA 1 */}
            <div className={cn("p-6 space-y-6", step === 2 && "border-b md:border-b-0 md:border-r border-border")}>
              {step === 1 ? (
                /* Subida de Archivo */
                <div className="py-4">
                  {!currentFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-secondary/20 p-10 text-center hover:bg-secondary/40 transition-colors cursor-pointer"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setValue("file", f, { shouldValidate: true });
                        }}
                      />
                      <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                      <p className="text-sm font-semibold text-foreground">Seleccionar PDF</p>
                      <p className="text-xs text-muted-foreground mt-1 tracking-tight">Máximo 5MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileIcon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{currentFile.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setValue("file", null as any)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                  {errors.file && <p className="text-xs text-destructive mt-3 font-medium">{errors.file.message}</p>}
                </div>
              ) : (
                /* Formulario de Configuración */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Título del CV</Label>
                    <Input
                      {...register("title")}
                      className="h-10 rounded-lg bg-secondary/30"
                      placeholder="Ej: CV Senior Backend"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormSelect
                      label="Plantilla"
                      value={watch("templateId")}
                      options={[{ key: "harvard", value: "Harvard" }, { key: "europass", value: "Europass" }]}
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
                    label="Oportunidad"
                    value={watch("opportunityType")}
                    options={opportunities}
                    onChange={(v) => setValue("opportunityType", v as OpportunityType)}
                  />

                  <div className="p-4 rounded-xl border border-border bg-secondary/10 flex items-center gap-3">
                    <CreditCard size={16} className="text-muted-foreground" />
                    <span className="text-xs font-medium">
                      Créditos disponibles: <b className="text-foreground">{credits.manageCvsLimit}</b>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA 2 (Selector de Secciones) */}
            {step === 2 && (
              <div className="p-6 bg-secondary/5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold">Secciones a extraer</h4>
                  <p className="text-[11px] text-muted-foreground">La IA buscará estos datos en tu documento.</p>
                </div>

                <div className="bg-background rounded-xl border border-border p-4">
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
          <div className="p-6 border-t border-border bg-background">
            <div className="flex w-full gap-3">
              {step === 1 ? (
                <Button
                  onClick={() => setStep(2)}
                  disabled={!currentFile || !!errors.file}
                  className="w-full h-11 font-bold"
                >
                  Siguiente paso
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 font-bold"
                    disabled={isUploading}
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUploading || !isValid}
                    className="flex-[2] h-11 font-bold"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      "Importar ahora"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
