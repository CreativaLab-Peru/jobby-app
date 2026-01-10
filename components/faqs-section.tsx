"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "¿Qué significa “Hasta 5 CV”?",
    answer:
      "Puedes crear y guardar 5 versiones diferentes de tu CV (según rol o industria). Puedes editarlas y reemplazarlas cuando quieras.",
  },
  {
    question: "¿De dónde salen las oportunidades?",
    answer:
      "Revisamos fuentes públicas, bolsas locales y remotas, y filtramos según tu perfil y preferencias.",
  },
  {
    question: "¿El análisis de compatibilidad garantiza entrevistas?",
    answer:
      "No garantiza entrevistas, pero mejora significativamente tu match al alinear tu CV con palabras clave relevantes.",
  },
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer:
      "Sí. Puedes cancelar desde tu cuenta y no se te volverá a cobrar el siguiente ciclo.",
  },
  {
    question: "¿Sirve para estudiantes sin experiencia?",
    answer:
      "Sí. Destacamos proyectos, voluntariados, cursos, prácticas y logros cuantificables.",
  },
  {
    question: "¿Mi información está segura?",
    answer:
      "Aplicamos buenas prácticas de seguridad y solo usamos tus datos para optimizar tu CV y sugerir oportunidades.",
  },
];

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">Preguntas Frecuentes</span>
          </h2>
          <p className="text-muted-foreground">
            Todo lo que necesitas saber antes de empezar
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const el = contentRefs.current[index];
            const maxHeight = isOpen && el ? `${el.scrollHeight}px` : "0px";

            return (
              <div
                key={index}
                className="
                  group rounded-xl border border-border bg-card
                  shadow-sm transition-all
                  hover:shadow-glow
                "
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="
                    w-full flex items-center justify-between
                    px-6 py-5 text-left
                    focus:outline-none
                  "
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${index}`}
                >
                  <span className="font-medium text-foreground">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`
                      h-5 w-5 text-muted-foreground
                      transition-transform duration-300
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {/* Content */}
                <div
                  id={`faq-content-${index}`}
                  // @ts-ignore
                  ref={(el) => (contentRefs.current[index] = el)}
                  role="region"
                  aria-hidden={!isOpen}
                  className="overflow-hidden"
                  style={{
                    maxHeight,
                    transition:
                      "max-height 320ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
