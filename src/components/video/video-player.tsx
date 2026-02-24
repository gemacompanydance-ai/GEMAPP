'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title?: string
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">📡</span>
          <p className="text-white/50 text-sm text-center px-4">
            El servidor de videos no está disponible en este momento
          </p>
          <p className="text-white/30 text-xs">
            El video estará disponible cuando el PC esté encendido
          </p>
        </div>
      ) : (
        <video
          src={url}
          className="w-full h-full"
          controls
          onCanPlay={() => setReady(true)}
          onError={() => setError(true)}
          preload="metadata"
          style={{ display: ready ? 'block' : 'block' }}
        />
      )}
    </div>
  )
}
