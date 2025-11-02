// app/(main)/test/pdf-preview-wrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { CVData, CVSection } from "@/types/cv";

// ✅ Dynamically import the PDF preview, client-only
const ClientPDFPreview = dynamic(
  () => import("./client-pdf-preview").then((mod) => mod.ClientPDFPreview),
  { ssr: false }
);

export function PdfPreviewWrapper({ 
  cvData, 
  sections 
}: { 
  cvData: CVData;
  sections: CVSection[];
}) {
  return (
    <ClientPDFPreview
      cvData={cvData}
      sections={sections}
    />
  );
}
