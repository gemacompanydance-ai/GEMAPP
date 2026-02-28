'use client'

import { useEffect, useState } from 'react'
import { getUserById, toProfile } from '@/lib/auth/users'
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
          const fullUser = getUserById(data.user.id)
          if (fullUser) {
            setProfile(toProfile(fullUser))
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

  return { user, profile, loading, signOut }
}
