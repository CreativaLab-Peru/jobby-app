"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2 } from "lucide-react";
import { newUserConfiguration } from "@/lib/shared/new-user-configuration";

const errorMapper: Record<string, string> = {
    "Email already exists": "El correo electrónico ya está en uso",
    "Invalid email": "Correo electrónico inválido",
    "Password too short": "La contraseña debe tener al menos 6 caracteres",
    "Passwords do not match": "Las contraseñas no coinciden",
    "Too many requests": "Demasiadas solicitudes, intenta más tarde",
    "User already exists": "El usuario ya existe",
};

export function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            setError(null);
            const response = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
            })
            if (response.error) {
                const errorMessage = errorMapper[response.error.message] || response.error.message || "Error al iniciar sesión";
                setError(errorMessage);
                return;
            }

            const userId = response.data.user?.id;
            if (!userId) {
                setError("Error al crear la cuenta");
                return;
            }

            // Create a basic subscription for the new user
            // if (isPending) {
            //     return;
            // }

            if (isPending) {
                return;
            }

            startTransition(async () => {
                const response = await newUserConfiguration(userId);
                if (!response) {
                    console.error("Error in new user configuration for userId:", userId);
                }
            });

            setSuccess(true);
            router.push("/cv");
        } catch (error) {
            const errorMessage = errorMapper[error.message] || error.message || "Error al crear la cuenta";
            setError(errorMessage);
            return;
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Crea tu <span className="text-gradient">cuenta gratis</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Empieza a construir tu CV profesional en minutos
                        </p>
                    </div>

                    <Card className="p-8 bg-card shadow-glow">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nombre completo
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Correo electrónico
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Mínimo 8 caracteres
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700">
                                    Confirmar contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="text-red-500 text-sm">
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {/* {success && (
                                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                    <div className="text-green-500 text-sm">
                                        ¡Cuenta creada exitosamente! Redirigiendo...
                                    </div>
                                </div>
                            )} */}

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="mt-1 rounded"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="terms" className="text-sm text-muted-foreground">
                                    Acepto los{" "}
                                    <a href="/terminos-y-condiciones" target="_blank" className="text-primary hover:underline">
                                        términos y condiciones
                                    </a>{" "}
                                    y la{" "}
                                    <a href="/politica-de-privacidad" target="_blank" className="text-primary hover:underline">
                                        política de privacidad
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={submitting || success || !acceptedTerms}
                                className="w-full shadow-glow"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear cuenta gratis"}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        O regístrate con
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                size="lg"
                            >
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>
                        </form>

                        {/* Actions */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            ¿Ya tienes cuenta?{" "}
                            <a href="/login" className="text-primary hover:underline font-semibold">
                                Inicia sesión
                            </a>
                        </p>
                    </Card>
                </div>
            </section>
        </div>
    );
};
