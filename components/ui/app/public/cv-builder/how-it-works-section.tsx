import {
  Upload,
  Sparkles,
  Rocket,
  Briefcase,
  GraduationCap,
  Trophy,
  MessageSquare,
  Star,
} from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/10 pointer-events-none" />

      <div className="container-levely relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="headline-lg">Cómo funciona</h2>
          <p className="mt-4 text-lg text-muted-foreground">Tu camino hacia oportunidades reales</p>
        </div>

        {/* Vertical Flow with Innovative Cards */}
        <div className="relative max-w-5xl mx-auto">
          {/* Curved connecting line - SVG */}
          <svg
            className="absolute left-1/2 top-0 h-full w-48 -translate-x-1/2 hidden lg:block"
            viewBox="0 0 150 900"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M75 0 C75 80, 30 120, 30 180 C30 240, 120 280, 120 340 C120 400, 30 440, 30 520 C30 580, 120 620, 120 680 C120 740, 75 800, 75 900"
              stroke="url(#cvLineGradient)"
              strokeWidth="3"
              strokeDasharray="12 6"
              className="opacity-50"
            />
            <defs>
              <linearGradient id="cvLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(83, 100%, 74%)" />
                <stop offset="50%" stopColor="hsl(222, 91%, 67%)" />
                <stop offset="100%" stopColor="hsl(6, 86%, 63%)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Step 1 - CV Upload */}
          <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mb-32">
            {/* Step indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 lg:top-auto lg:left-1/2 w-10 h-10 rounded-full bg-levely-green flex items-center justify-center text-levely-dark font-bold text-lg z-10 shadow-lg">
              1
            </div>

            <div className="lg:w-1/2 text-center lg:text-right order-2 lg:order-1">
              <span className="inline-block text-sm font-bold dark:text-levely-green mb-3 uppercase tracking-wider">
                Paso 01
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Crea tu perfil y sube tu CV</h3>
              <p className="text-muted-foreground text-lg">
                Comienza subiendo tu currículum actual y construye tu perfil profesional
              </p>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              {/* Innovative Floating Card - CV Upload UI */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-levely-green/30 to-levely-green/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-card rounded-3xl shadow-2xl border border-border p-8 max-w-md mx-auto lg:ml-0 overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Decorative corner */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-levely-green/10 rounded-full" />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-levely-green/30 to-levely-green/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-levely-green-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-card-foreground">Subir CV</p>
                      <p className="text-sm text-muted-foreground">PDF aceptados</p>
                    </div>
                  </div>

                  {/* Upload zone */}
                  <div className="border-2 border-dashed border-levely-green/40 rounded-2xl p-8 text-center bg-levely-green/5 mb-6 group-hover:border-levely-green/60 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-levely-green/20 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-levely-green-foreground" />
                    </div>
                    <p className="font-semibold text-card-foreground mb-1">
                      Arrastra tu archivo aquí
                    </p>
                    <p className="text-sm text-muted-foreground">o haz click para seleccionar</p>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 rounded-full bg-levely-green" />
                    <div className="flex-1 h-2 rounded-full bg-border" />
                    <div className="flex-1 h-2 rounded-full bg-border" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - AI Insights */}
          <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mb-32">
            {/* Step indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 lg:top-auto lg:left-1/2 w-10 h-10 rounded-full bg-levely-blue flex items-center justify-center text-levely-blue-foreground font-bold text-lg z-10 shadow-lg">
              2
            </div>

            <div className="lg:w-1/2">
              {/* Innovative Floating Card - Recommendations UI */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-bl from-levely-blue/30 to-levely-blue/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-card rounded-3xl shadow-2xl border border-border p-8 max-w-md mx-auto lg:mr-0 lg:ml-auto overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Decorative corner */}
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-levely-blue/10 rounded-full" />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-levely-blue/30 to-levely-blue/10 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-levely-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-card-foreground">Oportunidades IA</p>
                      <p className="text-sm text-muted-foreground">Basadas en tu perfil</p>
                    </div>
                  </div>

                  {/* Opportunity Cards */}
                  <div className="space-y-4 relative">
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border hover:border-levely-blue/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-levely-blue" />
                          <span className="font-semibold text-card-foreground">
                            Practicante Marketing
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-levely-blue-foreground bg-levely-blue px-3 py-1 rounded-full">
                          98% Match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Empresa Tech • Lima, Perú</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border hover:border-levely-lime/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-levely-lime-foreground" />
                          <span className="font-semibold text-card-foreground">Beca Santander</span>
                        </div>
                        <span className="text-[11px] font-bold text-levely-dark bg-levely-green px-3 py-1 rounded-full">
                          77% Match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">100% cubierto • España</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border hover:border-levely-orange/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-levely-orange" />
                          <span className="font-semibold text-card-foreground">
                            Jr. Data Analyst
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-levely-orange-foreground bg-levely-orange px-3 py-1 rounded-full">
                          90% Match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Startup FinTech • Remoto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block text-sm font-bold dark:text-levely-blue mb-3 uppercase tracking-wider">
                Paso 02
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Obtén insights y oportunidades con IA
              </h3>
              <p className="text-muted-foreground text-lg">
                Recibe recomendaciones personalizadas de trabajos, prácticas y becas alineadas a tu
                perfil
              </p>
            </div>
          </div>

          {/* Step 3 - Career Preparation */}
          <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            {/* Step indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 lg:top-auto lg:left-1/2 w-10 h-10 rounded-full bg-levely-orange flex items-center justify-center text-levely-orange-foreground font-bold text-lg z-10 shadow-lg">
              3
            </div>

            <div className="lg:w-1/2 text-center lg:text-right order-2 lg:order-1">
              <span className="inline-block text-sm font-bold dark:text-levely-orange mb-3 uppercase tracking-wider">
                Paso 03
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Prepárate y acelera tu carrera
              </h3>
              <p className="text-muted-foreground text-lg">
                Practica entrevistas con simulador IA y recibe feedback de mentores expertos
              </p>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              {/* Innovative Floating Card - Interview & Feedback UI */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-levely-orange/30 to-levely-orange/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-card rounded-3xl shadow-2xl border border-border p-8 max-w-md mx-auto lg:ml-0 overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Decorative corner */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-levely-orange/10 rounded-full" />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-levely-orange/30 to-levely-orange/10 flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-levely-orange" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-card-foreground">Preparación</p>
                      <p className="text-sm text-muted-foreground">Entrevistas y mentorías</p>
                    </div>
                  </div>

                  {/* Interview Simulator */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-levely-orange to-levely-orange/80 text-levely-orange-foreground mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Simulador IA</p>
                        <div className="flex gap-1 mt-1">
                          <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                          <span
                            className="w-2 h-2 rounded-full bg-white/70 animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-white/70 animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">"¿Cuáles son tus principales fortalezas?"</p>
                  </div>

                  {/* Mentor Feedback Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-levely-orange/20 flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">
                          Feedback de Mentor
                        </span>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Excelente estructura en tu respuesta. Agrega ejemplos concretos para mayor
                      impacto."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
