import { VideoFeed } from '@/components/video/video-feed'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-black text-white">
          ✦ Feed de Coreografías
        </h1>
        <p className="text-white/50 text-sm">
          Descubre las últimas coreografías de la academia
        </p>
      </div>

      <VideoFeed />
    </div>
  )
}
