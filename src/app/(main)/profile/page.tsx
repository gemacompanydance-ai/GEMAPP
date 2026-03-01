import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { VideoCard } from '@/components/video/video-card'
import { createClient } from '@/lib/supabase/server'
import { ProfileClient } from './profile-client'
import { ProfileComments } from './profile-comments'
import type { Profile, UserRole, Comment } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
    .order('created_at', { ascending: false })

  const { data: reactionsReceived } = await supabase
    .from('reactions')
    .select('reaction_type, videos!inner(user_id)')
    .eq('videos.user_id', user.id)

  const { data: myCommentsData } = await supabase
    .from('comments')
    .select('id, content, created_at, video_id, user_id, videos(id, title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const profile: Profile = profileData || {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role as UserRole,
    created_at: new Date().toISOString(),
  }

  const myComments: Comment[] = (myCommentsData || []).map(c => {
    // Handle Supabase joined relation which returns an array
    const videoArray = c.videos as unknown as [{ id: string; title: string }] | null
    const videoData = videoArray && Array.isArray(videoArray) ? videoArray[0] : null

    return {
      id: c.id,
      video_id: c.video_id,
      user_id: c.user_id,
      content: c.content,
      created_at: c.created_at,
      emojis: [],
      profiles: { username: user.username, avatar_url: user.avatar_url },
      videos: videoData || null
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ProfileClient
        profile={profile}
        videoCount={videos?.length || 0}
        reactionCount={reactionsReceived?.length || 0}
      />

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

      <ProfileComments initialComments={myComments} />
    </div>
  )
}
