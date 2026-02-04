import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dara Mariluz",
    role: "Analista de Marketing",
    company: "Startup Tech",
    content: "Gracias a Levely pude optimizar mi CV y conseguí 3 entrevistas en la primera semana. Las recomendaciones de IA fueron muy precisas.",
    rating: 5,
  },
  {
    name: "Edward Meléndez",
    role: "Desarrollador Junior",
    company: "Agencia Digital",
    content: "El análisis de keywords me ayudó a pasar los filtros ATS que antes me rechazaban. Ahora trabajo en mi empresa soñada.",
    rating: 5,
  },
  {
    name: "Mónica Dias",
    role: "Practicante de Administración",
    company: "Multinacional",
    content: "Como recién egresada de la UNSAAC no sabía cómo destacar. Levely me dio feedback claro y actionable. ¡100% recomendado!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary/30 dark:bg-secondary/10">
      <div className="container-levely">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="headline-lg">Lo que dicen nuestros usuarios</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Miles de profesionales ya optimizaron su perfil con Levely
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative p-6 rounded-2xl border border-border bg-card hover:border-levely-green/40 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-levely-dark fill-levely-dark dark:text-levely-green/40 mb-4" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-levely-green dark:text-levely-green" />
                ))}
              </div>

              <p className="text-foreground mb-6 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
