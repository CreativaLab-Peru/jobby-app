"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Bell, User, Sun, Moon, Settings } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    notifications: true,
    darkMode: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (name: string) => {
    setForm({ ...form, [name]: !form[name as keyof typeof form] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      // Aquí podrías usar un toast personalizado de tu sistema
      console.log("Configuraciones guardadas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-card border-border bg-card/50 backdrop-blur-md overflow-hidden">
            {/* Header con un toque de marca */}
            <CardHeader className="border-b border-border bg-muted/20 pb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-primary/10 mb-2">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Configuración
                  Información Personal

                </CardTitle>
                <p className="text-muted-foreground text-sm"> Gestiona tu perfil y preferencias de cuenta </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-10 p-8">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Perfil */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                      Información Personal
                    </h2>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold text-muted-foreground">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-background border-border focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold text-muted-foreground">
                        Correo electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="johndoe@example.com"
                        className="bg-background border-border focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </section>

                {/* Seguridad */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                      Seguridad
                    </h2>
                  </div>
                  <Separator />
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="password" className="font-semibold text-muted-foreground">
                      Cambiar contraseña
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-background border-border focus-visible:ring-primary max-w-md"
                    />
                  </div>
                </section>

                {/* Preferencias */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                      Preferencias
                    </h2>
                  </div>
                  <Separator />
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-foreground">Notificaciones</span>
                        <p className="text-xs text-muted-foreground text-left">Recibe alertas sobre el estado de tus análisis</p>
                      </div>
                      <Switch
                        checked={form.notifications}
                        onCheckedChange={() => handleSwitchChange("notifications")}
                        className="data-[state=checked]:bg-secondary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {form.darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-secondary" />}
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className="text-sm font-bold text-foreground">Modo visual</span>
                          <p className="text-xs text-muted-foreground">Alternar entre tema claro y oscuro</p>
                        </div>
                      </div>
                      <Switch
                        checked={form.darkMode}
                        onCheckedChange={() => handleSwitchChange("darkMode")}
                        className="data-[state=checked]:bg-secondary"
                      />
                    </div>
                  </div>
                </section>

                {/* Botón Guardar - REFACTOR: Usando ai-gradient */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 ai-gradient text-primary-foreground font-bold text-lg shadow-glow hover:opacity-90 transition-all rounded-xl"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
