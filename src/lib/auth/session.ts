import { cookies } from 'next/headers'
import { validateUser, getUserById, toProfile, type HardcodedUser } from './users'
import type { Profile } from '@/types/database'

const SESSION_COOKIE_NAME = 'gema_session'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 días

export interface SessionUser {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  role: string
}

function userToSessionUser(user: HardcodedUser): SessionUser {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role,
  }
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!userId) return null

  const user = getUserById(userId)
  return user ? userToSessionUser(user) : null
}

export async function getProfile(): Promise<Profile | null> {
  const session = await getSession()
  if (!session) return null

  const user = getUserById(session.id)
  return user ? toProfile(user) : null
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function authenticateUser(username: string, password: string): Promise<SessionUser | null> {
  const user = validateUser(username, password)
  if (!user) return null

  await createSession(user.id)
  return userToSessionUser(user)
}
