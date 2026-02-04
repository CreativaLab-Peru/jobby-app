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
    onOpenChange(false);
  };

  const isFormValid = file !== null && title.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-levely-blue dark:text-levely-green flex items-center gap-2">
            📄 Subir CV
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Sube tu CV en formato PDF para crear un nuevo currículum
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Archivo PDF</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>

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
        </div>

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
            onClick={handleUpload}
            disabled={!isFormValid || isUploading}
            className="bg-levely-blue hover:bg-levely-blue/90 dark:bg-levely-green dark:hover:bg-levely-green/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Subiendo..." : "Subir CV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
