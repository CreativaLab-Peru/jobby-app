import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestimoniosCarousel from "@/components/testimonios";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  Brain,
  Clock,
  Shield,
  Users,
  CheckCircle2,
  FileText,
  Target,
  Rocket,
  Calendar,
  Zap,
  GraduationCap,
  Briefcase,
  Heart,
  ArrowUpRight,
} from "lucide-react";

import heroBgLight from "@/public/hero/hero_black.png";
import heroBgDark from "@/public/hero/hero_light.png";

const partnerLogos = [
  { name: "Data Science Perú", light: "/partners/AIESEC-light.png", dark: "/partners/AIESEC-dark.png" },
  { name: "Universidad Continental", light: "/partners/Continental-light.png", dark: "/partners/Continental-dark.png" },
  { name: "Mujeres Digitales", light: "/partners/MujeresDigitales-light.png", dark: "/partners/MujeresDigitales-dark.png" },
  { name: "AIESEC", light: "/partners/data_science-light.png", dark: "/partners/data_science-dark.png" },
];

const features = [
  "Análisis completo de tu CV actual",
  "Sugerencias de mejora por sección",
  "Detección de keywords para ATS",
  "Recomendaciones de formato",
];

const highlights = [
  { icon: Calendar, text: "4 semanas intensivas" },
  { icon: Users, text: "Mentoría 1:1" },
  { icon: Zap, text: "Herramientas IA" },
];

const audiences = [
  {
    icon: GraduationCap,
    title: "Estudiantes",
    description:
      "Prepárate para tu primera experiencia profesional con un perfil optimizado desde el inicio.",
    color: "blue",
    stat: "+500",
    statLabel: "estudiantes activos",
  },
  {
    icon: Briefcase,
    title: "Jóvenes profesionales",
    description: "Da el siguiente paso en tu carrera con herramientas que te ayudan a destacar.",
    color: "lime",
    stat: "85%",
    statLabel: "consiguen entrevistas",
  },
  {
    icon: Heart,
    title: "Mujeres en tech",
    description:
      "Apoyamos tu crecimiento profesional con recursos y oportunidades diseñadas para ti.",
    color: "coral",
    stat: "+200",
    statLabel: "mujeres empoderadas",
  },
];

