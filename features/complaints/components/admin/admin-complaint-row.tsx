"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, Mail, MessageSquareWarning, MoreVertical, Phone, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { AdminComplaintItem } from "@/features/complaints/actions/admin/get-admin-complaints";
import { deleteAdminComplaint } from "@/features/complaints/actions/admin/delete-admin-complaint";
import { routes } from "@/lib/routes";

interface AdminComplaintRowProps {
  complaint: AdminComplaintItem;
}

export function AdminComplaintRow({ complaint }: AdminComplaintRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const preview = complaint.complaint.length > 120
    ? complaint.complaint.slice(0, 120) + "..."
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
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <MessageSquareWarning className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{complaint.name}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{preview}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Mail className="h-3 w-3" /><span>{complaint.email}</span></div>
              {complaint.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /><span>{complaint.phone}</span></div>}
              <div className="flex items-center gap-1"><UserIcon className="h-3 w-3" /><span>{complaint.user.name}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(complaint.createdAt, "d MMM, yyyy HH:mm")}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.complaints.detail(complaint.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.complaints.detail(complaint.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar reclamo" description={<>Se eliminara permanentemente el reclamo de <strong>{complaint.name}</strong>. Esta accion no se puede deshacer.</>} />
    </>
  );
}

