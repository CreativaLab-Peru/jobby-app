"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/header";
import Link from "next/link";

const errorMapper = {
    "Invalid password": "Contraseña incorrecta",
    "User not found": "Usuario no encontrado",
    "Email not verified": "Correo electrónico no verificado",
    "Too many requests": "Demasiadas solicitudes, intenta más tarde",
    "Invalid email or password": "Correo electrónico o contraseña inválidos",
}

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            setError(null);
            // Replace with real authentication logic
            const response = await authClient.signIn.email({
                email,
                password
            })
            if (response.error) {
                const errorMessage = errorMapper[response.error.message] || response.error.message || "Error al iniciar sesión";
                setError(errorMessage);
                return;
            }
            setSuccess(true);
            // Redirect to dashboard or home page after successful login
            router.push('/cv');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="text-center mb-8 px-8">
                        <h1 className="text-4xl font-bold mb-2">
                            Bienvenido de <span className="text-gradient">vuelta</span>
                        </h1>
                    </div>
                    <p className="text-center text-muted-foreground mb-8">
                        Inicia sesión para continuar creando tu futuro
                    </p>
                </div>

                <div className="sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md">
                        <Card className="p-8 bg-card shadow-glow">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Correo electrónico
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Contraseña
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <div className="text-red-500 text-sm ">
                                            {error}
                                        </div>
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <div className="text-green-500 text-sm">
                                            ¡Has iniciado sesión correctamente! Redirigiendo...
                                        </div>
                                    </div>
                                )}

                                {/* Forgot Password Link */}
                                <div className="flex items-center justify-between text-sm">
                                    <label>
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-muted-foreground"> Recordarme</span>
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="font-bold h-14 px-10 w-full shadow-glow"
                                    size="lg"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Iniciar sesión"}
                                </Button>

                                {/* Divider */}
                                {/* <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            O continúa con
                                        </span>
                                    </div>
                                </div> */}

                                {/* Google Login Button */}
                                {/* <Button
                                    type="button"
                                    variant="outline"
                                    className="font-bold h-14 px-10 w-full"
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
                                </Button> */}
                            </form>

                            {/* Register Link */}
                            <p className="text-center text-sm text-muted-foreground mt-6">
                                No tienes una cuenta?{" "}
                                <Link
                                    href="/register"
                                    className="text-primary hover:underline"
                                >
                                    Regístrate gratis
                                </Link>
                            </p>
                        </Card>
                    </div>
                </div>

            </section>
        </div>
    );
}
