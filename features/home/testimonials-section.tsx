"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, TrendingUp, Target } from "lucide-react"

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Senior Software Engineer en Meta",
    company: "Meta",
    content: "Pasé de recibir 0 respuestas a conseguir 8 entrevistas en 2 semanas. El cambio fue increíble. Mi CV anterior parecía amateur comparado con este.",
    avatar: "MR",
    rating: 5,
    result: "+800% respuestas",
    timeframe: "En 2 semanas",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Carlos Mendez",
    role: "Product Manager en Google",
    company: "Google",
    content: "La IA detectó habilidades que ni yo sabía que tenía valor en el mercado. Ahora trabajo en mi empresa soñada con 40% más de salario.",
    avatar: "CM",
    rating: 5,
    result: "+40% salario",
    timeframe: "En 3 meses",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Ana Torres",
    role: "UX Designer en Spotify",
    company: "Spotify",
    content: "El proceso fue súper fácil y el resultado superó completamente mis expectativas. En una semana ya tenía mi primer offer letter.",
    avatar: "AT",
    rating: 5,
    result: "Primera oferta",
    timeframe: "En 1 semana",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    name: "David Chen",
    role: "Data Scientist en Netflix",
    company: "Netflix",
    content: "Pensé que mi experiencia no era suficiente, pero Levely la presentó de una manera que me hizo ver como el candidato perfecto.",
    avatar: "DC",
    rating: 5,
    result: "Trabajo soñado",
    timeframe: "En 6 semanas",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    name: "Sofia Lopez",
    role: "Marketing Director en Airbnb",
    company: "Airbnb",
    content: "No solo conseguí más entrevistas, sino que llegué mucho más preparada. El CV me ayudó a articular mejor mi valor único.",
    avatar: "SL",
    rating: 5,
    result: "+250% entrevistas",
    timeframe: "En 1 mes",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    name: "Miguel Santos",
    role: "DevOps Engineer en Amazon",
    company: "Amazon",
    content: "Había estado aplicando por meses sin éxito. Con Levely, conseguí 3 ofertas simultáneas y pude negociar el mejor paquete de mi carrera.",
    avatar: "MS",
    rating: 5,
    result: "3 ofertas simultáneas",
    timeframe: "En 3 semanas",
    gradient: "from-green-500 to-emerald-500"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [360, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 border border-white/20">
            <Quote className="w-4 h-4" />
            <span className="font-medium">Historias reales, resultados reales</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Así cambiamos vidas profesionales
          </h2>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Más de 50,000 profesionales han transformado sus carreras con Levely.
            <strong className="text-white"> Estas son sus historias.</strong>
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-white/90 mb-6 italic leading-relaxed relative">
                    <Quote className="w-6 h-6 text-white/30 absolute -top-2 -left-2" />
                    <p className="relative z-10">{testimonial.content}</p>
                  </blockquote>

                  {/* Results Badge */}
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${testimonial.gradient} px-4 py-2 rounded-full mb-6`}>
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">
                      {testimonial.result}
                    </span>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-blue-200 text-sm">{testimonial.role}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">{testimonial.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-blue-100 text-lg mb-6">
            ¿Listo para escribir tu propia historia de éxito?
          </p>

          <div className="flex justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 estrellas promedio</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>95% tasa de éxito</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
