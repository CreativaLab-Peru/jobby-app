"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import {updatePassword} from "@/features/authentication/actions/update-password";

interface ChangePasswordProps {
  user: {
    id: string
    email: string
    name?: string
    image?: string
  }
}

export default function ChangePassword({ user }: ChangePasswordProps) {
  const router = useRouter()
  const [email, setEmail] = useState(user.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleChangePassword = async () => {
    setError("")
    setSuccess("")
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    onSubmit()
  }

  const onSubmit = () => {
    if (isPending) return
    startTransition(() => {
      updatePassword(currentPassword, newPassword).then((result) => {
        if (result?.success) {
          setSuccess("Contraseña actualizada exitosamente ✅")
          setEmail("")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setLoading(false)
          router.push('/cv')
        }
        if (!result?.success) {
          setError(result.message || "Hubo un error al actualizar la contraseña.")
          setLoading(false)
        }
      })
    })
  }

  return (
    <div className="bg-gradient-primary p-6 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-card">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-accent mx-auto mb-3" />
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Actualiza tu contraseña para mantener tu cuenta segura 🔒
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <label className="text-sm font-medium text-foreground">Correo</label>
              <Input
                type="text"
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="user@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Contraseña Actual</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Nueva Contraseña</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Confirmar Nueva Contraseña</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-secondary text-sm">{success}</p>}

            <Button
              className="w-full mt-4 bg-gradient-primary hover:opacity-90 shadow-card hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-primary-foreground"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-accent hover:text-accent-foreground mt-2"
              onClick={() => router.push("/dashboard")}
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
