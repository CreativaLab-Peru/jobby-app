import { Metadata } from "next";
import { UK_ROADMAP_SEO } from "@/features/selling/constants/seo-defaults";

export const metadata: Metadata = {
  title: UK_ROADMAP_SEO.title,
  description: UK_ROADMAP_SEO.description,
  keywords: UK_ROADMAP_SEO.keywords,
  // Sobrescribimos el OG específico para este producto
  openGraph: UK_ROADMAP_SEO.openGraph,
};

export default function UKSellingPage() {
  return (
    <article className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-blue-600 font-bold mb-4">Para perfiles de Business · Management · Finance</h2>
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Aplica a tu postgrado en UK en 30 días con la guía que armé en +4 meses
        </h1>
        {/* ... Resto del contenido semántico ... */}
      </section>

      {/* Social Proof Section - Importante para Google */}
      <section id="testimonios" className="bg-slate-50 py-16 rounded-3xl my-12">
        <h3 className="text-center text-2xl font-bold mb-10">+500 candidatos LATAM ya la usan</h3>
        {/* Grid de testimonios usando componentes de feature/selling */}
      </section>
    </article>
  );
}
