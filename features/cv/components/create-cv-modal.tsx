"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Sparkles, LayoutTemplate, ChevronLeft, ChevronRight } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CVForm } from "./cv-form";
import { createCVByTitleAndType } from "@/features/cv/actions/create-cv-by-title-and-type";
import { useCreditsStore } from "@/store/use-credits-store";
import { useCvModalStore } from "../hooks/use-cv-modal-store";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "harvard", label: "Harvard (Clásico)", preview: null },
  { id: "europass", label: "Europass Modern", preview: "/cv_templates/Europass_template.png" },
  { id: "stem", label: "Investigador STEM", preview: null },
  { id: "fullbright", label: "Líder Global", preview: null },
];

export function CreateCVModal() {
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();
  const { isCreateOpen, onCloseCreate } = useCvModalStore();

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<{
    title: string;
    cvType: CvType;
    opportunityType: OpportunityType;
    templateId: string;
  }>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "INTERNSHIP",
    templateId: "harvard",
  });

  // Safe access to current template
  const currentIndex = TEMPLATES.findIndex(t => t.id === formData.templateId);
  const currentTemplate = TEMPLATES[currentIndex] || TEMPLATES[0]; // Fallback al primero para evitar TypeError

  const handleCreateCV = () => {
    if (!formData.title.trim() || isPending) return;
    startTransition(() => {
      createCVByTitleAndType(
        formData.title,
        formData.cvType,
        formData.opportunityType,
        formData.templateId
      ).then(async (result) => {
        if (result?.success) {
          onCloseCreate();
          await refreshCredits();
          router.refresh();
          router.push(`/cv/${result.data.id}/edit`);
          toast.success("¡CV creado con éxito!");
        } else {
          toast.error(result?.message || "Error al crear el currículum.");
        }
      });
    });
  };

  const nextTemplate = () => {
    const next = TEMPLATES[(currentIndex + 1) % TEMPLATES.length];
    setFormData(prev => ({ ...prev, templateId: next.id }));
  };
  
  const prevTemplate = () => {
    const prevTpl = TEMPLATES[(currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length];
    setFormData(prev => ({ ...prev, templateId: prevTpl.id }));
  };

  // Solo Pasantía y Beca tienen templates seleccionables
  const showTemplatePreview =
    formData.opportunityType === OpportunityType.INTERNSHIP ||
    formData.opportunityType === OpportunityType.SCHOLARSHIP;

  return (
    <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
      <DialogContent className={cn(
          "w-full rounded-[2.5rem] border-none bg-background p-0 overflow-hidden shadow-2xl transition-all duration-300",
          showTemplatePreview ? "!max-w-[1000px]" : "!max-w-[460px]"
        )}>
        <div className={cn("flex", showTemplatePreview && "h-[680px]")}>
          {/* ── Columna izquierda: Formulario ── */}
          <div className={cn(
            "flex flex-col border-border/50 bg-white",
            showTemplatePreview ? "w-[400px] border-r" : "w-full"
          )}>
            <div className="px-8 pt-7 pb-2 flex-1 overflow-y-auto">
              <DialogHeader className="space-y-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                    Crea tu CV con IA
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">
                    Personaliza los detalles básicos para comenzar.
                  </DialogDescription>
                </div>
              </DialogHeader>

              {/* El formulario ahora respira mejor */}
              <div className="space-y-6">
                <CVForm
                  formData={formData}
                  onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data, templateId: data.templateId ?? prev.templateId }))}
                />
              </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50/80 border-t border-border/40 mt-auto">
              <div className="flex w-full gap-3">
                <Button variant="ghost" onClick={onCloseCreate} className="flex-1 font-semibold text-slate-500 hover:bg-slate-100">
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCV}
                  disabled={!formData.title.trim() || isPending}
                  className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-bold transition-all shadow-md active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Empezar diseño"}
                </Button>
              </div>
            </DialogFooter>
          </div>

          {/* ── Columna derecha: Preview interactivo (solo para Pasantía/Beca) ── */}
          {showTemplatePreview && <div className="flex-1 bg-[#F8FAFC] relative flex flex-col items-center justify-center p-12 overflow-hidden">
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-20">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Estilo de Plantilla</span>
              <div className="flex gap-2">
                 <Button onClick={prevTemplate} variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm border-slate-200">
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                 </Button>
                 <Button onClick={nextTemplate} variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm border-slate-200">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                 </Button>
              </div>
            </div>

            {/* Contenedor del CV con perspectiva */}
            <div className="relative w-full max-w-[400px] group transition-all duration-500">
              <div className={cn(
                "relative transition-all duration-500 ease-in-out shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden bg-white border border-slate-100",
                isPending ? "scale-90 opacity-50 blur-[2px]" : "scale-100 opacity-100"
              )}>
                {currentTemplate.preview ? (
                  <Image
                    src={currentTemplate.preview}
                    alt={currentTemplate.label}
                    width={400}
                    height={560}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <div className="aspect-[1/1.41] w-full p-8 flex flex-col bg-white">
                    {/* Skeleton del CV para dar contexto visual */}
                    <div className="h-3 w-1/2 bg-slate-100 rounded mb-6" />
                    <div className="space-y-4">
                       <div className="h-1.5 w-full bg-slate-50 rounded" />
                       <div className="h-1.5 w-full bg-slate-50 rounded" />
                       <div className="h-1.5 w-3/4 bg-slate-50 rounded" />
                    </div>
                    <div className="mt-10 space-y-4 flex-1">
                       <div className="h-2 w-1/4 bg-slate-100 rounded" />
                       <div className="h-1.5 w-full bg-slate-50 rounded" />
                       <div className="h-1.5 w-full bg-slate-50 rounded" />
                    </div>
                    <div className="flex flex-col items-center justify-center pb-10">
                         <LayoutTemplate className="h-8 w-8 text-slate-200 mb-2" />
                         <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter text-center">
                            Próximamente: {currentTemplate.label}
                         </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Etiqueta flotante */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 z-30 min-w-max">
                <span className="text-[11px] font-bold">{currentTemplate.label}</span>
              </div>
            </div>

            {/* Indicadores de posición */}
            <div className="absolute bottom-8 flex gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData(prev => ({ ...prev, templateId: t.id }))}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    t.id === formData.templateId ? "w-8 bg-slate-800" : "w-2 bg-slate-300 hover:bg-slate-400"
                  )}
                />
              ))}
            </div>
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}