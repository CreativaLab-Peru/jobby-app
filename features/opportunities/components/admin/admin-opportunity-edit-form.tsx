"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { OpportunityType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { AdminOpportunityDetail } from "@/features/opportunities/actions/admin/get-admin-opportunity-by-id";
import { updateAdminOpportunity } from "@/features/opportunities/actions/admin/update-admin-opportunity";
import { routes } from "@/lib/routes";
import {RichTextEditor} from "@/components/rich-text/rich-text-editor";

const TYPE_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: "INTERNSHIP", label: "Pasantia" },
  { value: "SCHOLARSHIP", label: "Beca" },
  { value: "EXCHANGE_PROGRAM", label: "Intercambio" },
  { value: "EMPLOYMENT", label: "Empleo" },
  { value: "STARTUP", label: "Startup" },
];

interface AdminOpportunityEditFormProps {
  opportunity: AdminOpportunityDetail;
}

export function AdminOpportunityEditForm({ opportunity }: AdminOpportunityEditFormProps) {
  const [title, setTitle] = useState(opportunity.title);
  const [description, setDescription] = useState(opportunity.description || "");
  const [company, setCompany] = useState(opportunity.company || "");
  const [requirements, setRequirements] = useState(opportunity.requirements);
  const [linkUrl, setLinkUrl] = useState(opportunity.linkUrl);
  const [location, setLocation] = useState(opportunity.location || "");
  const [modality, setModality] = useState(opportunity.modality || "");
  const [salary, setSalary] = useState(opportunity.salary || "");
  const [benefits, setBenefits] = useState(opportunity.benefits || "");
  const [type, setType] = useState<OpportunityType>(opportunity.type);
  const [deadline, setDeadline] = useState(
    opportunity.deadline ? new Date(opportunity.deadline).toISOString().split("T")[0] : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = opportunity.cv?.user;
  const userLabel = user ? `${user.name} (${user.email})` : "Sin usuario";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
      toast.error("El titulo es requerido");
      setIsLoading(false);
      return;
    }

    const result = await updateAdminOpportunity(opportunity.id, opportunity.cvId, {
      title: title.trim(),
      description: description.trim() || null,
      company: company.trim() || null,
      requirements: requirements.trim(),
      linkUrl: linkUrl.trim(),
      location: location.trim() || null,
      modality: modality.trim() || null,
      salary: salary.trim() || null,
      benefits: benefits.trim() || null,
      type,
      deadline: deadline || null,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.opportunities.detail(opportunity.id, opportunity.cvId));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando oportunidad";
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.opportunities.detail(opportunity.id, opportunity.cvId))}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader
            title="Editar Oportunidad"
            description={`Editando "${opportunity.title}" · ${userLabel}`}
          />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Titulo *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-semibold">Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as OpportunityType)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-semibold">Empresa</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nombre de la empresa" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold">Ubicacion</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Bogota, Colombia" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality" className="text-sm font-semibold">Modalidad</Label>
                  <Input id="modality" value={modality} onChange={(e) => setModality(e.target.value)} placeholder="Ej: Remoto, Hibrido" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-semibold">Salario</Label>
                  <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Ej: $2,000 - $3,000 USD" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm font-semibold">Fecha de cierre</Label>
                  <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} disabled={isLoading} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="linkUrl" className="text-sm font-semibold">URL *</Label>
                  <Input id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." disabled={isLoading} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Descripcion</Label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe la oportunidad, responsabilidades, etc."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="requirements" className="text-sm font-semibold">Requisitos *</Label>
                  <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} disabled={isLoading} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="benefits" className="text-sm font-semibold">Beneficios</Label>
                  <Textarea id="benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={3} disabled={isLoading} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push(routes.app.admin.opportunities.detail(opportunity.id, opportunity.cvId))} disabled={isLoading} className="rounded-lg font-bold">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-lg font-bold shadow-sm">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

