'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import type { ClientUser } from '@/lib/auth/client'

export function useUser() {
  const [user, setUser] = useState<ClientUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth')
        const data = await res.json()

        if (data.user) {
          setUser(data.user)
          const supabase = createClient()
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
          if (profileData) {
            setProfile(profileData as Profile)
          } else {
            setProfile({
              id: data.user.id,
              username: data.user.username,
              full_name: data.user.full_name,
              avatar_url: data.user.avatar_url,
              role: data.user.role,
              created_at: new Date().toISOString(),
            } as Profile)
          }
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const signOut = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (!user) return
    const supabase = createClient()
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (profileData) {
      setProfile(profileData as Profile)
    }
  }

  return { user, profile, loading, signOut, refreshProfile }
}
