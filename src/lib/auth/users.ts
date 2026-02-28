import type { UserRole, Profile } from '@/types/database'

export interface HardcodedUser {
  id: string
  username: string
  password: string
  full_name: string
  avatar_url: string | null
  role: UserRole
}

export const HARDCODED_USERS: HardcodedUser[] = [
  {
    id: 'user-001',
    username: 'gema',
    password: 'gema123',
    full_name: 'Gema García',
    avatar_url: null,
    role: 'profesor',
  },
  {
    id: 'user-002',
    username: 'maria',
    password: 'maria123',
    full_name: 'María López',
    avatar_url: null,
    role: 'alumno',
  },
  {
    id: 'user-003',
    username: 'sofia',
    password: 'sofia123',
    full_name: 'Sofía Martín',
    avatar_url: null,
    role: 'alumno',
  },
  {
    id: 'user-004',
    username: 'laura',
    password: 'laura123',
    full_name: 'Laura Fernández',
    avatar_url: null,
    role: 'alumno',
  },
  {
    id: 'user-005',
    username: 'carmen',
    password: 'carmen123',
    full_name: 'Carmen Ruiz',
    avatar_url: null,
    role: 'admin',
  },
]

export function validateUser(username: string, password: string): HardcodedUser | null {
  const user = HARDCODED_USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  )
  return user || null
}

export function getUserById(id: string): HardcodedUser | null {
  return HARDCODED_USERS.find((u) => u.id === id) || null
}

export function getUserByUsername(username: string): HardcodedUser | null {
  return HARDCODED_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null
}

export function toProfile(user: HardcodedUser): Profile {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role,
    created_at: new Date().toISOString(),
  }
}
