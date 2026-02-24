'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'
import { Home, Upload, User, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useUser()

  const navItems = user
    ? [
        { href: '/feed', icon: Home, label: 'Inicio' },
        { href: '/upload', icon: Upload, label: 'Subir' },
        { href: '/profile', icon: User, label: 'Perfil' },
      ]
    : [
        { href: '/', icon: Home, label: 'Inicio' },
        { href: '/login', icon: LogIn, label: 'Entrar' },
      ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden backdrop-blur-xl bg-black/60 border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 transition-all',
                active ? 'text-pink-400' : 'text-white/40'
              )}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
