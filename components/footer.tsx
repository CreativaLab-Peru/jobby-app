import Link from "next/link";
import { InstagramIcon, LinkedinIcon } from "lucide-react";

const footerLinks = {
  Producto: [
    { name: "CV Builder", href: "/cv-builder" },
    { name: "Career Accelerator", href: "/career-accelerator" },
    { name: "News letter", href: "/newsletter" },
    //{ name: "Resources", href: "/resources" },
  ],
  Empresa: [
    { name: "Partners", href: "/partners" },
    //{ name: "Empresas", href: "/empresas" },
  ],
  Legal: [
    { name: "Términos y Condiciones", href: "/terminos-y-condiciones" },
    { name: "Política de Privacidad", href: "/politica-de-privacidad" },
  ],
};

export function Footer() {
  return (
    <footer className="py-32 bg-white dark:bg-background text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight">
                Levely
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Optimiza tu perfil profesional y accede a oportunidades alineadas con tu potencial.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 space-y-4">
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com/joinlevely/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/joinlevely/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
            Respaldado por Proinnóvate del Ministerio de la Producción
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Levely. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
