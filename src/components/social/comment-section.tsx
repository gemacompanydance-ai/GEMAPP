'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { Avatar } from '@/components/ui/avatar'
import { NeonButton } from '@/components/ui/neon-button'
import type { Comment } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Send, SmilePlus } from 'lucide-react'

const QUICK_EMOJIS = ['💜', '🔥', '✨', '👏', '💪', '🌈', '🦋', '⭐', '🎉', '😍', '🤩', '❤️']

interface CommentSectionProps {
  videoId: string
  comments: Comment[]
  onUpdate?: () => void
}

export function CommentSection({ videoId, comments, onUpdate }: CommentSectionProps) {
  const { user, profile } = useUser()
  const supabase = createClient()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [content, setContent] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  const handleSubmit = async () => {
    if (!user || !content.trim()) return
    setSubmitting(true)

    try {
      const emojiMatches = content.match(
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
      )

      await supabase.from('comments').insert({
        video_id: videoId,
        user_id: user.id,
        content: content.trim(),
        emojis: emojiMatches || [],
      })

      setContent('')
      setShowEmojis(false)
      onUpdate?.()
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-4">
      <h3 className="text-white/80 font-bold text-lg flex items-center gap-2">
        <span>💬</span>
        Comentarios
        {comments.length > 0 && (
          <span className="text-white/40 text-sm font-normal">({comments.length})</span>
        )}
      </h3>

      {user ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar
              src={profile?.avatar_url}
              alt={profile?.username || 'Tú'}
              size="sm"
              className="flex-shrink-0 mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe algo inspirador... 💜"
                  rows={2}
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-pink-500/50 resize-none transition-all"
                />
              </div>

              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="w-9 h-9 text-xl rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`flex items-center gap-1.5 text-sm transition-colors px-2 py-1 rounded-lg ${
                    showEmojis ? 'text-pink-400 bg-pink-500/10' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <SmilePlus size={16} />
                  <span>Emojis</span>
                </button>

                <NeonButton
                  variant="cyan"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!content.trim() || submitting}
                >
                  <span className="flex items-center gap-1.5">
                    <Send size={14} />
                    {submitting ? 'Enviando...' : 'Comentar'}
                  </span>
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white/40 text-sm text-center py-3">
          Inicia sesión para comentar 💜
        </p>
      )}

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {sortedComments.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">
              Sé la primera en comentar ✨
            </p>
          ) : (
            sortedComments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-3"
              >
                <Avatar
                  src={comment.profiles?.avatar_url}
                  alt={comment.profiles?.username || 'Usuario'}
                  size="sm"
                  className="flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-pink-300 text-sm font-semibold">
                        {comment.profiles?.username || 'Alumna'}
                      </span>
                      <span className="text-white/30 text-xs">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
