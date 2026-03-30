"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Globe, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LATAM_COUNTRIES } from "@/const";
import { toast } from "sonner";
import {saveBookMentorAction} from "@/features/booking/actions/save-book-mentor";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  score?: number;
}

export function BookingModal({ isOpen, onClose, userName, userEmail, score }: BookingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [prefix, setPrefix] = useState("+51");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState(userName);

  const handleBooking = () => {
    if (!phoneNumber) return toast.error("Ingresa tu número de WhatsApp");

    const fullPhone = `${prefix}${phoneNumber}`.replace(/\s+/g, "");

    startTransition(async () => {
      const result = await saveBookMentorAction({ phone: fullPhone, fullName });

      if (result.success) {
        // Generar mensaje de WhatsApp
        const message = `Hola Dara, soy ${fullName}, ya tengo mi Levely Score (${score ?? 0} pts) y quiero que revises mi Dossier. Mi correo es ${userEmail ?? ""}.`;
        const encodedMessage = encodeURIComponent(message);
        const levelyNumberPhone = '51914773770';
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${levelyNumberPhone}&text=${encodedMessage}`;

        // Abrir WhatsApp en nueva pestaña
        window.open(whatsappUrl, "_blank");

        onClose();
        toast.success("¡Redirigiendo a WhatsApp!");
      } else {
        toast.error("Hubo un problema al guardar tus datos.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border border-border bg-card rounded-xl shadow-lg">
        <div className="p-6 border-b border-border bg-muted/20">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Casi listo, {fullName.split(' ')[0]}
              </DialogTitle>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Completa tus datos para agendar</p>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-xs">Nombre Completo</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 rounded-lg border-border bg-background text-sm font-medium focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">WhatsApp</Label>
            <div className="flex gap-2">
              <Select value={prefix} onValueChange={setPrefix}>
                <SelectTrigger className="w-[110px] h-11 bg-secondary/50 border-border rounded-lg text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {LATAM_COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.prefix} className="text-xs">
                      {c.code} {c.prefix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="tel"
                placeholder="999 999 999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-11 rounded-lg border-border flex-1 text-sm bg-background focus-visible:ring-primary font-medium"
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-primary/5 border border-dashed border-primary/30">
            <Checkbox id="confirm" defaultChecked className="h-4 w-4 rounded border-primary" />
            <label htmlFor="confirm" className="text-xs font-bold text-foreground leading-tight cursor-pointer px-3">
              Deseo que un mentor valide mi perfil.
            </label>
          </div>

          <Button
            onClick={handleBooking}
            disabled={isPending}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold text-sm gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {isPending ? "Guardando..." : "¡Agendar por WhatsApp!"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
