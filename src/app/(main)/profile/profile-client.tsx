'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import type { Profile } from '@/types/database'

interface ProfileClientProps {
  profile: Profile
  videoCount: number
  reactionCount: number
}

export function ProfileClient({ profile, videoCount, reactionCount }: ProfileClientProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)

  const handleAvatarUpdate = (newUrl: string | null) => {
    setAvatarUrl(newUrl)
  }

  return (
    <GlassCard glow="pink" className="p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <AvatarUpload
          currentAvatar={avatarUrl}
          username={profile.username}
          onUpdate={handleAvatarUpdate}
        />

        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl font-black text-white">
            {profile.full_name || 'Alumna'}
          </h1>
          <p className="text-pink-400 font-medium">@{profile.username}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs px-2.5 py-1 rounded-full capitalize">
              {profile.role || 'alumno'}
            </span>
          </div>
          <p className="text-white/30 text-xs">Toca el avatar para cambiar la foto</p>
        </div>

        <div className="sm:ml-auto flex gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-white">{videoCount}</div>
            <div className="text-white/40 text-xs">Videos</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{reactionCount}</div>
            <div className="text-white/40 text-xs">Reacciones</div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
