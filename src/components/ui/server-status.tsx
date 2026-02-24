'use client'

import { useEffect, useState } from 'react'

export function ServerStatus() {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      const videoServerUrl = process.env.NEXT_PUBLIC_VIDEO_SERVER_URL
      if (!videoServerUrl) {
        setOnline(false)
        return
      }
      try {
        const res = await fetch(`${videoServerUrl}/health`, {
          signal: AbortSignal.timeout(3000),
        })
        setOnline(res.ok)
      } catch {
        setOnline(false)
      }
    }

    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  if (online === null) return null

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`w-2 h-2 rounded-full animate-pulse ${online ? 'bg-lime-400' : 'bg-red-400'}`}
      />
      <span className={online ? 'text-lime-300' : 'text-red-300'}>
        Videos {online ? 'online' : 'offline'}
      </span>
    </div>
  )
}
