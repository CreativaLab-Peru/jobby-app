"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteDossier } from "../actions/get-route-dossier";
import {DossierPDF} from "@/features/booking/doc/dossier-template";

interface DownloadButtonProps {
  dossier: Extract<RouteDossier, { success: true }>["data"];
}

export function DownloadDossierButton({ dossier }: DownloadButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevenimos errores de hidratación en Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <PDFDownloadLink
      document={<DossierPDF data={dossier} />}
      fileName={`Dossier_Levely_${dossier.userName.replace(/\s+/g, "_")}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading, error }) => (
        <Button
          variant="outline"
          disabled={loading}
          className="h-12 px-8 rounded-xl border-2 border-border text-foreground hover:border-primary font-black transition-all gap-3"
        >
          <FileDown className="h-5 w-5 text-primary" />
          {loading ? "Preparando PDF..." : "Descargar Dossier PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
