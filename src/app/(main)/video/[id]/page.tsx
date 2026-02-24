import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar } from '@/components/ui/avatar'
import { VideoPlayer } from '@/components/video/video-player'
import { ReactionBar } from '@/components/social/reaction-bar'
import { CommentSection } from '@/components/social/comment-section'
import { formatWeekLabel } from '@/lib/utils/week-utils'
import { VideoInteractions } from '@/components/video/video-interactions'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: video } = await supabase
    .from('videos')
    .select('title, description, profiles(username)')
    .eq('id', id)
    .single()

  if (!video) return { title: 'Video · Gema Company' }

  return {
    title: `${video.title} · Gema Company`,
    description: video.description || `Coreografía de ${(video.profiles as unknown as { username: string })?.username}`,
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: video } = await supabase
    .from('videos')
    .select(
      `
      *,
      profiles (id, username, avatar_url, full_name),
      reactions (id, reaction_type, user_id),
      comments (id, content, emojis, created_at, user_id, profiles(username, avatar_url))
    `
    )
    .eq('id', id)
    .single()

  if (!video) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer url={video.video_url} title={video.title} />

          <GlassCard glow="violet" className="p-5 space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-white">{video.title}</h1>
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Calendar size={12} />
                <span>{formatWeekLabel(video.week_number)}</span>
                <span>·</span>
                <span>
                  {formatDistanceToNow(new Date(video.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                src={video.profiles?.avatar_url}
                alt={video.profiles?.username || 'Alumna'}
                size="md"
              />
              <div>
                <p className="text-white font-semibold text-sm">
                  {video.profiles?.full_name || video.profiles?.username}
                </p>
                <p className="text-pink-400 text-xs">@{video.profiles?.username}</p>
              </div>
            </div>

            {video.description && (
              <p className="text-white/60 text-sm leading-relaxed">
                {video.description}
              </p>
            )}
          </GlassCard>

          <GlassCard glow="pink" className="p-5">
            <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
              <span>✨</span> Reacciones
            </h3>
            <VideoInteractions
              videoId={video.id}
              initialReactions={video.reactions || []}
              initialComments={video.comments || []}
            />
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard glow="cyan" className="p-5 sticky top-20">
            <CommentSection
              videoId={video.id}
              comments={video.comments || []}
            />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
