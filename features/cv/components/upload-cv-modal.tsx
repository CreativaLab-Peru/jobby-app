"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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

interface UploadCVModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  const [step, setStep] = useState(1); // 1: Selección archivo, 2: Formulario
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace('.pdf', ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-levely-blue", "bg-levely-blue/5");
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(".pdf", ""));
      }
    } else {
      toast.error("Por favor sube un archivo PDF");
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("title", title);
      formData.append("cvType", cvType);
      formData.append("opportunityType", opportunityType);

      const response = await fetch("/api/cv/create-from-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ CV creado exitosamente");
        onOpenChange(false);
        // Reset form
        setFile(null);
        setTitle("");
        setCvType("TECHNOLOGY_ENGINEERING");
        setOpportunityType("EMPLOYMENT");
        setStep(1);
        // Refresh credits
        await refreshCredits();
        // Navigate and refresh
        router.refresh();
        router.push(`/cv/${data.cvId}/edit`);
      } else {
        toast.error(data.message || "❌ Error al subir el CV");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("❌ Error al subir el CV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setTitle("");
    setCvType("TECHNOLOGY_ENGINEERING");
    setOpportunityType("EMPLOYMENT");
    setStep(1);
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
            📄 Subir CV
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
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-muted-foreground/50 dark:hover:border-muted-foreground/50"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-levely-blue", "bg-levely-blue/5");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-levely-blue", "bg-levely-blue/5");
                }}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Arrastra tu PDF aquí o{" "}
                  <label htmlFor="file" className="text-levely-blue dark:text-levely-green underline cursor-pointer">
                    selecciona un archivo
                  </label>
                </p>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  ✓ Archivo seleccionado: {file.name}
                </p>
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
                <Label htmlFor="title">Título del CV</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Mi CV Profesional"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvType">Tipo de CV</Label>
                <Select value={cvType} onValueChange={(value) => setCvType(value as CvType)}>
                  <SelectTrigger id="cvType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNOLOGY_ENGINEERING">Tecnología e Ingeniería</SelectItem>
                    <SelectItem value="BUSINESS_FINANCE">Negocios y Finanzas</SelectItem>
                    <SelectItem value="CREATIVE_DESIGN">Creativo y Diseño</SelectItem>
                    <SelectItem value="HEALTHCARE_SCIENCE">Salud y Ciencia</SelectItem>
                    <SelectItem value="EDUCATION_TRAINING">Educación y Formación</SelectItem>
                    <SelectItem value="SALES_MARKETING">Ventas y Marketing</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunityType">Tipo de Oportunidad</Label>
                <Select 
                  value={opportunityType} 
                  onValueChange={(value) => setOpportunityType(value as OpportunityType)}
                >
                  <SelectTrigger id="opportunityType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYMENT">Empleo</SelectItem>
                    <SelectItem value="INTERNSHIP">Práctica</SelectItem>
                    <SelectItem value="VOLUNTEERING">Voluntariado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="flex gap-3 pt-2">
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
                  className="bg-levely-blue hover:bg-levely-blue/90 dark:bg-levely-green dark:hover:bg-levely-green/90 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? (
                    <>
                      Subiendo...
                      <span className="ml-2 animate-spin inline-block align-middle">
                        <svg className="w-4 h-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </span>
                    </>
                  ) : "Subir CV"}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center">
              <span className="animate-spin mb-4">
                <svg className="w-12 h-12 text-white dark:text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </span>
              <span className="text-white dark:text-black font-semibold text-lg">Subiendo CV...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
