"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Globe, 
  FileText, 
  Mic, 
  Radio, 
  Map, 
  ArrowRight,
  Sparkles 
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Score de CV",
    tagline: "Agente Score",
    description: "¿Cuánto vale tu CV para Chevening hoy? No un score genérico. Un score 0–100 específico para la beca que eliges — con las mejoras exactas que necesitas para subirlo.",
    icon: BarChart3,
    href: "/onboarding/talents",
  },
  {
    title: "Match de oportunidades",
    tagline: "Agente Match",
    description: "500+ oportunidades. Las tuyas están aquí. Becas, fellowships, pasantías y voluntariados ordenados por % de match con tu perfil real. Con y sin requisito de inglés.",
    icon: Globe,
    href: "/onboarding/talents",
  },
  {
    title: "CV Internacional",
    tagline: "CV Harvard & Europass",
    description: "Tu CV en formato Harvard o Europass en segundos. Olvida las horas editando formatos. Levely convierte tu CV al estándar internacional que pide cada oportunidad.",
    icon: FileText,
    href: "/onboarding/talents",
  },
  {
    title: "Simulador de entrevistas",
    tagline: "Feedback de Voz con IA",
    description: "Practica tu entrevista antes del día real. Un entrevistador IA con voz real hace las preguntas exactas que usa Chevening, Fulbright y DAAD. Feedback instantáneo.",
    icon: Mic,
    href: "/onboarding/talents",
  },
  {
    title: "Radar de oportunidades",
    tagline: "Monitoreo 24/7",
    description: "Las convocatorias del mundo en español, en tiempo real. El agente monitorea embajadas, ministerios y boletines en inglés, los traduce y los filtra por tu perfil.",
    icon: Radio,
    href: "/onboarding/talents",
  },
  {
    title: "Roadmap personalizado",
    tagline: "Plan hasta ganar",
    description: "Tu plan exacto hasta ganar. No tips genéricos. Un plan con fechas reales, pasos en orden y recordatorios — desde hoy hasta el día que envías tu postulación.",
    icon: Map,
    href: "/onboarding/talents",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export function ToolsSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Luces decorativas de fondo (Blobs) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container-levely relative z-10">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm border-[0.5px]"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Nuestros Copilotos con IA
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]"
          >
            Todo lo que necesitas para <br />
            <span className="text-primary">conquistar el mundo.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed mt-6"
          >
            Seis agentes de inteligencia artificial especializados que analizan tu perfil, identifican brechas, encuentran becas compatibles y te preparan en cada paso.
          </motion.p>
        </div>

        {/* Grid de Herramientas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative flex flex-col justify-between p-8 rounded-[2rem] bg-card/60 backdrop-blur-sm border border-border/40 hover:border-accent/40 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Glow en hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Icono */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <tool.icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Tagline */}
                <span className="text-xs font-bold text-accent/80 dark:text-accent uppercase tracking-widest block mb-2">
                  {tool.tagline}
                </span>

                {/* Título */}
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">
                  {tool.title}
                </h3>

                {/* Descripción */}
                <p className="text-base text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Botón Acción */}
              <Link 
                href={tool.href}
                className="inline-flex items-center text-sm font-bold text-primary group-hover:text-accent mt-8 transition-colors duration-300 gap-1.5"
              >
                Probar herramienta 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
