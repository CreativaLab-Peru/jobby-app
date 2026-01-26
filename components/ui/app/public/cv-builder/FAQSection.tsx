import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona el análisis de CV con IA?",
    answer: "Nuestra IA analiza tu CV en segundos, evaluando la estructura, contenido, keywords y compatibilidad con sistemas ATS. Recibes un score de empleabilidad y recomendaciones específicas para mejorar tu perfil."
  },
  {
    question: "¿Qué formatos de CV puedo subir?",
    answer: "Aceptamos archivos en PDF, Word (.doc, .docx) y texto plano. Recomendamos PDF para mantener el formato original de tu CV."
  },
  {
    question: "¿Cuánto tiempo toma el análisis?",
    answer: "El análisis completo toma menos de 60 segundos. Recibirás los resultados inmediatamente en pantalla y también por email."
  },
  {
    question: "¿Qué incluyen los 8 créditos IA?",
    answer: "Los créditos te permiten usar diferentes herramientas: análisis de CV, optimización de secciones, generación de versiones alternativas y recomendaciones de oportunidades laborales."
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Sí, utilizamos encriptación de nivel bancario. Tu información solo se procesa para el análisis y nunca se comparte con terceros. Puedes eliminar tus datos en cualquier momento."
  },
  {
    question: "¿Puedo obtener más créditos después?",
    answer: "¡Por supuesto! Puedes comprar paquetes adicionales de créditos cuando los necesites. No hay suscripciones ni cargos automáticos."
  },
  {
    question: "¿El CV optimizado pasa los filtros ATS?",
    answer: "Sí, nuestro análisis está diseñado específicamente para optimizar tu CV para sistemas ATS (Applicant Tracking Systems) que usan las empresas para filtrar candidatos."
  },
  {
    question: "¿En qué idiomas funciona?",
    answer: "Actualmente soportamos análisis de CVs en español e inglés, con recomendaciones adaptadas a cada idioma y mercado laboral."
  },
];

export function FAQSection() {
  return (
    <section className="py-20 pt-20 section-padding bg-secondary/30 dark:bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-5xl headline-lg">Preguntas frecuentes</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Todo lo que necesitas saber sobre CV Builder
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border rounded-xl px-6 data-[state=open]:border-lime-500/40 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
