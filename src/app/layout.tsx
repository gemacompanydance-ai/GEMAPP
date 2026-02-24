import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { StarBackground } from '@/components/ui/star-background'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gema Company · Academia de Danza',
  description: 'Comparte tus coreografías semanales y conecta con tus compañeras de danza',
  keywords: ['danza', 'academia', 'coreografía', 'gema company'],
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#050510',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased min-h-dvh">
        <StarBackground />
        <div className="relative z-10">
          <Header />
          <main className="pt-16 pb-20 sm:pb-8 min-h-dvh">
            {children}
          </main>
          <MobileNav />
        </div>
      </body>
    </html>
  )
}
