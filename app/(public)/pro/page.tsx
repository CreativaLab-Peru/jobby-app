"use client";

import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    Award,
    CheckCircle2,
    Sparkles,
    Star,
    TrendingUp,
    TriangleAlert,
    Upload,
    Zap,
} from "lucide-react";
import Link from "next/link";
import TestimoniosCarousel from "@/components/testimonios";
import FAQsSection from "@/components/FAQsSection";
import AutoPlayVideo from "@/components/AutoPlayVideo";
import {EmailModal} from "@/components/email-modal";
import {useState} from "react";

const Pro = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return (
        <>
            <div className="min-h-screen">
                {/* Sección principal */}
                <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Background gradient effect */}
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"/>

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="text-center space-y-8 animate-fade-in">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                <Sparkles className="h-4 w-4 text-primary"/>
                                <span className="text-sm font-medium text-primary">
                Plan más popular
              </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                                Convierte tu perfil en{" "}
                                <span
                                    className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                oportunidades reales
              </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                CV optimizado con IA, hasta 5 CV creados y guardados, y
                                recomendaciones de vacantes hechas a tu medida.
                            </p>

                            <Card
                                className="p-8 sm:p-10 bg-gradient-to-br from-secondary/20 via-primary/10 to-primary/20 shadow-2xl hover:shadow-glow border-2 border-primary/50 relative overflow-hidden max-w-md mx-auto transition-all duration-300 hover:scale-[1.02] group">
                                {/* Animated shine effect */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"/>

                                <div className="absolute top-4 right-4">
                <span
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg animate-pulse">
                  Popular
                </span>
                                </div>

                                <div className="text-center mb-8 relative">
                                    <h3 className="text-5xl sm:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                        Pro
                                    </h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl sm:text-6xl font-bold">S/9.90</span>
                                        {/* <span className="text-lg font-medium text-muted-foreground">
                    / mes
                  </span> */}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Pago único, sin suscripciones ✓
                                    </p>
                                </div>

                                <div className="space-y-4 relative">
                                    <Button
                                        size="lg"
                                        className="w-full shadow-glow hover:shadow-xl transition-all duration-300 text-base font-semibold"
                                        aria-label="Comenzar ahora"
                                        onClick={openModal}
                                    >
                                        Pagar ahora
                                        <Star className="ml-2 h-5 w-5 fill-current"/>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Cómo funciona */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                                ¿Cómo <span className="text-gradient">funciona?</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Tres simples pasos para crear tu CV profesional y empezar a
                                recibir oportunidades
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                            <div
                                className="group text-center space-y-4 p-6 rounded-2xl hover:bg-card/50 transition-all duration-300">
                                <div className="relative inline-flex">
                                    <div
                                        className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all"/>
                                    <div
                                        className="relative mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30 group-hover:scale-110 transition-transform">
                                        1
                                    </div>
                                </div>
                                <div className="relative inline-flex">
                                    <Upload
                                        className="h-10 w-10 mx-auto text-primary group-hover:scale-110 transition-transform"/>
                                </div>
                                <h3 className="text-xl font-bold">
                                    Crea tu cuenta, regístrate y realiza el pago
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Accede al creador inteligente de CV con recomendaciones
                                    alineadas a tu perfil profesional.
                                </p>
                            </div>

                            <div
                                className="group text-center space-y-4 p-6 rounded-2xl hover:bg-card/50 transition-all duration-300">
                                <div className="relative inline-flex">
                                    <div
                                        className="absolute inset-0 bg-secondary/30 rounded-full blur-xl group-hover:blur-2xl transition-all"/>
                                    <div
                                        className="relative mx-auto h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary border-2 border-secondary/30 group-hover:scale-110 transition-transform">
                                        2
                                    </div>
                                </div>
                                <div className="relative inline-flex">
                                    <Sparkles
                                        className="h-10 w-10 mx-auto text-secondary group-hover:scale-110 transition-transform"/>
                                </div>
                                <h3 className="text-xl font-bold">Crea o sube tu CV</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Genera hasta 5 CV adaptados por objetivo laboral (prácticas,
                                    becas o empleos). Cada uno optimizado con palabras clave y
                                    métricas específicas para superar filtros.
                                </p>
                            </div>

                            <div
                                className="group text-center space-y-4 p-6 rounded-2xl hover:bg-card/50 transition-all duration-300">
                                <div className="relative inline-flex">
                                    <div
                                        className="absolute inset-0 bg-accent/30 rounded-full blur-xl group-hover:blur-2xl transition-all"/>
                                    <div
                                        className="relative mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent border-2 border-accent/30 group-hover:scale-110 transition-transform">
                                        3
                                    </div>
                                </div>
                                <div className="relative inline-flex">
                                    <TrendingUp
                                        className="h-10 w-10 mx-auto text-accent group-hover:scale-110 transition-transform"/>
                                </div>
                                <h3 className="text-xl font-bold">Recibe recomendaciones</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    La IA te sugiere oportunidades alineadas a tu perfil: vacantes,
                                    internships y becas. Recibe recomendaciones para mejorar tu
                                    perfil.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Video section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                                Ve cómo{" "}
                                <span
                                    className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                funciona en acción
              </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Descubre lo fácil que es crear un CV profesional con nuestra
                                plataforma
                            </p>
                        </div>

                        <div className="relative group">
                            {/* Glow effect */}
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"/>

                            {/* Video container */}
                            <div
                                className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 bg-card/50 backdrop-blur">
                                <AutoPlayVideo src="/videos/videoejemplo-cv.mp4"/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonios */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
                    <div className="container mx-auto max-w-6xl">
                        <TestimoniosCarousel/>
                    </div>
                </section>

                {/* Beneficios del plan Pro */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/30 to-background">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                                ¿Por qué elegir {" "}
                                <span className="text-gradient">Jobby PRO?</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Invertir en tu futuro no tiene por qué ser caro
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Otras opciones */}
                            <Card
                                className="p-8 bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50 relative overflow-hidden group opacity-90">
                                <div
                                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-muted to-muted-foreground/20"/>

                                <div className="relative inline-flex mb-6">
                                    <div className="absolute inset-0 bg-muted/30 rounded-lg blur-lg transition-all"/>
                                    <div
                                        className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center border border-muted/30">
                                        <Zap className="h-7 w-7 text-muted-foreground"/>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 text-muted-foreground">
                                    Otras opciones
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Métodos tradicionales
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground/60 shrink-0"/>
                                        </div>
                                        <span>
                    Asesorías tradicionales: S/200 - S/300 por una sola revisión.
                    de CV.
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground/60 shrink-0"/>
                                        </div>
                                        <span>
                    Suscripciones mensuales en plataformas.
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground/60 shrink-0"/>
                                        </div>
                                        <span>Procesos lentos y costosos, poca accesibilidad.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-muted-foreground">
                                        <div className="mt-1">
                                            <TriangleAlert className="h-5 w-5 text-muted-foreground/60 shrink-0"/>
                                        </div>
                                        <span>
                    No siempre adaptadas al talento joven o al mercado local.
                  </span>
                                    </li>
                                </ul>
                            </Card>

                            {/* Jobby Pro */}
                            <Card
                                className="p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-2 border-primary/50 relative overflow-hidden group">
                                <div className="absolute top-4 right-4 z-10">
                <span
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg animate-pulse">
                  ⭐ MEJOR OPCIÓN
                </span>
                                </div>

                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"/>

                                <div
                                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"/>

                                <div className="relative inline-flex mb-6">
                                    <div
                                        className="absolute inset-0 bg-primary/30 rounded-lg blur-xl group-hover:blur-2xl transition-all"/>
                                    <div
                                        className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                                        <Award className="h-7 w-7 text-primary"/>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                    Jobby Pro
                                </h3>
                                <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">
                  Pago único de S/9.90
                </span>
                                </div>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Hasta 5 CV optimizados con IA en segundos.
                    </span>
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Recomendaciones de oportunidades ajustadas a tu perfil según tus habilidades.
                    </span>
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Accesible para cualquier estudiante o recién egresado.
                    </span>
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Score de match.
                    </span>
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Habilidades a reforzar con micro-cursos sugeridos.
                    </span>
                  </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>
                                        </div>
                                        <span className="text-base">
                    <span className="text-foreground">
                      Exportación: PDF y Word.
                    </span>
                  </span>
                                    </li>
                                </ul>

                                {/* Call to action */}
                                <div className="mt-8 pt-6 border-t border-primary/20">
                                    <Link href="/register" className="block">
                                        <Button
                                            size="lg"
                                            className="w-full shadow-glow hover:shadow-xl transition-all duration-300 text-base font-semibold"
                                        >
                                            Pagar ahora
                                            <Star className="ml-2 h-5 w-5 fill-current"/>
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <FAQsSection/>
                    </div>
                </section>
            </div>
            <EmailModal
                isOpen={isOpen}
                closeModal={closeModal}
            />
        </>
    );
};

export default Pro;
