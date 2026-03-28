"use client";

import { MessageCircle, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {LATAM_COUNTRIES} from "@/const";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function BookingModal({ isOpen, onClose, userName }: BookingModalProps) {
  const firstName = userName.split(' ')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border border-border bg-card rounded-xl shadow-lg">

        {/* Header con estilo Roadmap */}
        <div className="p-6 border-b border-border bg-muted/20">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Casi listo, {firstName}
              </DialogTitle>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Completa tus datos para agendar tu mentoría
            </p>
          </DialogHeader>
        </div>

        <form className="px-6 pb-6 space-y-5" onSubmit={(e) => e.preventDefault()}>

          <div className="space-y-2">
            <Label className="text-xs">
              Nombre Completo
            </Label>
            <Input
              defaultValue={userName}
              className="h-11 rounded-lg border-border bg-background text-sm font-medium focus-visible:ring-primary"
            />
          </div>

          {/* Campo: WhatsApp con Select de País */}
          <div className="space-y-2">
            <Label className="text-xs">
              WhatsApp
            </Label>
            <div className="flex gap-2">
              {/* Selector de Prefijo */}
              <Select defaultValue="+51">
                <SelectTrigger className="w-[110px] h-11 bg-secondary/50 border-border rounded-lg text-xs font-bold focus:ring-primary shadow-none">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="País" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  {LATAM_COUNTRIES.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.prefix}
                      className="text-xs font-medium"
                    >
                      <span className="mr-2 opacity-50">{country.code}</span>
                      {country.prefix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Input de Número */}
              <Input
                type="tel"
                placeholder="999 999 999"
                className="h-11 rounded-lg border-border flex-1 text-sm bg-background focus-visible:ring-primary font-medium"
              />
            </div>
          </div>

          {/* Banner de confirmación estilo Upgrade CTA */}
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-primary/5 border border-dashed border-primary/30">
            <Checkbox
              id="confirm"
              defaultChecked
              className="h-4 w-4 rounded border-primary data-[state=checked]:bg-primary"
            />
            <label htmlFor="confirm" className="text-xs font-bold text-foreground leading-tight cursor-pointer px-3">
              Deseo que un mentor valide mi perfil.
            </label>
          </div>

          <div className="space-y-4 pt-2">
            <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold text-sm transition-all active:scale-[0.98] gap-2 shadow-sm">
              <MessageCircle className="h-4 w-4" />
              ¡Agendar por WhatsApp!
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
