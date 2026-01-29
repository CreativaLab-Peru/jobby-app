"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { acceptTerms } from "@/features/authentication/actions/accept-terms";

interface TermsModalProps {
  isOpen: boolean;
  userId?: string;
}

export function TermsModal({ isOpen, userId }: TermsModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onAccept = () => {
    if (!userId) {
      console.error("User ID is required to accept terms");
      return;
    }
    if (isPending) return;

    startTransition(() => {
      acceptTerms(userId).then((response) => {
        if (response) {
          router.refresh();
        } else {
          console.error("Error accepting terms");
        }
      });
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-xl bg-background/95 backdrop-blur-sm border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white text-xl font-semibold">
            Aceptar Términos
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4 p-1">
          <p className="text-muted-foreground text-sm flex-1">
            Debes aceptar nuestros{" "}
            <a
              href="/terms"
              target="_blank"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Términos y Condiciones
            </a>{" "}
            y nuestra{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Política de Privacidad
            </a>{" "}
            antes de continuar.
          </p>

          <Button
            disabled={isPending}
            onClick={onAccept}
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Aceptar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
