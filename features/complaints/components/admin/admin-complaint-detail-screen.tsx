"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Mail, MessageSquareWarning, Phone, Shield, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminComplaintDetail } from "@/features/complaints/actions/admin/get-admin-complaint-by-id";
import { deleteAdminComplaint } from "@/features/complaints/actions/admin/delete-admin-complaint";
import { routes } from "@/lib/routes";

interface AdminComplaintDetailScreenProps {
  complaint: AdminComplaintDetail;
}

export function AdminComplaintDetailScreen({ complaint }: AdminComplaintDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminComplaint(complaint.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push(routes.app.admin.complaints.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando reclamo";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.complaints.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Reclamos
          </Button>

          <PageHeader
            title={`Reclamo de ${complaint.name}`}
            description={`Enviado el ${formatDate(complaint.createdAt, "d MMMM, yyyy 'a las' HH:mm")}`}
            actions={
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="rounded-lg font-bold text-xs h-9">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            }
          />

          {/* Contact info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Datos de contacto del reclamo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>Nombre: <span className="font-medium text-foreground">{complaint.name}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>Email: <span className="font-medium text-foreground">{complaint.email}</span></span>
              </div>
              {complaint.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>Telefono: <span className="font-medium text-foreground">{complaint.phone}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Fecha: <span className="font-medium text-foreground">{formatDate(complaint.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
            </div>
          </Card>

          {/* Complaint text */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareWarning className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-bold tracking-tight">Contenido del reclamo</h3>
            </div>
            <div className="rounded-lg border border-border/40 bg-secondary/10 p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{complaint.complaint}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{complaint.complaint.length} caracteres</p>
          </Card>

          {/* User who submitted */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Usuario registrado</h3>
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold",
                complaint.user.isBlocked ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary"
              )}>
                {complaint.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{complaint.user.name}</span>
                  <StatusBadge variant="outline" className="text-[10px]">{complaint.user.role}</StatusBadge>
                  {complaint.user.isBlocked && (
                    <StatusBadge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20">Bloqueado</StatusBadge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>{complaint.user.email}</span>
                  <span>·</span>
                  <span>Registrado el {formatDate(complaint.user.createdAt, "d MMM, yyyy")}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => router.push(`/admin/users/${complaint.user.id}`)}>
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Ver usuario
              </Button>
            </div>
          </Card>

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID Reclamo:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{complaint.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID Usuario:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{complaint.userId}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar reclamo" description={<>Se eliminara permanentemente el reclamo de <strong>{complaint.name}</strong>. Esta accion no se puede deshacer.</>} />
    </main>
  );
}

