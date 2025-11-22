"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Bell, User, Sun, Moon } from "lucide-react";

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
      alert("Configuraciones guardadas correctamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-2xl border border-orange-100 bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 text-center">
                Configuración de Cuenta
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-10 p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Perfil */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Información Personal
                    </h2>
                  </div>
                  <Separator className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="border-gray-300 focus-visible:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Correo electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="johndoe@example.com"
                        className="border-gray-300 focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>
                </section>

                {/* Seguridad */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Seguridad
                    </h2>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Cambiar contraseña
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="border-gray-300 focus-visible:ring-orange-500"
                    />
                  </div>
                </section>

                {/* Preferencias */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Preferencias
                    </h2>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Notificaciones por correo</span>
                      <Switch
                        disabled
                        checked={form.notifications}
                        onCheckedChange={() => handleSwitchChange("notifications")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 flex items-center gap-2">
                        {form.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        Modo oscuro
                      </span>
                      <Switch
                        disabled
                        checked={form.darkMode}
                        onCheckedChange={() => handleSwitchChange("darkMode")}
                      />
                    </div>
                  </div>
                </section>

                {/* Cuentas Vinculadas */}
                {/* <section>
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Cuentas vinculadas
                    </h2>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    >
                      Conectar con Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    >
                      Conectar con GitHub
                    </Button>
                  </div>
                </section> */}

                {/* Botón Guardar */}
                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg"
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
