import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import AnimatedBackgroundWrapper from '@/components/animated-background-wrapper'
import { Suspense } from 'react'
import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";

// Configura la fuente Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://joinlevely.com'),

  title: {
    default: 'Levely - Tu talento merece ser visible',
    template: '%s | Levely',
  },

  description: 'Levely es una plataforma potenciada con inteligencia artificial para hacer visible tu talento profesional y mejorar tus oportunidades laborales.',

  openGraph: {
    title: 'Levely - Tu talento merece ser visible',
    description:
      'Plataforma con inteligencia artificial para potenciar tu perfil profesional y mejorar tus oportunidades laborales.',
    url: 'https://joinlevely.com',
    siteName: 'Levely',
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Levely - Tu talento merece ser visible',
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
  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={null}>
          <AnimatedBackgroundWrapper />
        </Suspense>
        <TooltipProvider>
          <div className="relative z-10">{children}</div>
        </TooltipProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
