"use client";

import {useState, useTransition} from "react";
import {motion, Reorder} from "framer-motion";
import {
  Save, Settings2, Plus, Trash2, GripVertical,
  Type, List as ListIcon, CheckCircle2, ChevronRight
} from "lucide-react";
import {toast} from "sonner";
import {CvSectionConfiguration} from "@prisma/client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {PageHeader} from "@/components/shared/page-header";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {updateCvSectionConfig} from "@/features/cv-config/actions/admin/cv-config-actions";
import {CvSectionConfigItem} from "@/features/cv-config/types/admin-config.schema";
import {OPPORTUNITY_MAP} from "@/const";
import {CV_TYPE_CONFIG} from "@/features/cv/consts";

interface AdminCvConfigScreenProps {
  initialConfigs: CvSectionConfiguration[];
}

export function AdminCvConfigScreen({initialConfigs}: AdminCvConfigScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [activeConfigId, setActiveConfigId] = useState<string>(initialConfigs[0]?.id || "");

  // Estado local para la edición visual
  const [configs, setConfigs] = useState(initialConfigs);

  const currentConfig = configs.find(c => c.id === activeConfigId);
  const sections = (currentConfig?.sections as unknown as CvSectionConfigItem[]) || [];

  const updateLocalSections = (newSections: CvSectionConfigItem[]) => {
    setConfigs(prev => prev.map(c =>
      c.id === activeConfigId ? {...c, sections: newSections as any} : c
    ));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateCvSectionConfig({
        id: activeConfigId,
        sections: sections,
      });

      if (result.success) {
        toast.success("Cambios guardados exitosamente");
      } else {
        toast.error(result.error);
      }
    });
  };

  // Funciones de ayuda para edición amigable
  const addField = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].fields.push({
      name: "new_field",
      type: "text",
      label: "Nuevo Campo",
      required: false
    });
    updateLocalSections(newSections);
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].fields.splice(fieldIndex, 1);
    updateLocalSections(newSections);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <PageHeader
              title="Constructor de CV"
              description="Configura las secciones y preguntas que verá el usuario."
            />
            <Button onClick={handleSave} disabled={isPending} className="gap-2 shadow-md">
              {isPending ? <Settings2 className="h-4 w-4 animate-spin"/> :
                <Save className="h-4 w-4"/>}
              Guardar Configuración
            </Button>
          </div>

          <Tabs value={activeConfigId} onValueChange={setActiveConfigId}>
            <div className="relative mb-6">
              <div className="overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <TabsList
                  className="inline-flex w-max min-w-full border shadow-sm h-12 p-1">
                  {configs.map((config) => (
                    <TabsTrigger
                      key={config.id}
                      value={config.id}
                      className="px-6 whitespace-nowrap data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                    >
                      <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold">
                {CV_TYPE_CONFIG[config.cvType].label || config.cvType}
              </span>
                        <span className="text-[10px] opacity-70 font-medium">
                {OPPORTUNITY_MAP[config.opportunityType] || config.opportunityType}
              </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Gradiente sutil para indicar que hay más contenido (Opcional) */}
              <div
                className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden"/>
            </div>

            <div className="mt-6">
              <Accordion type="multiple" className="space-y-4">
                {sections.map((section, sIdx) => (
                  <AccordionItem key={section.id} value={section.id}
                                 className="border rounded-xl shadow-sm px-4 overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <ListIcon className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                          <p className="font-bold">{section.title}</p>
                          <p className="text-xs">ID Técnico: {section.id}</p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4 border-b pb-6">
                        <div className="space-y-2">
                          <Label>Título Visible</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const ns = [...sections];
                              ns[sIdx].title = e.target.value;
                              updateLocalSections(ns);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icono (Lucide)</Label>
                          <Input
                            value={section.icon}
                            onChange={(e) => {
                              const ns = [...sections];
                              ns[sIdx].icon = e.target.value;
                              updateLocalSections(ns);
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Type className="h-4 w-4"/> Campos de la Sección
                          </h4>
                          <Button variant="outline" size="sm" onClick={() => addField(sIdx)}
                                  className="h-8 gap-1">
                            <Plus className="h-3.5 w-3.5"/> Agregar Campo
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {section.fields.map((field, fIdx) => (
                            <div key={fIdx}
                                 className="flex items-start gap-3 p-3 rounded-lg border bg-primary/10 group">
                              <GripVertical className="h-5 w-5 text-slate-300 mt-2 cursor-grab"/>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1">
                                <div className="space-y-1">
                                  <Label className="text-[10px] uppercase">Etiqueta</Label>
                                  <Input
                                    className="h-8 text-xs"
                                    value={field.label}
                                    onChange={(e) => {
                                      const ns = [...sections];
                                      ns[sIdx].fields[fIdx].label = e.target.value;
                                      updateLocalSections(ns);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] uppercase">Tipo de Dato</Label>
                                  <Select
                                    value={field.type}
                                    onValueChange={(v: any) => {
                                      const ns = [...sections];
                                      ns[sIdx].fields[fIdx].type = v;
                                      updateLocalSections(ns);
                                    }}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["text", "textarea", "email", "tags", "date"].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] uppercase">Ejemplo
                                    (Placeholder)</Label>
                                  <Input
                                    className="h-8 text-xs"
                                    value={field.example || ""}
                                    onChange={(e) => {
                                      const ns = [...sections];
                                      ns[sIdx].fields[fIdx].example = e.target.value;
                                      updateLocalSections(ns);
                                    }}
                                  />
                                </div>
                                <div className="flex items-center gap-4 pt-6">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={field.required}
                                      onCheckedChange={(v) => {
                                        const ns = [...sections];
                                        ns[sIdx].fields[fIdx].required = v;
                                        updateLocalSections(ns);
                                      }}
                                    />
                                    <span className="text-[10px] font-bold">REQ.</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeField(sIdx, fIdx)}
                                  >
                                    <Trash2 className="h-4 w-4"/>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
