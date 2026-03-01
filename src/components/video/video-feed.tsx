'use client'

import { useState } from 'react'
import { useVideos } from '@/lib/hooks/use-videos'
import { TwitterFeedCard } from './twitter-feed-card'
import { getCurrentWeek, formatWeekLabel } from '@/lib/utils/week-utils'
import { NeonButton } from '@/components/ui/neon-button'
import { Loader2 } from 'lucide-react'

export function VideoFeed() {
  const currentWeek = getCurrentWeek()
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined)
  const { videos, loading, error } = useVideos(selectedWeek)

  const weekOptions = Array.from({ length: currentWeek }, (_, i) => currentWeek - i)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <NeonButton
          variant={selectedWeek === undefined ? 'pink' : 'ghost'}
          size="sm"
          onClick={() => setSelectedWeek(undefined)}
          className="flex-shrink-0"
        >
          Todas
        </NeonButton>
        {weekOptions.map((week) => (
          <NeonButton
            key={week}
            variant={selectedWeek === week ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setSelectedWeek(week)}
            className="flex-shrink-0"
          >
            Sem. {week}
          </NeonButton>
        ))}
      </div>

      {selectedWeek && (
        <p className="text-white/40 text-sm">
          {formatWeekLabel(selectedWeek)}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <p className="text-5xl">🎬</p>
          <p className="text-white/50 text-lg font-medium">
            {selectedWeek
              ? 'No hay videos esta semana todavía'
              : 'Aún no hay videos'}
          </p>
          <p className="text-white/30 text-sm">
            ¡Sé la primera en subir tu coreografía! ✨
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {videos.map((video, index) => (
          <TwitterFeedCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  )
}
