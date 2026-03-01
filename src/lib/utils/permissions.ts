import type { SessionUser } from '@/lib/auth/session'

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === 'admin'
}

export function isOwner(user: SessionUser | null, resourceUserId: string): boolean {
  return user?.id === resourceUserId
}

export function canDelete(user: SessionUser | null, resourceUserId: string): boolean {
  return isAdmin(user) || isOwner(user, resourceUserId)
}
