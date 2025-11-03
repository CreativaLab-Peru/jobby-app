// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import AnimatedBackgroundWrapper from '@/components/animated-background-wrapper'
import { Suspense } from 'react'

// Configura la fuente Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Jobby - Tu talento merece ser visible',
  description: 'Jobby potenciado con inteligencia artificial',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-poppins">
        <Suspense fallback={null}>
          <AnimatedBackgroundWrapper />
        </Suspense>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}