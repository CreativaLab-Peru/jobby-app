import { redirect } from "next/navigation";
import Link from "next/link";
import { getScholarshipById } from "@/features/scholarships/actions/admin/get-scholarship-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, ExternalLink, Calendar, CheckCircle, XCircle } from "lucide-react";
import { ScholarshipType } from "@prisma/client";

const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
  MASTER: "Maestría",
  PHD: "Doctorado",
  FELLOWSHIP: "Beca",
};

export default async function AdminScholarshipDetailPage({
  params,
}: {
  params: Promise<{ scholarshipId: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const { scholarshipId } = await params;
  const result = await getScholarshipById(scholarshipId);

  if (!result.success || !result.data) {
    redirect("/admin/scholarships");
  }

  const scholarship = result.data;

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/scholarships">
            <ArrowLeft className="h-4 w-4" />
            Volver a becas
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{scholarship.country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold">{scholarship.name}</h1>
              <p className="text-muted-foreground">
                {scholarship.country.name} • {SCHOLARSHIP_TYPE_LABELS[scholarship.type as ScholarshipType]}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Ver sitio
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/admin/scholarships/${scholarship.id}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Estado
          </h3>
          <div className="flex items-center gap-4">
            {scholarship.isActive ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Activa</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Inactiva</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Información
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="font-mono text-sm">{scholarship.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tipo</dt>
              <dd>{SCHOLARSHIP_TYPE_LABELS[scholarship.type as ScholarshipType]}</dd>
            </div>
            {scholarship.deadline && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Fecha límite</dt>
                <dd>{new Date(scholarship.deadline).toLocaleDateString("es-ES")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Creado</dt>
              <dd>{new Date(scholarship.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Actualizado</dt>
              <dd>{new Date(scholarship.updatedAt).toLocaleDateString("es-ES")}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Requisitos ({scholarship.requirements.length})
          </h3>
          {scholarship.requirements.length === 0 ? (
            <p className="text-muted-foreground">No hay requisitos</p>
          ) : (
            <ul className="space-y-2">
              {scholarship.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Beneficios ({scholarship.benefits.length})
          </h3>
          {scholarship.benefits.length === 0 ? (
            <p className="text-muted-foreground">No hay beneficios</p>
          ) : (
            <ul className="space-y-2">
              {scholarship.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}