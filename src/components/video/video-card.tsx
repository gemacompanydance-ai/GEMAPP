'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar } from '@/components/ui/avatar'
import { REACTIONS } from '@/types/database'
import type { Video } from '@/types/database'
import { formatWeekLabel } from '@/lib/utils/week-utils'
import { MessageCircle, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface VideoCardProps {
  video: Video
  index?: number
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  const reactionCounts = (video.reactions || []).reduce(
    (acc, r) => {
      acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topReactions = REACTIONS.filter(
    (r) => reactionCounts[r.type] > 0
  ).slice(0, 4)

  const totalReactions = Object.values(reactionCounts).reduce(
    (a, b) => a + b,
    0
  )
  const commentCount = (video.comments || []).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/video/${video.id}`}>
        <GlassCard
          glow="violet"
          className="group overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
        >
          <div className="relative aspect-video bg-black/40 overflow-hidden">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-pink-900/40">
                <span className="text-4xl">🎬</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1" />
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-300 font-medium border border-pink-500/30">
              Sem. {video.week_number}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-white/90 group-hover:text-pink-300 transition-colors line-clamp-1 mb-1">
              {video.title}
            </h3>

            {video.description && (
              <p className="text-white/50 text-sm line-clamp-2 mb-3">
                {video.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={video.profiles?.avatar_url}
                  alt={video.profiles?.username || 'Usuario'}
                  size="xs"
                />
                <span className="text-white/60 text-sm font-medium">
                  {video.profiles?.username || 'Alumna'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/40 text-sm">
                {topReactions.length > 0 && (
                  <span className="flex items-center gap-1">
                    {topReactions.map((r) => (
                      <span key={r.type} className="text-base">
                        {r.emoji}
                      </span>
                    ))}
                    <span className="text-xs">{totalReactions}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {commentCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2 text-white/30 text-xs">
              <Calendar size={11} />
              <span>
                {formatDistanceToNow(new Date(video.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
