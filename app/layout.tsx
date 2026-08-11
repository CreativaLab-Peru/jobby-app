import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import AnimatedBackgroundWrapper from '@/components/animated-background-wrapper'
import { Suspense } from 'react'
import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'

// Configura la fuente Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://joinlevely.com'),

  title: {
    default: 'Levely - Optimiza tu perfil para el mercado global',
    template: '%s | Levely',
  },

  description: 'Plataforma de empleabilidad con IA. Mejora tu perfil y haz match con oportunidades laborales en minutos.',

  openGraph: {
    title: 'Levely - Optimiza tu perfil para el mercado global',
    description:
      'Plataforma de empleabilidad con IA. Mejora tu perfil y haz match con oportunidades laborales en minutos.',
    url: 'https://joinlevely.com',
    siteName: 'Levely',
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Levely - Optimiza tu perfil para el mercado global',
    description:
      'Haz visible tu talento profesional con ayuda de inteligencia artificial.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const defaultTheme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AnimatedBackgroundWrapper />
          </Suspense>
          <TooltipProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
