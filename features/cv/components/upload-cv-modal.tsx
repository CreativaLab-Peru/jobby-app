"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CvType, OpportunityType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreditsStore } from "@/store/use-credits-store";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPE = "application/pdf";

interface UploadCVModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CV_TYPE_OPTIONS = [
  { value: "TECHNOLOGY_ENGINEERING", label: "Tecnología e Ingeniería" },
  { value: "BUSINESS_FINANCE", label: "Negocios y Finanzas" },
  { value: "CREATIVE_DESIGN", label: "Creativo y Diseño" },
  { value: "HEALTHCARE_SCIENCE", label: "Salud y Ciencia" },
  { value: "EDUCATION_TRAINING", label: "Educación y Formación" },
  { value: "SALES_MARKETING", label: "Ventas y Marketing" },
  { value: "OTHER", label: "Otro" },
] as const;

const OPPORTUNITY_TYPE_OPTIONS = [
  { value: "EMPLOYMENT", label: "Empleo" },
  { value: "INTERNSHIP", label: "Pasantía" },
  { value: "VOLUNTEERING", label: "Voluntariado" },
] as const;

export function UploadCVModal({
  children,
  isOpen,
  onOpenChange,
}: UploadCVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [cvType, setCvType] = useState<CvType>("TECHNOLOGY_ENGINEERING");
  const [opportunityType, setOpportunityType] = useState<OpportunityType>("EMPLOYMENT");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState(1);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();

  const validateFile = useCallback((selectedFile: File): boolean => {
    setFileError("");

    if (selectedFile.type !== ALLOWED_MIME_TYPE) {
      setFileError("El archivo debe ser un PDF válido");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`El archivo es muy grande. Máximo ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
    }
  }, [title, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (!validateFile(droppedFile)) {
      toast.error(fileError);
      return;
    }

    setFile(droppedFile);
    if (!title) {
      setTitle(droppedFile.name.replace(/\.pdf$/i, ""));
    }
  }, [title, validateFile, fileError]);

  const resetForm = useCallback(() => {
    setFile(null);
    setTitle("");
    setCvType("TECHNOLOGY_ENGINEERING");
    setOpportunityType("EMPLOYMENT");
    setStep(1);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUpload = async () => {
    if (!file || isUploading || !isFormValid) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("title", title.trim());
      formData.append("cvType", cvType);
      formData.append("opportunityType", opportunityType);

      const response = await fetch("/api/cv/create-from-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("CV creado exitosamente");
        resetForm();
        onOpenChange(false);
        await refreshCredits();
        router.refresh();
        router.push(`/cv/${data.cvId}/edit`);
      } else {
        toast.error(data.message || "❌ Error al subir el CV");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("❌ Error al subir el CV. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep(1);
  };

  const isFormValid = file !== null && title.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-levely-blue dark:text-levely-green flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir CV
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sube tu CV en formato PDF para crear un nuevo currículum
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="file">Archivo PDF</Label>
              <div
                className={`h-60 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDragging
                    ? "border-levely-blue bg-levely-blue/5 dark:border-levely-green dark:bg-levely-green/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Arrastra tu PDF aquí o{" "}
                    <label
                      htmlFor="file"
                      className="text-levely-blue dark:text-levely-green underline cursor-pointer hover:opacity-80"
                    >
                      selecciona un archivo
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Máximo 50MB • Solo archivos PDF
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              {fileError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{fileError}</p>
                </div>
              )}

              {file && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-md p-3 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600 dark:text-green-400 break-all">
                    {file.name}
                  </p>
                </div>
              )}

              <DialogFooter className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => file && setStep(2)}
                  disabled={!file || isUploading}
                  className="bg-levely-blue hover:bg-levely-blue/90 dark:bg-levely-green dark:hover:bg-levely-green/90"
                >
                  Siguiente
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Título del CV *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Mi CV Profesional"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvType">Tipo de CV *</Label>
                <Select value={cvType} onValueChange={(value) => setCvType(value as CvType)}>
                  <SelectTrigger id="cvType" disabled={isUploading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CV_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunityType">Tipo de Oportunidad *</Label>
                <Select
                  value={opportunityType}
                  onValueChange={(value) => setOpportunityType(value as OpportunityType)}
                >
                  <SelectTrigger id="opportunityType" disabled={isUploading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isUploading}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!isFormValid || isUploading}
                  className="bg-levely-blue hover:bg-levely-blue/90 dark:bg-levely-green dark:hover:bg-levely-green/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir CV
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
