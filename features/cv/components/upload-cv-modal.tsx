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
import { FormField } from "@/components/form-field";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
  const [activeTab, setActiveTab] = useState<"identidad" | "estructura">("identidad");
  const [dragActive, setDragActive] = useState(false);
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setValue("file", file, { shouldValidate: true });
      }
    }
  };

  const currentFile = watch("file");
  const currentOpportunity = watch("opportunityType");
  const currentSections = watch("sections") || [];

  // Efectos de inicialización y sincronización
  useEffect(() => {
    if (initialFile && isUploadOpen) {
      const fileToSet =
        initialFile instanceof File
          ? initialFile
          : new File([initialFile], "Mi_CV.pdf", { type: "application/pdf" });
      setValue("file", fileToSet, { shouldValidate: true });
      setValue("title", fileToSet.name.replace(/\.pdf$/i, ""), { shouldValidate: true });
    }
  }, [initialFile, isUploadOpen, setValue]);

  useEffect(() => {
    if (!isUploadOpen || !currentOpportunity) return;

    const suggested = RECOMMENDATIONS_BY_OPPORTUNITY[currentOpportunity] || [];
    setValue("sections", suggested, { shouldValidate: true });
  }, [isUploadOpen, currentOpportunity, setValue]);

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
        "max-w-[95vw] lg:max-w-6xl w-full p-0 overflow-hidden border border-border bg-background shadow-2xl rounded-xl transition-all duration-300",
        step === 1 && "lg:max-w-xl"
      )}>
        <div className={cn(
          "flex flex-col",
          step === 1 ? "h-auto" : "h-[90vh] md:h-[80vh]"
        )}>
          {/* Header Superior - Homogenizado con CreateCVModal */}
          <div className="p-8 border-b border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {step === 1 ? <Upload size={20} /> : <Sparkles size={20} />}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold leading-none">
                  {step === 1 ? "Importar archivo" : "Configuración de datos"}
                </DialogTitle>
                <DialogDescription className="text-xs mt-1">
                  {step === 1
                    ? "Selecciona el PDF de tu CV actual."
                    : "Confirma cómo se procesarán los datos extraídos."}
                </DialogDescription>
              </div>
            </div>

            {step === 2 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 sm:flex-none h-10 font-semibold text-xs"
                  disabled={isUploading}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isUploading || !isValid}
                  className="flex-[2] sm:flex-none h-10 px-6 font-bold text-xs"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    "Confirmar e Importar"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Selector de Pestañas Móvil (Solo aparece en Paso 2 en móvil) */}
          {step === 2 && (
            <div className="md:hidden flex border-b border-border bg-background">
              <button
                onClick={() => setActiveTab("identidad")}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold transition",
                  activeTab === "identidad"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground",
                )}
              >
                01 Identidad
              </button>
              <button
                onClick={() => setActiveTab("estructura")}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold transition",
                  activeTab === "estructura"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground",
                )}
              >
                02 Estructura
              </button>
            </div>
          )}

          <div
            className={cn(
              "flex-1 overflow-hidden",
              step === 2 && "grid grid-cols-1 md:grid-cols-2"
            )}
          >
            {/* COLUMNA 1 - IDENTIDAD (Clonado de cv-form.tsx) */}
            <div
              className={cn(
                "flex flex-col md:border-r border-border min-h-0",
                step === 1 || (step === 2 && activeTab === "identidad") ? "flex" : "hidden",
                "md:flex md:h-full"
              )}
            >
              {step === 1 ? (
                /* Subida de Archivo */
                <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                  <div className="shrink-0 mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">01. Importación</h3>
                    <p className="text-xs text-muted-foreground">
                      Selecciona el PDF de tu CV actual para empezar.
                    </p>
                  </div>

                  {!currentFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer group p-12 text-center",
                        dragActive
                          ? "border-primary bg-primary/10 scale-105"
                          : "border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04]"
                      )}
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
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-transform",
                        dragActive ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover:scale-110"
                      )}>
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {dragActive ? "¡Suelta el archivo aquí!" : "Seleccionar PDF"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Máximo 5MB • Formato PDF
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/[0.04]">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <FileIcon size={16} />
                        </div>
                        <span className="text-sm font-bold truncate">{currentFile.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setValue("file", null as any)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                  {errors.file && (
                    <p className="text-xs text-destructive text-center font-bold uppercase tracking-wider">
                      {errors.file.message}
                    </p>
                  )}

                  {step === 1 && currentFile && (
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full h-10 font-bold text-xs"
                    >
                      Siguiente paso
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                /* Formulario de Configuración - Estilo idéntico a cv-form.tsx */
                <>
                  <div className="shrink-0 p-6 md:p-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">01. Identidad</h3>
                    <p className="text-xs text-muted-foreground">
                      Define los parámetros básicos de tu documento.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-6 md:px-8 md:pb-8 space-y-6">
                    <FormField
                      label="Nombre del CV"
                      placeholder="Ej: CV John Doe"
                      register={register("title")}
                      error={errors.title?.message}
                      className="focus-visible:ring-primary"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormSelect
                        label="Diseño"
                        value={watch("templateId")}
                        options={[
                          { key: "harvard", value: "Harvard" },
                          { key: "europass", value: "Europass" },
                        ]}
                        onChange={(v) => setValue("templateId", v as any)}
                        className="focus:ring-primary focus-visible:ring-primary"
                      />
                      <FormSelect
                        label="Perfil Profesional"
                        value={watch("cvType")}
                        options={cvTypeOptions.map(({ value, label }) => ({
                          key: value,
                          value: label,
                        }))}
                        onChange={(v) => setValue("cvType", v as CvType)}
                        className="focus:ring-primary focus-visible:ring-primary"
                      />
                    </div>

                    <FormSelect
                      label="Tipo de Oportunidad"
                      value={watch("opportunityType")}
                      options={opportunities}
                      onChange={(v) => setValue("opportunityType", v as OpportunityType)}
                      className="focus:ring-secondary focus-visible:ring-secondary"
                    />

                    <div className="p-4 rounded-xl border border-primary/10 bg-primary/[0.02] flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <CreditCard size={16} />
                      </div>
                      <span className="text-xs font-bold">
                        Créditos:{" "}
                        <span className="text-primary">{credits.manageCvsLimit} disponibles</span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* COLUMNA 2 - ESTRUCTURA (Clonado de cv-form.tsx) */}
            {step === 2 && (
              <div className={cn(
                "flex flex-col bg-secondary/5 min-h-0 md:h-full",
                activeTab === "estructura" ? "flex" : "hidden",
                "md:flex"
              )}>
                <div className="shrink-0 p-6 md:p-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">02. Estructura</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    La IA buscará estos datos en tu documento.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 md:px-8 md:pb-8">
                  <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
                    <CvSectionSelector
                      opportunityType={currentOpportunity}
                      selectedSections={currentSections}
                      onChange={(newSections) =>
                        setValue("sections", newSections, { shouldValidate: true })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
