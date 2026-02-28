"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Bell, User, Sun, Moon, Settings, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { User as UserType } from ".prisma/client";
import { updateUsernameAction } from "@/features/settings/actions/update-username";
import { changePasswordAction } from "@/features/settings/actions/change-password";
import { updateThemeAction } from "@/features/settings/actions/update-theme";
import { useSWRConfig } from "swr";
import { useTheme } from "next-themes";

interface SettingsScreenProps {
  user: UserType;
  isOAuth: boolean;
}

type FeedbackState = { type: "success" | "error"; message: string } | null;

export default function SettingsScreen({ user, isOAuth }: SettingsScreenProps) {
  const { mutate } = useSWRConfig();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = async (checked: boolean) => {
    const previousTheme = theme;
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme); // aplica al instante en el cliente
    try {
      const result = await updateThemeAction(newTheme); // persiste en BD
      if (!result || result.success !== true) {
        // Revertir el cambio en el cliente si la persistencia falla
        if (previousTheme) {
          setTheme(previousTheme);
        }
      }
    } catch (error) {
      // En caso de error de red/servidor, revertir el tema y registrar el error
      if (previousTheme) {
        setTheme(previousTheme);
      }
      console.error("Error al actualizar el tema:", error);
    }
  };

  // --- Nombre ---
  const [name, setName] = useState(user.name || "");
  const [nameFeedback, setNameFeedback] = useState<FeedbackState>(null);
  const [nameLoading, setNameLoading] = useState(false);

  // --- Contraseña ---
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>(null);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<Record<string, string>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // --- Contraseña ---

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameFeedback(null);
    const result = await updateUsernameAction({ name });
    if (result.success) {
      setNameFeedback({ type: "success", message: "Nombre actualizado correctamente." });
      mutate("session"); // actualiza el navbar en tiempo real
    } else {
      setNameFeedback({ type: "error", message: result.error ?? "Error desconocido." });
    }
    setNameLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordFeedback(null);
    setPasswordFieldErrors({});
    const result = await changePasswordAction(passwordForm);
    if (result.success) {
      setPasswordFeedback({ type: "success", message: "Contraseña actualizada correctamente." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      if (result.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [key, val] of Object.entries(result.fieldErrors as Record<string, string[]>)) {
          mapped[key] = val?.[0] ?? "";
        }
        setPasswordFieldErrors(mapped);
      }
      setPasswordFeedback({ type: "error", message: result.error ?? "Error desconocido." });
    }
    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-lg border-border bg-card/50 backdrop-blur-md overflow-hidden">
            {/* Header */}
            <CardHeader className="border-b border-border bg-muted/20 pb-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-primary/10 mb-2">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Configuración
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Gestiona tu perfil y preferencias de cuenta
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-10 p-8">

              {/* ── Sección: Información Personal ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                    Información Personal
                  </h2>
                </div>
                <Separator />

                <form onSubmit={handleSaveName} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-muted-foreground">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameFeedback(null);
                        }}
                        placeholder="Juan Pérez"
                        className="bg-background focus-visible:ring-primary"
                      />
                    </div>

                    {/* Email — siempre deshabilitado */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">
                        Correo electrónico
                        <span className="ml-2 text-xs text-muted-foreground/60 font-normal">(no se puede modificar)</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email || ""}
                        readOnly
                        disabled
                        className="bg-muted/40 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Feedback nombre */}
                  {nameFeedback && (
                    <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${nameFeedback.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                      {nameFeedback.type === "success"
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                        : <AlertCircle className="w-4 h-4 shrink-0" />}
                      {nameFeedback.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={nameLoading || name.trim() === (user.name || "")}
                    className="h-10 px-6 font-semibold rounded-xl"
                  >
                    {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar nombre"}
                  </Button>
                </form>
              </section>

              {/* ── Sección: Seguridad ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                    Seguridad
                  </h2>
                </div>
                <Separator />

                {isOAuth ? (
                  <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground mt-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    Tu cuenta está vinculada con Google. El inicio de sesión se gestiona a través de Google, por lo que no es posible cambiar la contraseña desde aquí.
                  </div>
                ) : (
                  <form onSubmit={handleSavePassword} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contraseña actual */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="currentPassword" className="text-sm font-semibold text-muted-foreground">
                          Contraseña actual
                        </Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="bg-background focus-visible:ring-primary max-w-md"
                        />
                        {passwordFieldErrors.currentPassword && (
                          <p className="text-xs text-destructive">{passwordFieldErrors.currentPassword}</p>
                        )}
                      </div>

                      {/* Nueva contraseña */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-semibold text-muted-foreground">
                          Nueva contraseña
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="bg-background focus-visible:ring-primary"
                        />
                        {passwordFieldErrors.newPassword && (
                          <p className="text-xs text-destructive">{passwordFieldErrors.newPassword}</p>
                        )}
                      </div>

                      {/* Confirmar nueva contraseña */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-muted-foreground">
                          Confirmar nueva contraseña
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="bg-background focus-visible:ring-primary"
                        />
                        {passwordFieldErrors.confirmPassword && (
                          <p className="text-xs text-destructive">{passwordFieldErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    {/* Feedback contraseña */}
                    {passwordFeedback && (
                      <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${passwordFeedback.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                        {passwordFeedback.type === "success"
                          ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                          : <AlertCircle className="w-4 h-4 shrink-0" />}
                        {passwordFeedback.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="h-10 px-6 font-semibold rounded-xl"
                    >
                      {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cambiar contraseña"}
                    </Button>
                  </form>
                )}
              </section>

              {/* ── Sección: Preferencias ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                    Preferencias
                  </h2>
                </div>
                <Separator />
                <div className="space-y-1 pt-2">

                  {/* Switch Dark Mode — funcional */}
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {theme === "dark" ? (
                          <Moon className="w-4 h-4 text-primary" />
                        ) : (
                          <Sun className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-foreground">Modo oscuro</span>
                        <p className="text-xs text-muted-foreground">Alterna entre tema claro y oscuro</p>
                      </div>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>

                  {/* Switch Notificaciones — próximamente */}
                  <div className="flex items-center justify-between p-4 rounded-xl opacity-60">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">Notificaciones por email</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full">Próximamente</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Recibe alertas sobre el estado de tus análisis</p>
                    </div>
                    <Switch disabled checked={false} />
                  </div>

                </div>
              </section>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
