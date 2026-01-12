"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";
import {acceptTerms} from "@/features/authentication/actions/accept-terms";

interface TermsModalProps {
  isOpen: boolean;
  userId?: string;
}

export function TermsModal({ isOpen, userId }: TermsModalProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onAccept = () => {
    if (!userId) {
      console.error("User ID is required to accept terms");
      return;
    }
    if (isPending) return; // Prevent multiple submissions
    startTransition(()=> {
      acceptTerms(userId).then((response) => {
        if (response) {
          router.refresh(); // Refresh the page to reflect changes
        } else {
          console.error("Error accepting terms");
        }
      })
    })
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-xl bg-white/95 backdrop-blur-sm border border-orange-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Aceptar Términos
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4 p-1">
          <p className="text-gray-600 text-sm flex-1">
            Debes aceptar nuestros{" "}
            <a
              href="/terms"
              target="_blank"
              className="text-orange-600 hover:underline"
            >
              Términos y Condiciones
            </a>{" "}
            y nuestra{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-orange-600 hover:underline"
            >
              Política de Privacidad
            </a>{" "}

            antes de continuar.
          </p>

          <Button
            disabled={isPending}
            onClick={onAccept}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white cursor-pointer"
          >
            { isPending ? (
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
