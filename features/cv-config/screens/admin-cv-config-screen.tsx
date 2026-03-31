"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Save, Settings2, GripVertical,
  Type, List as ListIcon, Info
} from "lucide-react";
import { toast } from "sonner";
import { CvSectionConfiguration } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateCvSectionConfig } from "@/features/cv-config/actions/admin/cv-config-actions";
import { CvSectionConfigItem } from "@/features/cv-config/types/admin-config.schema";
import { OPPORTUNITY_MAP } from "@/const";
import { CV_TYPE_CONFIG } from "@/features/cv/consts";

interface AdminCvConfigScreenProps {
  initialConfigs: CvSectionConfiguration[];
}

export function AdminCvConfigScreen({ initialConfigs }: AdminCvConfigScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [activeConfigId, setActiveConfigId] = useState<string>(initialConfigs[0]?.id || "");
  const [configs, setConfigs] = useState(initialConfigs);
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');

  // Mantener la selección de config y refrescar la vista correctamente
  const currentConfig = configs.find(c => c.id === activeConfigId);
  const sections = (currentConfig?.sections as unknown as CvSectionConfigItem[]) || [];

  const updateLocalSections = (newSections: CvSectionConfigItem[]) => {
    setConfigs(prev => prev.map(c =>
      c.id === activeConfigId ? { ...c, sections: newSections as any } : c
    ));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateCvSectionConfig({
        id: activeConfigId,
        sections: sections,
      });
      if (result.success) toast.success("Configuración actualizada");
      else toast.error(result.error);
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

          {/* Header con colores Primary */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <PageHeader
              title="Constructor de CV"
              description="Gestiona la estructura lógica por tipo de carrera y oportunidad."
            />
            <Button
              onClick={handleSave}
              disabled={isPending}
              variant="default" // Usará el color primary de tu tema
              className="gap-2 shadow-sm font-bold"
            >
              {isPending ? <Settings2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar Cambios
            </Button>
          </div>

          {/* Switch de idioma */}
          <div className="flex items-center gap-4 mb-4">
            <Label className="text-xs font-bold">Idioma:</Label>
            <Button
              variant={activeLang === 'es' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveLang('es')}
              className={activeLang === 'es' ? 'font-bold' : ''}
            >ES</Button>
            <Button
              variant={activeLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveLang('en')}
              className={activeLang === 'en' ? 'font-bold' : ''}
            >EN</Button>
          </div>

          <Tabs value={activeConfigId} onValueChange={setActiveConfigId} className="w-full">
            <div className="relative">
              <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <TabsList className="inline-flex w-max min-w-full border border-border h-14 p-1 bg-muted/30">
                  {configs.map((config) => (
                    <TabsTrigger
                      key={config.id}
                      value={config.id}
                      className="px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-xs font-bold">
                          {CV_TYPE_CONFIG[config.cvType]?.label || config.cvType}
                        </span>
                        <span className="text-[10px] uppercase tracking-tighter opacity-60">
                          {OPPORTUNITY_MAP[config.opportunityType] || config.opportunityType}
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <div className="mt-8">
              <Accordion type="multiple" className="space-y-4">
                {sections.map((section, sIdx) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border border-border rounded-xl px-4 bg-card shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5 group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2.5 bg-primary/5 rounded-lg group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                          <ListIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{section.title?.[activeLang] ?? ''}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">Key: {section.id}</p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-8 space-y-8">
                      {/* Sub-header de Sección */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg border border-border/50">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Título de Sección ({activeLang.toUpperCase()})</Label>
                          <Input
                            className="bg-background"
                            value={section.title?.[activeLang] ?? ''}
                            onChange={(e) => {
                              const ns = [...sections];
                              ns[sIdx].title = {
                                ...ns[sIdx].title,
                                [activeLang]: e.target.value
                              };
                              updateLocalSections(ns);
                            }}
                          />
                        </div>
                      </div>

                      {/* Listado de Campos */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                            <Type className="h-4 w-4" /> Estructura de Datos
                          </h4>
                        </div>

                        <div className="space-y-4">
                          {section.fields.map((field, fIdx) => (
                            <div key={fIdx} className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group relative">

                              <div className="flex items-center gap-4">
                                <GripVertical className="h-5 w-5 text-muted-foreground/30 cursor-grab hover:text-primary transition-colors" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                  <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground/70">Nombre del Campo ({activeLang.toUpperCase()})</Label>
                                    <Input className="h-9 text-xs font-medium" value={field.label?.[activeLang] ?? ''} onChange={(e) => {
                                      const ns = [...sections];
                                      const f = {
                                        ...ns[sIdx].fields[fIdx],
                                        label: {
                                          ...ns[sIdx].fields[fIdx].label,
                                          [activeLang]: e.target.value
                                        }
                                      };
                                      ns[sIdx].fields[fIdx] = f;
                                      updateLocalSections(ns);
                                    }} />
                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground/70">Tipo</Label>
                                    <Select value={field.type} onValueChange={(v: any) => {
                                      const ns = [...sections];
                                      ns[sIdx].fields[fIdx].type = v;
                                      updateLocalSections(ns);
                                    }}>
                                      <SelectTrigger className="h-9 text-xs capitalize"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        {["text", "textarea", "email", "tags", "date", "number"].map(t => (
                                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center gap-6 pt-6 justify-end">
                                    <div className="flex items-center gap-3 bg-secondary/20 px-3 py-1.5 rounded-full border border-secondary/30">
                                      <span className="text-[10px] font-bold text-secondary-foreground">OBLIGATORIO</span>
                                      <Switch
                                        checked={field.required}
                                        onCheckedChange={(v) => {
                                          const ns = [...sections];
                                          ns[sIdx].fields[fIdx].required = v;
                                          updateLocalSections(ns);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Sección de Ayuda (Tip y Placeholder) */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9 border-t border-dashed border-border pt-4">
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5" /> Sugerencia (Tip) ({activeLang.toUpperCase()})
                                  </Label>
                                  <Input
                                    placeholder="Instrucción para el usuario..."
                                    className="h-9 text-xs bg-muted/20 border-transparent focus:bg-background transition-all"
                                    value={field.tip?.[activeLang] ?? ''}
                                    onChange={(e) => {
                                      const ns = [...sections];
                                      const f = {
                                        ...ns[sIdx].fields[fIdx],
                                        tip: {
                                          ...ns[sIdx].fields[fIdx].tip,
                                          [activeLang]: e.target.value
                                        }
                                      };
                                      ns[sIdx].fields[fIdx] = f;
                                      updateLocalSections(ns);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Ejemplo de llenado ({activeLang.toUpperCase()})</Label>
                                  <Input
                                    placeholder="Ej: Google, Microsoft..."
                                    className="h-9 text-xs"
                                    value={field.example?.[activeLang] ?? ''}
                                    onChange={(e) => {
                                      const ns = [...sections];
                                      const f = {
                                        ...ns[sIdx].fields[fIdx],
                                        example: {
                                          ...ns[sIdx].fields[fIdx].example,
                                          [activeLang]: e.target.value
                                        }
                                      };
                                      ns[sIdx].fields[fIdx] = f;
                                      updateLocalSections(ns);
                                    }}
                                  />
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
