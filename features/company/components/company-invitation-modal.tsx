"use client"

import { useState, useTransition } from "react"
import { Mail, UserPlus } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useInvitationModal } from "@/features/company/hooks/use-invitation-modal"
import { createCompanyInvitationAction } from "@/features/company/actions/admin/generate-admin-invitation"
import {routes} from "@/lib/routes";

interface CompanyInvitationModalProps {
  companyId: string
}

export function CompanyInvitationModal({companyId}: CompanyInvitationModalProps) {
  const { isOpen, onClose } = useInvitationModal()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")

  const handleSend = () => {
    if (!email || !companyId) return

    startTransition(async () => {
      const result = await createCompanyInvitationAction({ companyId, email })
      console.log("[result]:", result)
      if (result.success && result.invitation) {
        // 1. Construir la URL (ajusta la ruta según tus 'routes')
        // Usamos window.location.origin para obtener el dominio actual dinámicamente
        const joinUrl = routes.website.joinInvitation(result.invitation.token);

        try {
          // 2. Copiar al portapapeles
          await navigator.clipboard.writeText(joinUrl)

          toast.success("¡Enlace copiado al portapapeles!")
          setEmail("")
          onClose()
        } catch (err) {
          toast.error("Error al copiar al portapapeles")
        }
      } else {
        // Manejo de errores basado en tu estructura de respuesta
        const errorMsg = result?.fieldErrors?.email || "Error al generar enlace"
        toast.error(errorMsg)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-8 rounded-[2rem]">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <UserPlus className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tight">
              Invitar Administrador
            </DialogTitle>
            <p className="text-sm font-medium text-muted-foreground">
              Ingresa el correo para enviar el acceso.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="nombre@correo.com"
              className="pl-11 h-14 rounded-2xl bg-muted/50 border-none font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <Button
            onClick={handleSend}
            className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20"
            disabled={isPending || !email}
          >
            {isPending ? "Copiando..." : "Copiar enlace"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
