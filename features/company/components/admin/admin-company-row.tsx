"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Edit,
  Eye,
  Link,
  MoreVertical,
  Trash2,
  User2,
  Users
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { AdminCompanyItem } from "@/features/company/actions/admin/get-admin-companies";
import { deleteAdminCompany } from "@/features/company/actions/admin/delete-admin-company";

interface AdminCompanyRowProps {
  company: AdminCompanyItem;
}

export function AdminCompanyRow({ company }: AdminCompanyRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminCompany(company.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando empresa";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          {/* Icono de Empresa */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold uppercase">
            {company.name.charAt(0)}
          </div>

          {/* Información Principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">
                {company.name}
              </span>
              <StatusBadge variant={company.isActive ? "default" : "outline"}>
                {company.isActive ? "Activa" : "Inactiva"}
              </StatusBadge>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                {company.onboardingStep}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                <span className="truncate max-w-[150px]">/{company.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{company._count.members} miembros</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(company.createdAt, "d MMM, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => router.push(`/admin/companies/${company.id}`)}
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => router.push(`/admin/companies/${company.id}/edit`)}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/companies/${company.id}/invitations`)}
                  className="cursor-pointer font-medium"
                >
                  <Users className="mr-2 h-4 w-4" /> Gestionar invitaciones
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-destructive focus:text-destructive font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar empresa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
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
