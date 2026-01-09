import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Star, Briefcase, Code, Palette, PenTool, TrendingUp, Video } from "lucide-react";

const expertos = [
  {
    name: "María Pérez",
    role: "Diseñadora UX/UI Senior",
    category: "Diseño",
    icon: Palette,
    rating: 4.9,
    sessions: 127,
    description: "Especialista en diseño de interfaces y experiencia de usuario con 10+ años",
  },
  {
    name: "Carlos Mendoza",
    role: "Tech Lead",
    category: "Desarrollo",
    icon: Code,
    rating: 5.0,
    sessions: 95,
    description: "Líder técnico con experiencia en startups y empresas Fortune 500",
  },
  {
    name: "Ana Torres",
    role: "Marketing Manager",
    category: "Marketing",
    icon: TrendingUp,
    rating: 4.8,
    sessions: 143,
    description: "Experta en marketing digital y growth hacking para creativos",
  },
  {
    name: "Luis García",
    role: "Content Creator",
    category: "Contenido",
    icon: PenTool,
    rating: 4.9,
    sessions: 78,
    description: "Creador de contenido con 500K+ seguidores y colaboraciones con marcas",
  },
  {
    name: "Sofia Ramírez",
    role: "Career Coach",
    category: "Carrera",
    icon: Briefcase,
    rating: 5.0,
    sessions: 201,
    description: "Coach especializada en transición de carrera para profesionales creativos",
  },
  {
    name: "Diego Ruiz",
    role: "Video Producer",
    category: "Audiovisual",
    icon: Video,
    rating: 4.7,
    sessions: 64,
    description: "Productor audiovisual con trabajos para Netflix y HBO",
  },
];

export const dynamic = 'force-dynamic'

const Expertos = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
                💡 Expertos
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Conecta con{" "}
              <span className="text-gradient">expertos</span>
              {" "}de la industria
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Agenda sesiones personalizadas con profesionales que han recorrido el
              camino que tú estás comenzando. Recibe mentoría, feedback y consejos prácticos.
            </p>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="default" size="sm">Todos</Button>
            <Button variant="outline" size="sm">Diseño</Button>
            <Button variant="outline" size="sm">Desarrollo</Button>
            <Button variant="outline" size="sm">Marketing</Button>
            <Button variant="outline" size="sm">Contenido</Button>
            <Button variant="outline" size="sm">Carrera</Button>
            <Button variant="outline" size="sm">Audiovisual</Button>
          </div>
        </div>
      </section>

      {/* Grid de expertos */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertos.map((experto, index) => {
              const Icon = experto.icon;
              return (
                <Card key={index} className="p-6 bg-card shadow-card hover:shadow-glow transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{experto.name}</h3>
                      <p className="text-sm text-muted-foreground">{experto.role}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {experto.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{experto.rating}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {experto.sessions} sesiones
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      {experto.category}
                    </span>
                  </div>

                  <Button className="w-full mt-6 group-hover:shadow-glow transition-all">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar sesión
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Cómo funciona la <span className="text-gradient">mentoría</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-bold">Elige tu experto</h3>
              <p className="text-muted-foreground">
                Navega por nuestro directorio y elige el experto que mejor se adapte a tus necesidades.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary">
                2
              </div>
              <h3 className="text-xl font-bold">Agenda una sesión</h3>
              <p className="text-muted-foreground">
                Selecciona el horario que mejor te funcione en el calendario del experto.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                3
              </div>
              <h3 className="text-xl font-bold">Recibe mentoría</h3>
              <p className="text-muted-foreground">
                Conéctate en una videollamada y recibe consejos personalizados para tu carrera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            ¿Quieres ser <span className="text-gradient">experto</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Si eres un profesional con experiencia y quieres ayudar a la próxima
            generación de creativos, únete a nuestro programa de expertos.
          </p>
          <Button size="xl" variant="secondary" className="shadow-glow">
            Aplicar como experto
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Expertos;
