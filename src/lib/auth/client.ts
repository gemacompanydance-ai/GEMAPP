import { getUserById, toProfile, type HardcodedUser } from './users'
import type { Profile } from '@/types/database'

const SESSION_STORAGE_KEY = 'gema_user'

export interface ClientUser {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  role: string
}

function hardcodedToClientUser(user: HardcodedUser): ClientUser {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role,
  }
}

export function getStoredUser(): ClientUser | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as ClientUser
    const user = getUserById(parsed.id)
    return user ? hardcodedToClientUser(user) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: ClientUser): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

export function getClientProfile(): Profile | null {
  const clientUser = getStoredUser()
  if (!clientUser) return null

  const user = getUserById(clientUser.id)
  return user ? toProfile(user) : null
}
