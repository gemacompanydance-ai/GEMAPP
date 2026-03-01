'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Comment } from '@/types/database'

interface ProfileCommentsProps {
  initialComments: Comment[]
}

export function ProfileComments({ initialComments }: ProfileCommentsProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (commentId: string) => {
    if (!confirm('¿Eliminar este comentario?')) return
    setDeletingId(commentId)

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
        router.refresh()
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-black text-white mb-4">💬 Mis Comentarios</h2>

      {comments.length === 0 ? (
        <GlassCard className="p-8 text-center space-y-2">
          <p className="text-3xl">💬</p>
          <p className="text-white/50">Aún no has comentado en ningún video</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const videoData = comment.videos as { id: string; title: string } | null
            return (
              <GlassCard key={comment.id} glow="cyan" className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm leading-relaxed break-words">
                      {comment.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {videoData && (
                        <a
                          href={`/video/${videoData.id}`}
                          className="text-pink-400 text-xs hover:text-pink-300 transition-colors"
                        >
                          En: {videoData.title} →
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-white/30 text-xs">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-40"
                          title="Eliminar comentario"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
