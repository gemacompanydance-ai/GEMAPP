'use client'

import { useState } from 'react'
import { ReactionBar } from '@/components/social/reaction-bar'
import type { Reaction, Comment } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

interface VideoInteractionsProps {
  videoId: string
  initialReactions: Reaction[]
  initialComments: Comment[]
}

export function VideoInteractions({
  videoId,
  initialReactions,
}: VideoInteractionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const supabase = createClient()

  const refetchReactions = async () => {
    const { data } = await supabase
      .from('reactions')
      .select('*')
      .eq('video_id', videoId)
    if (data) setReactions(data)
  }

  return (
    <ReactionBar
      videoId={videoId}
      reactions={reactions}
      onUpdate={refetchReactions}
    />
  )
}
