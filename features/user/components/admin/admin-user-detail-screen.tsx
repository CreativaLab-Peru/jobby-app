"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  LogIn,
  Mail,
  MessageSquare,
  Shield,
  ShieldOff,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/avatar-user";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { AdminUserDetail } from "@/features/user/actions/admin/get-admin-user-by-id";
import { deleteAdminUser } from "@/features/user/actions/admin/delete-admin-user";
import { toggleBlockAdminUser } from "@/features/user/actions/admin/toggle-block-admin-user";

interface AdminUserDetailScreenProps {
  user: AdminUserDetail;
}

export function AdminUserDetailScreen({ user }: AdminUserDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminUser(user.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push("/admin/users");
    } else {
      toast.error("error" in result ? result.error : "Error eliminando usuario");
    }
    setIsDeleting(false);
  };

  const handleToggleBlock = async () => {
    setIsBlocking(true);
    const result = await toggleBlockAdminUser(user.id);
    if (result.success) {
      toast.success(result.message);
      setShowBlockDialog(false);
      router.refresh();
    } else {
      toast.error("error" in result ? result.error : "Error actualizando estado");
    }
    setIsBlocking(false);
  };

  const stats = [
    { label: "CVs creados", value: user._count.cvs, icon: FileText },
    { label: "Pagos", value: user._count.payments, icon: CreditCard },
    { label: "Sesiones", value: user._count.sessions, icon: LogIn },
    { label: "Reclamos", value: user._count.complaints, icon: MessageSquare },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a usuarios
          </Button>

          {/* Header */}
          <PageHeader
            title={user.name}
            description={user.email}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBlockDialog(true)}
                  className="rounded-lg font-bold text-xs h-9"
                >
                  {user.isBlocked ? (
                    <><ShieldOff className="mr-2 h-4 w-4" /> Desbloquear</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Bloquear</>
                  )}
                </Button>
                <Button
                  variant="accent"
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                  className="rounded-lg font-bold text-xs h-9 shadow-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="rounded-lg font-bold text-xs h-9"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            }
          />

          {/* User info card */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <div className="flex items-start gap-6">
              <UserAvatar
                image={user.image}
                name={user.name}
                className="h-20 w-20"
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge variant={user.role === "ADMIN" ? "primary" : "outline"}>
                    {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                  </StatusBadge>
                  {user.isBlocked && (
                    <StatusBadge variant="default" className="bg-destructive/10 text-destructive border-destructive/20">
                      Bloqueado
                    </StatusBadge>
                  )}
                  {user.emailVerified ? (
                    <StatusBadge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Email verificado
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Email no verificado
                    </StatusBadge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Registro: <span className="font-medium text-foreground">{formatDate(user.createdAt, "d MMM, yyyy HH:mm")}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span>Ultimo acceso: <span className="font-medium text-foreground">{user.lastLoginAt ? formatDate(user.lastLoginAt, "d MMM, yyyy HH:mm") : "Nunca"}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-xl border border-border/60 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{user.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Contrasena actualizada:</span>
                <span className="ml-2 font-medium text-foreground">{user.updatedPassword ? "Si" : "No"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Terminos aceptados:</span>
                <span className="ml-2 font-medium text-foreground">{user.acceptedTermsAndConditions ? "Si" : "No"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Politica de privacidad:</span>
                <span className="ml-2 font-medium text-foreground">{user.acceptedPrivacyPolicy ? "Si" : "No"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Ultima actualizacion:</span>
                <span className="ml-2 font-medium text-foreground">{formatDate(user.updatedAt, "d MMM, yyyy HH:mm")}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha de nacimiento:</span>
                <span className="ml-2 font-medium text-foreground">{user.birthday ? formatDate(user.birthday, "d MMM, yyyy") : "No registrada"}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar usuario"
        description={<>Se eliminara permanentemente al usuario <strong>{user.name}</strong> y todos sus datos asociados. Esta accion no se puede deshacer.</>}
      />

      <ConfirmModal
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={handleToggleBlock}
        loading={isBlocking}
        variant={user.isBlocked ? "default" : "destructive"}
        title={user.isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
        description={user.isBlocked ? <>El usuario podra acceder nuevamente a la plataforma.</> : <>El usuario no podra acceder a la plataforma mientras este bloqueado.</>}
      />
    </main>
  );
}

