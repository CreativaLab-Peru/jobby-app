import {Metadata} from "next";
import {UK_ROADMAP_SEO} from "@/features/selling/constants/seo-defaults";

export const metadata: Metadata = {
  title: UK_ROADMAP_SEO.title,
  description: UK_ROADMAP_SEO.description,
  keywords: UK_ROADMAP_SEO.keywords,
  // Sobrescribimos el OG específico para este producto
  openGraph: UK_ROADMAP_SEO.openGraph,
};

export default function UKSellingPage({
                                        children,
                                      }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}
