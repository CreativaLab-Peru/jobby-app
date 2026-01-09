import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">
              Levely
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu talento merece ser visible
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/creativalab.pe/"
                rel="noopener noreferrer"
                target="_blank"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/creativalab-tech"
                rel="noopener noreferrer"
                target="_blank"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Crear CV
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Oportunidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Para */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Para</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/empresas"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Empresas
                </Link>
              </li>
              <li>
                <Link
                  href="/instituciones"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instituciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
            <div className="text-center md:text-left">© 2025 Levely - Todos los derechos reservados.</div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <Link
                href="/terminos-y-condiciones"
                className="underline hover:text-primary transition-colors text-center md:text-left"
              >
                Términos y condiciones
              </Link>
              <Link
                href="/politica-de-privacidad"
                className="underline hover:text-primary transition-colors text-center md:text-left"
              >
                Política de privacidad y Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
