import {getCompanyConfByNameAction} from "@/features/company/actions/get-company-conf-by-name";
import {redirect} from "next/navigation";
import {hexToHslComponents} from "@/lib/utils/colors";
import {Metadata} from "next";
import {ThemeSync} from "@/components/theme-sync";
import {SidebarProvider} from "@/components/ui/sidebar";

interface CompanyLayoutProps {
  params: Promise<{
    companyName: string;
  }>,
  children: React.ReactNode;
}

/**
 * Genera la metadata dinámica basada en la configuración de la empresa.
 * Next.js deduplica las solicitudes fetch/actions automáticamente si se llaman con los mismos parámetros.
 */
export async function generateMetadata({params}: Omit<CompanyLayoutProps, "children">): Promise<Metadata> {
  const {companyName} = await params;
  const companyConfig = await getCompanyConfByNameAction(companyName);

  if (!companyConfig) {
    return {
      title: "Empresa no encontrada | Levely",
    };
  }

  // Personalización total de la marca en la pestaña del navegador
  return {
    title: {
      default: companyConfig.name,
      template: `%s | ${companyConfig.name}`,
    },
    description: `Panel de acceso exclusivo para miembros de ${companyConfig.name}.`,
    icons: {
      // Si guardas el logo o un icono específico en la config, úsalo aquí
      icon: companyConfig.logoUrl || "/favicon.ico",
    },
    openGraph: {
      title: companyConfig.name,
      description: `Únete a la plataforma de ${companyConfig.name}`,
      type: "website",
      images: companyConfig.logoUrl ? [{url: companyConfig.logoUrl}] : [],
    },
    // Evita que los motores de búsqueda indexen páginas de login/onboarding genéricas si lo prefieres
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function CompanyColorLayout({children, params}: CompanyLayoutProps) {
  const {companyName} = await params;
  const companyConfig = await getCompanyConfByNameAction(companyName);

  if (!companyConfig) redirect(`/`);

  // Convertimos los hex de la DB a componentes HSL que tu CSS espera
  const primaryHsl = hexToHslComponents(companyConfig.primaryColor);
  const secondaryHsl = hexToHslComponents(companyConfig.secondaryColor);

  let style = {}

  if (primaryHsl) {
    style["--primary"] = primaryHsl;
    style["--accent"] = primaryHsl;
    style["--sidebar-primary"] = primaryHsl;
    style["--ring"] = primaryHsl;
  }

  if (secondaryHsl) {
    style["--secondary"] = secondaryHsl;
    style["--sidebar-accent"] = secondaryHsl;
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={style as React.CSSProperties}
    >
      <SidebarProvider>
        <ThemeSync/>
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </div>
  );
}
