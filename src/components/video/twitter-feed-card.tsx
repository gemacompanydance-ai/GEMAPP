'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar } from '@/components/ui/avatar'
import { REACTIONS } from '@/types/database'
import type { Video } from '@/types/database'
import { formatWeekLabel } from '@/lib/utils/week-utils'
import { MessageCircle, Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUser } from '@/lib/hooks/use-user'
import { useRouter } from 'next/navigation'

interface TwitterFeedCardProps {
  video: Video
  index?: number
}

export function TwitterFeedCard({ video, index = 0 }: TwitterFeedCardProps) {
  const { user } = useUser()
  const router = useRouter()
  const [showComments, setShowComments] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin'
  const isOwner = user?.id === video.user_id
  const canDeleteVideo = isAdmin || isOwner

  const reactionCounts = (video.reactions || []).reduce(
    (acc, r) => {
      acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topReactions = REACTIONS.filter((r) => reactionCounts[r.type] > 0).slice(0, 5)
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0)

  const sortedComments = [...(video.comments || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const previewComments = sortedComments.slice(0, 2)
  const commentCount = sortedComments.length

  const handleDeleteVideo = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Eliminar este video y todos sus comentarios?')) return
    const res = await fetch(`/api/videos/${video.id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  const handleDeleteComment = async (e: React.MouseEvent, commentId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Eliminar este comentario?')) return
    setDeletingCommentId(commentId)
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <GlassCard
        glow="violet"
        className="overflow-hidden border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
      >
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/video/${video.id}`}>
              <Avatar
                src={video.profiles?.avatar_url}
                alt={video.profiles?.username || 'Alumna'}
                size="md"
                className="cursor-pointer hover:ring-2 hover:ring-pink-500/50 transition-all"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm">
                  {video.profiles?.full_name || video.profiles?.username || 'Alumna'}
                </span>
                <span className="text-white/40 text-xs">
                  @{video.profiles?.username || 'alumna'}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/30 text-xs">
                  {formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/30 text-xs">
                <Calendar size={10} />
                <span>{formatWeekLabel(video.week_number)}</span>
              </div>
            </div>
            {canDeleteVideo && (
              <button
                onClick={handleDeleteVideo}
                className="p-1.5 rounded-full text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Eliminar video"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <Link href={`/video/${video.id}`} className="block group">
            <h3 className="font-bold text-white/90 group-hover:text-pink-300 transition-colors mb-2">
              {video.title}
            </h3>

            {video.description && (
              <p className="text-white/50 text-sm mb-3 leading-relaxed line-clamp-2">
                {video.description}
              </p>
            )}

            <div className="relative aspect-video bg-black/40 overflow-hidden rounded-xl mb-3">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-pink-900/40">
                  <span className="text-5xl">🎬</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-300 font-medium border border-pink-500/30">
                Sem. {video.week_number}
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between text-white/40 text-sm">
            <div className="flex items-center gap-4">
              {topReactions.length > 0 && (
                <span className="flex items-center gap-1">
                  {topReactions.map((r) => (
                    <span key={r.type} className="text-base">{r.emoji}</span>
                  ))}
                  <span className="text-xs ml-0.5">{totalReactions}</span>
                </span>
              )}
              <button
                onClick={() => setShowComments((v) => !v)}
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <MessageCircle size={15} />
                <span className="text-xs">{commentCount} comentarios</span>
                {commentCount > 0 && (
                  showComments ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                )}
              </button>
            </div>
            <Link
              href={`/video/${video.id}`}
              className="text-xs text-pink-400/60 hover:text-pink-400 transition-colors"
            >
              Ver video →
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-4 py-3 space-y-3">
                {sortedComments.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-2">
                    Sin comentarios aún ✨
                  </p>
                ) : (
                  <>
                    {(showComments ? sortedComments : previewComments).map((comment) => {
                      const canDeleteComment = isAdmin || user?.id === comment.user_id
                      return (
                        <div key={comment.id} className="flex gap-2.5">
                          <Avatar
                            src={comment.profiles?.avatar_url}
                            alt={comment.profiles?.username || 'Usuario'}
                            size="xs"
                            className="flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-pink-300 text-xs font-semibold">
                                {comment.profiles?.username || 'Alumna'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-white/20 text-xs">
                                  {formatDistanceToNow(new Date(comment.created_at), {
                                    addSuffix: true,
                                    locale: es,
                                  })}
                                </span>
                                {canDeleteComment && (
                                  <button
                                    onClick={(e) => handleDeleteComment(e, comment.id)}
                                    disabled={deletingCommentId === comment.id}
                                    className={`transition-colors ${
                                      isAdmin && user?.id !== comment.user_id
                                        ? 'text-red-500/50 hover:text-red-400'
                                        : 'text-white/20 hover:text-red-400'
                                    } disabled:opacity-40`}
                                    title="Eliminar comentario"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-white/70 text-xs mt-0.5 leading-relaxed break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <Link
                      href={`/video/${video.id}`}
                      className="block text-center text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors pt-1"
                    >
                      Comentar en este video →
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
