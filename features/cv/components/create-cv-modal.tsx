"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {Loader2, Sparkles, LayoutTemplate} from "lucide-react";
import {toast} from "sonner";
import Image from "next/image";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {CVForm} from "./cv-form";
import {
  CreateCvBody,
  createCVByTitleAndType
} from "@/features/cv/actions/create-cv-by-title-and-type";
import {useCreditsStore} from "@/store/use-credits-store";
import {useCvModalStore} from "../hooks/use-cv-modal-store";
import {cn} from "@/lib/utils";
import {CVFormData} from "@/features/cv/schema";
import {Language} from "@prisma/client";
import {useRouteStore} from "@/store/use-route-store";
import {getRoutesForUser} from "@/features/routes/actions/get-routes-for-user";

const TEMPLATES = [
  {id: "harvard", label: "Harvard (Clásico)", preview: "/cv_templates/Harvard_template.png"},
  {id: "europass", label: "Europass Modern", preview: "/cv_templates/Europass_template.png"},
];

export function CreateCVModal() {
  const router = useRouter();
  const {refreshCredits} = useCreditsStore();
  const {isCreateOpen, onCloseCreate} = useCvModalStore();

  // Upload route
  const {hydrate} = useRouteStore();

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CVFormData>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "SCHOLARSHIP",
    templateId: "harvard",
    language: Language.ES,
  });

  const currentIndex = TEMPLATES.findIndex(t => t.id === formData.templateId);
  const currentTemplate = TEMPLATES[currentIndex] || TEMPLATES[0];

  const handleCreateCV = async () => {
    if (!formData.title.trim() || isPending) return;
    startTransition( async () => {
      const body: CreateCvBody = {
        cvType: formData.cvType,
        title: formData.title,
        templateId: formData.templateId,
        opportunityType: formData.opportunityType,
        language: formData.language,
      }
      const result = await createCVByTitleAndType(body)
      if (result?.success) {
        onCloseCreate();
        await refreshCredits();

        const routesResult = await getRoutesForUser();
        if (!routesResult.success) {
          toast.error(routesResult.message || "CV creado, pero no se pudieron cargar las rutas.");
          return;
        }
        hydrate(routesResult.routes);

        router.refresh();
        router.push(`/cv/${result.data.id}/edit`);
        toast.success("¡CV creado con éxito!");
      } else {
        toast.error(result?.message || "Error al crear el currículum.");
      }
    });
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
      <DialogContent className={cn(
        "w-full rounded-[2.5rem] border-secondary/20 bg-background p-0 overflow-hidden shadow-2xl transition-all duration-500 min-h-[80vh] max-h-[90vh] overflow-y-auto !max-w-[85vw]"
      )}>
        <div className="flex flex-col md:flex-row h-full">

          {/* ── SECCIÓN FORMULARIO (Lado Izquierdo) ── */}
          <div className={cn(
            "flex flex-col bg-background w-full md:w-[450px] border-r border-secondary/10"
          )}>
            <div className="px-10 pt-10 pb-6 flex-1 overflow-y-auto">
              <DialogHeader className="space-y-4 mb-8">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <Sparkles className="h-7 w-7"/>
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black tracking-tight text-foreground">
                    Crea tu CV con IA
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-medium">
                    Personaliza los detalles para tu nueva oportunidad.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <CVForm
                  defaultValues={formData}
                  onValuesChange={setFormData}
                />
              </div>
            </div>

            <DialogFooter className="p-8 bg-secondary/5 border-t border-secondary/10">
              <div className="flex w-full gap-4">
                <Button
                  variant="ghost"
                  onClick={onCloseCreate}
                  className="flex-1 font-bold text-muted-foreground hover:bg-secondary/10 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCV}
                  disabled={!formData.title.trim() || isPending}
                  className="flex-[2] bg-primary hover:opacity-90 text-primary-foreground rounded-xl h-12 font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin"/> : "Empezar diseño"}
                </Button>
              </div>
            </DialogFooter>
          </div>

          {/* ── SECCIÓN PREVIEW ── */}
          <div
            className="flex-1 bg-secondary/5 relative hidden sm:flex flex-col items-center justify-center p-12 overflow-hidden">
            {/* Patrón de fondo usando el color primario con muy baja opacidad */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                 style={{
                   backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
                   backgroundSize: '32px 32px'
                 }}/>
            {/* Contenedor del CV con perspectiva */}
            <div className="relative w-full max-w-[420px] transition-all duration-500">
              <div className={cn(
                "relative transition-all duration-700 ease-in-out shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden bg-background border border-secondary/10",
                isPending ? "scale-95 opacity-50 blur-sm" : "scale-100 opacity-100"
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
                  <div className="aspect-[1/1.41] w-full p-10 flex flex-col bg-background">
                    <div className="h-4 w-1/2 bg-secondary/10 rounded-full mb-8"/>
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-secondary/5 rounded-full"/>
                      <div className="h-2 w-full bg-secondary/5 rounded-full"/>
                      <div className="h-2 w-3/4 bg-secondary/5 rounded-full"/>
                    </div>
                    <div className="mt-12 space-y-4 flex-1">
                      <div className="h-3 w-1/4 bg-secondary/10 rounded-full"/>
                      <div className="h-2 w-full bg-secondary/5 rounded-full"/>
                      <div className="h-2 w-full bg-secondary/5 rounded-full"/>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10">
                      <LayoutTemplate className="h-12 w-12 text-primary/20 mb-4"/>
                      <p
                        className="text-xs text-secondary-foreground/30 font-bold uppercase tracking-widest text-center">
                        Template en camino
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Etiqueta del Template */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-30 min-w-max border border-primary-foreground/10">
                <span className="text-xs font-black tracking-tight">{currentTemplate.label}</span>
              </div>
            </div>

            {/* Indicadores de Paginación */}
            <div className="absolute bottom-10 flex gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData(prev => ({...prev, templateId: t.id}))}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    t.id === formData.templateId
                      ? "w-10 bg-primary"
                      : "w-2 bg-secondary/20 hover:bg-primary/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
