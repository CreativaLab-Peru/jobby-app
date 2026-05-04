"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminCompanyDetail } from "@/features/company/actions/admin/get-admin-company-by-id";
import { deleteAdminCompany } from "@/features/company/actions/admin/delete-admin-company";
import { formatDate } from "@/utils/format-date";

interface AdminCompanyDetailScreenProps {
  company: AdminCompanyDetail;
}

export function AdminCompanyDetailScreen({ company }: AdminCompanyDetailScreenProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminCompany(company.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push("/admin/companies");
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando empresa";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                <p className="text-sm text-muted-foreground">/empresas/{company.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                asChild
              >
                <a href={`/admin/companies/${company.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </a>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>

          {/* Status Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado</span>
                <Badge variant={company.isActive ? "default" : "destructive"}>
                  {company.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Paso de Onboarding</span>
                <Badge variant="outline">{company.onboardingStep}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nombre</p>
                  <p className="mt-1 text-sm font-medium">{company.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug</p>
                  <p className="mt-1 text-sm font-medium">{company.slug}</p>
                </div>
                {company.ruc && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RUC</p>
                    <p className="mt-1 text-sm font-medium">{company.ruc}</p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sitio Web</p>
                    <p className="mt-1 text-sm font-medium">
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {company.website}
                      </a>
                    </p>
                  </div>
                )}
                {company.primaryColor && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color Principal</p>
                    <p className="mt-1 text-sm font-medium flex items-center gap-2">
                      {company.primaryColor}
                    </p>
                    <div className="h-5 w-5 rounded-md border border-border" style={{ backgroundColor: company.primaryColor }} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Miembros</p>
                      <p className="text-2xl font-bold">{company._count.members}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/5 p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Invitaciones Pendientes</p>
                    <p className="text-2xl font-bold">{company._count.invitations}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Creada</span>
                <span className="font-medium">{formatDate(company.createdAt, "d MMM, yyyy HH:mm")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Última actualización</span>
                <span className="font-medium">{formatDate(company.updatedAt, "d MMM, yyyy HH:mm")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <a href={`/admin/companies/${company.id}/invitations`}>
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Invitaciones y Acceso
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href={`/admin/companies/${company.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Información
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        variant="destructive"
        title="Eliminar empresa"
        description={
          <>
            Se eliminará permanentemente la empresa <strong>{company.name}</strong> y todos sus datos asociados. Esta acción no se puede deshacer.
          </>
        }
      />
    </>
  );
}

