import { getSession, getProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar } from '@/components/ui/avatar'
import { VideoCard } from '@/components/video/video-card'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile()
  const supabase = await createClient()

  const { data: videos } = await supabase
    .from('videos')
    .select(
      `
      *,
      profiles (id, username, avatar_url, full_name),
      reactions (id, reaction_type, user_id),
      comments (id)
    `
    )
    .eq('user_id', user.id)
    .order('week_number', { ascending: false })

  const { data: reactionsReceived } = await supabase
    .from('reactions')
    .select('reaction_type, videos!inner(user_id)')
    .eq('videos.user_id', user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <GlassCard glow="pink" className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar
            src={profile?.avatar_url}
            alt={profile?.username || profile?.full_name || 'Alumna'}
            size="xl"
          />
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl font-black text-white">
              {profile?.full_name || 'Alumna'}
            </h1>
            <p className="text-pink-400 font-medium">@{profile?.username}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs px-2.5 py-1 rounded-full capitalize">
                {profile?.role || 'alumno'}
              </span>
            </div>
          </div>

          <div className="sm:ml-auto flex gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-white">{videos?.length || 0}</div>
              <div className="text-white/40 text-xs">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {reactionsReceived?.length || 0}
              </div>
              <div className="text-white/40 text-xs">Reacciones</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div>
        <h2 className="text-xl font-black text-white mb-4">🎬 Mis Coreografías</h2>

        {!videos || videos.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <p className="text-3xl">💃</p>
            <p className="text-white/50">Aún no has subido ningún video</p>
            <a href="/upload" className="text-pink-400 text-sm hover:text-pink-300 transition-colors">
              Subir mi primera coreografía →
            </a>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
