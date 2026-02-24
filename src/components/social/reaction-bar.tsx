'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { REACTIONS, type ReactionType, type Reaction } from '@/types/database'
import { cn } from '@/lib/utils/cn'

interface ReactionBarProps {
  videoId: string
  reactions: Reaction[]
  onUpdate?: () => void
}

export function ReactionBar({ videoId, reactions, onUpdate }: ReactionBarProps) {
  const { user } = useUser()
  const supabase = createClient()
  const [loading, setLoading] = useState<ReactionType | null>(null)
  const [burst, setBurst] = useState<ReactionType | null>(null)

  const reactionCounts = reactions.reduce(
    (acc, r) => {
      acc[r.reaction_type as ReactionType] = (acc[r.reaction_type as ReactionType] || 0) + 1
      return acc
    },
    {} as Record<ReactionType, number>
  )

  const userReactions = new Set(
    reactions.filter((r) => r.user_id === user?.id).map((r) => r.reaction_type)
  )

  const handleReaction = async (type: ReactionType) => {
    if (!user) return
    setLoading(type)

    try {
      const hasReacted = userReactions.has(type)

      if (hasReacted) {
        await supabase
          .from('reactions')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id)
          .eq('reaction_type', type)
      } else {
        await supabase.from('reactions').insert({
          video_id: videoId,
          user_id: user.id,
          reaction_type: type,
        })
        setBurst(type)
        setTimeout(() => setBurst(null), 600)
      }

      onUpdate?.()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const count = reactionCounts[reaction.type] || 0
        const hasReacted = userReactions.has(reaction.type)
        const isBursting = burst === reaction.type

        return (
          <div key={reaction.type} className="relative">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleReaction(reaction.type)}
              disabled={!user || loading === reaction.type}
              title={reaction.label}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                hasReacted
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                  : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10 hover:border-white/30 hover:text-white'
              )}
            >
              <span className="text-base leading-none">{reaction.emoji}</span>
              {count > 0 && (
                <span className={cn('text-xs', hasReacted ? 'text-pink-300' : 'text-white/50')}>
                  {count}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {isBursting && (
                <motion.div
                  initial={{ scale: 0, opacity: 1, y: 0 }}
                  animate={{ scale: 2, opacity: 0, y: -30 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none text-xl"
                >
                  {reaction.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
