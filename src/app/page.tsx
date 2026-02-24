import Link from 'next/link'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/feed')
  }

  const features = [
    { emoji: '🎬', title: 'Sube tu coreografía', desc: 'Comparte tu video semanal con toda la academia' },
    { emoji: '🔥', title: 'Reacciona con emojis', desc: 'Anima a tus compañeras con 8 reacciones especiales' },
    { emoji: '💬', title: 'Comenta con amor', desc: 'Escribe mensajes motivacionales llenos de emojis' },
    { emoji: '⭐', title: 'Evoluciona cada semana', desc: 'Ve tu progreso y el de tus compañeras semana a semana' },
  ]

  return (
    <div className="relative overflow-hidden">
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-24 text-center space-y-8">
        <div className="space-y-4">
          <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase animate-pulse">
            ✦ Bienvenida a
          </p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
            <span className="gradient-text">GEMA</span>
            <br />
            <span className="text-white/90">SOCIAL</span>
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            Tu espacio para compartir, celebrar y crecer como bailarina 💃
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <NeonButton variant="pink" size="lg">
              🌟 Unirme a la academia
            </NeonButton>
          </Link>
          <Link href="/login">
            <NeonButton variant="ghost" size="lg">
              Ya tengo cuenta →
            </NeonButton>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-cyan-500/20 blur-3xl" />
          <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((f) => (
                <GlassCard key={f.title} className="p-4 text-center space-y-2">
                  <span className="text-3xl block">{f.emoji}</span>
                  <h3 className="text-white/90 font-bold text-sm">{f.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { value: '8', label: 'Reacciones' },
            { value: '∞', label: 'Comentarios' },
            { value: '52', label: 'Semanas' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-white/40 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
