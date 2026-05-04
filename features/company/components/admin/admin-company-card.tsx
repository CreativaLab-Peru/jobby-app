"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, MoreVertical, Trash2, Users, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { AdminCompanyItem } from "@/features/company/actions/admin/get-admin-companies";
import { deleteAdminCompany } from "@/features/company/actions/admin/delete-admin-company";

interface AdminCompanyCardProps {
  company: AdminCompanyItem;
}

export function AdminCompanyCard({ company }: AdminCompanyCardProps) {
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
      <EntityListItem
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary text-sm font-bold">
            {company.name.charAt(0).toUpperCase()}
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant={company.isActive ? "default" : "outline"}>
              {company.isActive ? "Activa" : "Inactiva"}
            </StatusBadge>
            <span className="text-xs text-muted-foreground">{company.onboardingStep}</span>
          </div>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">
          {company.name}
        </span>}
        metadata={
          <>
            <div className="flex items-center gap-1.5"><Link className="h-3.5 w-3.5" /><span>/empresas/{company.slug}</span></div>
            <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>{company._count.members} miembros</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>Creada: {formatDate(company.createdAt, "d MMM, yyyy")}</span></div>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(`/admin/companies/${company.id}`)} className="cursor-pointer font-medium"><Eye className="mr-2 h-4 w-4" /> Ver detalle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/companies/${company.id}/edit`)} className="cursor-pointer font-medium"><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/admin/companies/${company.id}/invitations`)} className="cursor-pointer font-medium"><Users className="mr-2 h-4 w-4" /> Gestionar invitaciones</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={<Button variant="accent" onClick={() => router.push(`/admin/companies/${company.id}`)} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">Ver Empresa</Button>}
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar empresa" description={<>Se eliminara permanentemente la empresa <strong>{company.name}</strong> y todos sus datos asociados. Esta accion no se puede deshacer.</>} />
    </>
  );
}

