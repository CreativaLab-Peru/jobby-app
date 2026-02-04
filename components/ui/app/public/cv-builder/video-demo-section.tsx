import { Play } from "lucide-react";

export function VideoDemoSection() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="headline-lg">Ve cómo funciona en acción</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Descubre lo fácil que es crear tu perfil profesional con nuestra plataforma
          </p>
        </div>

        {/* Video container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-lime/20 border border-border shadow-2xl">
            {/* Video placeholder - replace src with actual video URL */}
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
              <button className="group relative w-24 h-24 rounded-full bg-lime flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-lime/50 animate-ping" />
                <Play className="w-10 h-10 text-lime-foreground fill-lime-foreground ml-1" />
              </button>
            </div>
            
            {/* Placeholder text */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-sm text-muted-foreground">
                Video demo próximamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
