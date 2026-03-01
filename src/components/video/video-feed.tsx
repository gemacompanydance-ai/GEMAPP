'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useVideos } from '@/lib/hooks/use-videos'
import { TwitterFeedCard } from './twitter-feed-card'
import { NeonButton } from '@/components/ui/neon-button'
import { Loader2 } from 'lucide-react'

export function VideoFeed() {
  const { videos, loading, error, hasMore, loadMore } = useVideos()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !loading) {
        loadMore()
      }
    },
    [hasMore, loading, loadMore]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">
          Videos de los últimos 7 días
        </p>
      </div>

      {loading && videos.length === 0 && (
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
            No hay videos en los últimos 7 días
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

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {loading && videos.length > 0 && (
          <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
        )}
        {!loading && hasMore && videos.length > 0 && (
          <NeonButton variant="ghost" size="sm" onClick={loadMore}>
            Cargar más
          </NeonButton>
        )}
        {!hasMore && videos.length > 0 && (
          <p className="text-white/30 text-sm">No hay más videos</p>
        )}
      </div>
    </div>
  )
}
