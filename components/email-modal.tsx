"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { sendEmailToPay } from "@/features/home/actions/send-email-to-pay";

interface EmailModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

export function EmailModal({ isOpen, closeModal }: EmailModalProps) {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState({
        value: "",
        error: "",
    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail({
            value: e.target.value,
            error: "",
        });
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Por favor, ingresa tu correo electrónico.";
        if (!emailRegex.test(value.trim())) return "Ingresa un correo electrónico válido.";
        return "";
    };

    const onAccept = () => {
        if (isPending) return;

        const errorMessage = validateEmail(email.value);
        if (errorMessage) {
            setEmail((prev) => ({ ...prev, error: errorMessage }));
            return;
        }

        startTransition(async () => {
            const response = await sendEmailToPay(email.value.trim());

            if (!response.success || response.error) {
                setEmail((prev) => ({
                    ...prev,
                    error: "Hubo un problema al continuar. Inténtalo de nuevo en unos minutos.",
                }));
                console.error("Error accepting terms", response.error);
                return;
            }

            const redirectUrl = response.redirect;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-md bg-gray-950/95 backdrop-blur-sm border border-gray-800 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-50">
                        Confirma tu correo para continuar
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="w-10 h-10 mt-0.5 text-green-400" aria-hidden />
                        <div>
                            <p className="text-sm font-medium text-gray-100">
                                Solo usaremos tu correo para enviarte el enlace de pago y notificaciones importantes.
                            </p>

                        </div>
                    </div>

                    <div className="flex flex-col gap-2">

                        <Input
                            id="payment-email"
                            type="email"
                            placeholder="tucorreo@gmail.com"
                            value={email.value}
                            onChange={handleEmailChange}
                            className="w-full py-5 text-sm bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
                        />
                        {email.error && (
                            <p className="text-xs text-red-400 mt-1">
                                {email.error}
                            </p>
                        )}
                    </div>

                    <Button
                        disabled={isPending}
                        onClick={onAccept}
                        className="w-full mt-1 shadow-glow hover:shadow-xl transition-all duration-300 text-sm font-semibold"
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>Continuar al pago</span>
              </span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
