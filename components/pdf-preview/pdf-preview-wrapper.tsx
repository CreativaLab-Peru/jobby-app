// app/(authenticated)/tests/pdf-preview-wrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { CVData, CVSection } from "@/types/cv";

// Dynamically import the PDF preview, client-only
const ClientPDFPreview = dynamic(
  () => import("./client-pdf-preview").then((mod) => mod.ClientPDFPreview),
  { ssr: false }
);

export function PdfPreviewWrapper({
  cvData,
  sections,
  templateId = "harvard"
}: {
  cvData: CVData;
  sections: CVSection[];
  templateId?: string;
}) {
  return (
    <ClientPDFPreview
      cvData={cvData}
      sections={sections}
      templateId={templateId}
    />
  );
}
