"use client";

import React from 'react';

// Tipado para mejor mantenimiento
interface Testimonial {
  initial: string;
  name: string;
  from: string;
  text: string;
  badge: string;
}

interface FAQ {
  q: string;
  a: string;
}

const testimonials: Testimonial[] = [
  {
    initial: 'L', name: 'Luciana M.', from: 'Colombia • Negocios Intern...',
    text: '“Llevaba 3 meses intentando entender el sistema de becas UK por mi cuenta. Con esta guía lo tuve claro en una tarde — supe qué leer, qué ignorar y por dónde empezar.”',
    badge: '✔️ Ahorró 3 meses de búsqueda'
  },
  {
    initial: 'A', name: 'Andrés R.', from: 'México • MBA',
    text: '“No entendía si mi perfil encajaba con lo que piden en UK. El Notion me dio claridad total — supe exactamente dónde investigar más y qué requisitos tenía que cubrir. Vale 100x las $19.”',
    badge: '✔️ Claridad total en una sentada'
  },
  {
    initial: 'M', name: 'María José P.', from: 'Perú • Innovación',
    text: '“Lo mejor son los enlaces directos. Antes pasaba horas buscando fechas y requisitos en webs en inglés. Ahora abro el Notion y todo está ahí, ordenado y actualizado.”',
    badge: '✔️ Adiós a horas de Google'
  },
];

const faqs: FAQ[] = [
  { q: '“Toda esta info está gratis en Google”', a: 'Sí — dispersa en 200 páginas en inglés, desactualizada y sin contexto para LATAM. Yo ya hice ese trabajo. Tú pagas por el tiempo que te ahorras.' },
  { q: '“No sé si mi perfil califica para UK”', a: 'La guía incluye los requisitos reales de cada programa. Después de leerla sabrás dónde estás parado y qué mejorar.' },
  { q: '“$19 para un Notion me parece mucho”', a: 'Una beca en UK vale entre $30,000 y $80,000 al año. Esta guía cuesta menos que un café en Londres — y tiene garantía de 7 días.' },
];

const TestimonialsAndFaqSection: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-extrabold text-center mb-16 leading-tight text-foreground">
        Lo que dicen quienes ya la usan
      </h2>
      <p className="text-muted-foreground text-center -mt-12 mb-16 text-sm max-w-lg mx-auto">
        Esta guía no garantiza tu admisión — te ahorra meses de búsqueda y te da claridad para decidir mejor.
      </p>

      {/* Cuadrícula de testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card p-8 rounded-3xl border border-border flex flex-col h-full shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xl font-medium">
                {t.initial}
              </div>
              <div>
                <div className="font-bold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.from}</div>
                {/* Rating: Mantenemos amarillo para UX, o puedes usar text-primary si es parte del diseño */}
                <div className="text-amber-400 mt-1">★★★★★</div>
              </div>
            </div>
            <p className="text-card-foreground flex-grow mb-6 leading-relaxed text-sm">
              {t.text}
            </p>
            <div className="text-xs text-primary font-bold bg-primary/10 px-4 py-2 rounded-full inline-block text-center mt-auto">
              {t.badge}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground/60 text-center mb-24 max-w-md mx-auto">
        Resultados individuales varían. La guía es una herramienta de información y organización — no un servicio de admisión.
      </div>

      {/* Sección de preguntas frecuentes */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12 leading-tight text-foreground">
          ¿Estás pensando esto?
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-card p-8 rounded-3xl border border-border transition-colors hover:border-primary/50"
            >
              <h3 className="text-lg font-bold text-primary mb-4">
                {faq.q}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsAndFaqSection;
