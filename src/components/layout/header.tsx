'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'
import { NeonButton } from '@/components/ui/neon-button'
import { Avatar } from '@/components/ui/avatar'
import { ServerStatus } from '@/components/ui/server-status'
import { LogOut, Upload, Home } from 'lucide-react'

export function Header() {
  const { user, profile, signOut } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            ✦ GEMA COMPANY
          </span>
          <span className="hidden sm:block text-xs text-white/40 font-medium tracking-widest uppercase mt-1">
            Dance Academy
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ServerStatus />

          {user ? (
            <>
              <Link href="/feed" className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                <Home size={16} />
                <span>Inicio</span>
              </Link>
              <Link href="/upload">
                <NeonButton variant="pink" size="sm">
                  <span className="flex items-center gap-1.5">
                    <Upload size={14} />
                    <span className="hidden sm:inline">Subir Video</span>
                  </span>
                </NeonButton>
              </Link>
              <Link href="/profile">
                <Avatar
                  src={profile?.avatar_url}
                  alt={profile?.username || profile?.full_name || 'Usuario'}
                  size="sm"
                  className="cursor-pointer hover:ring-2 hover:ring-pink-500/60 transition-all"
                />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link href="/login">
              <NeonButton variant="violet" size="sm">
                Entrar
              </NeonButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