const Index = () => {
  return (
    <div className="space-y-32">
      <section className="bg-background relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Hero Section */}
        {/* Background images for light and dark mode */}
        <div className="absolute inset-0">
          <Image
            src={heroBgDark}
            alt="Hero Background Dark"
            className="absolute inset-0 w-full h-full object-cover dark:opacity-0 opacity-100 transition-opacity duration-500"
            priority
          />
          <Image
            src={heroBgLight}
            alt="Hero Background Light"
            className="absolute inset-0 w-full h-full object-cover dark:opacity-100 opacity-0 transition-opacity duration-500"
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-36">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-300 mb-8 animate-fade-up backdrop-blur-sm dark:border-blue-900"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", animationDelay: "0.1s" }}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Potenciado por IA
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-7xl font-bold max-w-4xl text-balance text-[#1b292d] dark:text-white fadeUp"
              style={{ animationDelay: "0.1s" }}
            >
              Convierte tu perfil en oportunidades reales
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 text-xl sm:text-xl text-muted-foreground max-w-2xl text-balance fadeUp"
              style={{ animationDelay: "0.2s" }}
            >
              Accede a prácticas, trabajos y becas con guía inteligente y oportunidades alineadas a
              tu perfil.
            </p>

            {/* CTA */}
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 fadeUp"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/register" style={{ animationDelay: "0.3s" }}>
                <Button className="pointer-events-auto" size="xl">
                  Empezar
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="mt-16 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground fadeUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex -space-x-2">
                {[
                  "/testimonios/Andy.png",
                  "/testimonios/Monica.png",
                  "/testimonios/Jhon.png",
                  "/testimonios/Aaron.png",
                  "/testimonios/Brenda.png",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-background flex items-center justify-center overflow-hidden fadeUp"
                  >
                    <Image
                      src={src}
                      alt={`Avatar ${i + 1}`}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">+500</span>{" "}
                profesionales ya optimizaron su perfil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-2xl font-medium text-muted-foreground mb-10">
            Instituciones que ya confían en Levely
          </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            {partnerLogos.map((partner) => (
              <div key={partner.name} className="group flex items-center justify-center">
                <div className="w-36 h-20 sm:w-65 sm:h-30 rounded-xl bg-transparent borde flex items-center justify-center group-hover:border-blue/30 group-hover:shadow-md transition-all duration-300 p-2">
                  {/* Logo para modo claro */}
                  <Image
                    src={partner.light}
                    alt={partner.name}
                    width={220}
                    height={90}
                    className="object-contain w-full h-full dark:hidden"
                  />
                  {/* Logo para modo oscuro */}
                  <Image
                    src={partner.dark}
                    alt={partner.name}
                    width={220}
                    height={90}
                    className="object-contain w-full h-full hidden dark:block"
                  />
                </div>
              </div>
            ))}
            </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="m-6 sm:m-10 md:m-16 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Card wrapper similar to Career Accelerator */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue via-blue/90 to-blue/80 p-6 sm:p-8 lg:p-12">
            {/* Background decoration */}
            <div className="bg-gradient-to-bl from-rose-300 via-blue-500 to-blue-400 py-16 sm:py-20 lg:py-24 absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-72 sm:h-72 bg-lime/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4 sm:mb-6">
                  <FileText className="w-4 h-4" />
                  Producto principal
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                  CV Builder con IA
                </h2>

                <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
                  Analiza y optimiza tu currículum con inteligencia artificial. Recibe feedback
                  instantáneo y recomendaciones personalizadas para destacar ante reclutadores.
                </p>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white mt-0.5 flex-shrink-0 dark:text-white" />
                      <span className="text-white/90 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/cv-builder">
                  <Button
                    size="lg"
                    className="bg-lime text-lime-foreground hover:bg-lime/90 font-semibold"
                  >
                    Probar CV Builder
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Visual - Improved mock UI */}
              <div className="relative">
                {/* Main analysis card */}
                <div className="bg-[#19282D] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/10">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/10 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-lime-800 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-lime/20 flex items-center justify-center">
                        <FileText className="text-amber-200 w-5 h-5 sm:w-6 sm:h-6 text-lime" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm sm:text-base">
                          mi-curriculum.pdf
                        </p>
                        <p className="text-xs sm:text-sm text-white/60">Análisis completado</p>
                      </div>
                    </div>
                    <div className="bg-lime-800  flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/20">
                      <Sparkles className="w-4 h-4 text-lime-300" />
                      <span className="text-amber-200 text-xs font-medium text-lime">
                        IA Activa
                      </span>
                    </div>
                  </div>

                  {/* Score section */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-medium text-white/80">
                        Puntuación general
                      </span>
                      <span className="text-lg sm:text-2xl font-bold text-lime-300">85/100</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-lime-200 to-lime-300 rounded-full" />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <TrendingUp className="w-4 h-4 text-amber-200" />
                        <p className="text-xs sm:text-sm text-white/60">Experiencia</p>
                      </div>
                      <p className="text-sm sm:text-lg font-bold text-white">Excelente</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Target className="w-4 h-4 text-amber-200" />
                        <p className="text-xs sm:text-sm text-white/60">Keywords ATS</p>
                      </div>
                      <p className="text-sm sm:text-lg font-bold text-white">12 detectadas</p>
                    </div>
                  </div>

                  {/* Recommendations preview */}
                  <div className="p-3 sm:p-4 rounded-xl bg-transparent border border-lime-700">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-lime-800 w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-lime/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-200" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-white mb-1">
                          Recomendación IA
                        </p>
                        <p className="text-xs text-white/70">
                          Agrega métricas cuantificables a tu sección de logros para aumentar tu
                          puntuación.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute -top-4 -right-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-lime text-lime-foreground text-xs sm:text-sm font-bold shadow-lg"
                  style={{
                    animation: "bounce 2s infinite",
                    animationTimingFunction: "ease-in-out",
                  }}
                >
                  ✨ +15% empleabilidad
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Accelerator Section */}
      <section className="bg-transparent py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl text-white p-8 sm:p-12 lg:p-16 bg-gray-900">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-red-500">
                  Programa Premium
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">Career Accelerator</h2>

              <p className="text-lg text-white/80 max-w-xl mb-8">
                Un programa intensivo de 4 semanas diseñado para acelerar tu crecimiento profesional
                con mentores expertos y herramientas de IA.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {highlights.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-500"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/career-accelerator">
                <Button size="lg" className="bg-red-500 text-white hover:bg-red-500/90">
                  Conocer más
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              ¿Para quién es <span className="text-gradient">Levely</span>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Diseñado para personas que quieren impulsar su carrera profesional
            </p>
          </div>

            {/* Innovative Audience cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {audiences.map((audience) => (
              <div
                key={audience.title}
                className="group relative bg-gray-800 rounded-3xl border border-gray-700 p-8 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    audience.color === "blue"
                      ? "from-blue-500/20 to-blue-600/10"
                      : audience.color === "lime"
                      ? "from-lime-400/10 to-lime-500/20"
                      : "from-red-400/10 to-red-200/20"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Icon with floating animation */}
                <div
                  className={`relative w-16 h-16 rounded-2xl ${
                    audience.color === "blue"
                      ? "bg-blue-500/20"
                      : audience.color === "lime" 
                      ? "bg-lime-400/20"
                      : "bg-red-500/20"
                  } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <audience.icon
                    className={`w-8 h-8 ${
                      audience.color === "blue"
                        ? "text-blue-600"
                        : audience.color === "lime"
                        ? "text-lime-600"
                        : "text-red-600"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{audience.title}</h3>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="text-gray-400 mb-6">{audience.description}</p>

                  {/* Stats badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      audience.color === "blue"
                        ? "bg-blue-600/20 text-blue-400"
                        : audience.color === "lime"
                        ? "bg-lime-500/20 text-lime-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <span className="text-lg font-bold">{audience.stat}</span>
                    <span className="text-sm opacity-80">{audience.statLabel}</span>
                  </div>
                </div>

                {/* Decorative corner */}
                <div
                  className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${
                    audience.color === "blue"
                      ? "bg-blue-500/10"
                      : audience.color === "lime"
                      ? "bg-lime-500/10"
                      : "bg-red-500/10"
                  } group-hover:scale-150 transition-transform duration-500`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="px-4 sm:px-6 lg:px-8 bg-background">
        <div className="bg-background container mx-auto max-w-6xl">
          <TestimoniosCarousel />
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="section-paddin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-12 sm:p-16 lg:p-20 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-lime-300" />
                <span className="text-sm font-medium text-white/90">Tu futuro empieza hoy</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                El talento que buscas,<br />
                <span className="text-lime-300">a un click de distancia</span>
              </h2>
              
              <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-10">
                Únete a la comunidad de profesionales que están transformando su carrera con inteligencia artificial.
              </p>
              
              <Button 
                className="bg-lime-300 text-gray-900 hover:bg-lime-400 font-semibold"
                size="xl">
                Empezar gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
