"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, MessageSquareWarning, MoreVertical, Phone, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { formatDate } from "@/utils/format-date";
import { AdminComplaintItem } from "@/features/complaints/actions/admin/get-admin-complaints";
import { deleteAdminComplaint } from "@/features/complaints/actions/admin/delete-admin-complaint";
import { routes } from "@/lib/routes";

interface AdminComplaintCardProps {
  complaint: AdminComplaintItem;
}

export function AdminComplaintCard({ complaint }: AdminComplaintCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const preview = complaint.complaint.length > 100
    ? complaint.complaint.slice(0, 100) + "..."
    : complaint.complaint;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminComplaint(complaint.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando reclamo";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <EntityListItem
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <MessageSquareWarning className="h-5 w-5" />
          </div>
        }
        subtitle={
          <p className="text-xs text-muted-foreground line-clamp-2">{preview}</p>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">{complaint.name}</span>}
        metadata={
          <>
            <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /><span>{complaint.email}</span></div>
            {complaint.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /><span>{complaint.phone}</span></div>}
            <div className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /><span>{complaint.user.name}</span></div>
            <span>{formatDate(complaint.createdAt, "d MMM, yyyy")}</span>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.complaints.detail(complaint.id))} className="cursor-pointer font-medium">
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.complaints.detail(complaint.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">
            Ver Reclamo
          </Button>
        }
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar reclamo" description={<>Se eliminara permanentemente el reclamo de <strong>{complaint.name}</strong>.</>} />
    </>
  );
}

