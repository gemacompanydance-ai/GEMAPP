export type UserRole = 'alumno' | 'profesor' | 'admin'

export type ReactionType =
  | 'fire'
  | 'heart'
  | 'star'
  | 'clap'
  | 'muscle'
  | 'sparkles'
  | 'rainbow'
  | 'butterfly'

export interface ReactionConfig {
  type: ReactionType
  emoji: string
  label: string
  color: string
}

export const REACTIONS: ReactionConfig[] = [
  { type: 'fire', emoji: '🔥', label: '¡Bravo!', color: 'text-orange-400' },
  { type: 'heart', emoji: '💜', label: 'Te amo', color: 'text-purple-400' },
  { type: 'star', emoji: '⭐', label: 'Estrella', color: 'text-yellow-400' },
  { type: 'clap', emoji: '👏', label: 'Aplausos', color: 'text-pink-400' },
  { type: 'muscle', emoji: '💪', label: 'Fuerza', color: 'text-cyan-400' },
  {
    type: 'sparkles',
    emoji: '✨',
    label: 'Brillante',
    color: 'text-yellow-300',
  },
  { type: 'rainbow', emoji: '🌈', label: 'Arcoíris', color: 'text-green-400' },
  {
    type: 'butterfly',
    emoji: '🦋',
    label: 'Mariposa',
    color: 'text-blue-400',
  },
]

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  week_number: number
  created_at: string
  profiles?: Profile | null
  reactions?: Reaction[]
  comments?: Comment[]
}

export interface Comment {
  id: string
  video_id: string
  user_id: string
  content: string
  emojis: string[] | null
  created_at: string
  profiles?: Pick<Profile, 'username' | 'avatar_url'> | null
}

export interface Reaction {
  id: string
  video_id: string
  user_id: string
  reaction_type: string
  created_at: string
  profiles?: Pick<Profile, 'username' | 'avatar_url'> | null
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
        }
      }
      videos: {
        Row: Video
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          week_number: number
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          week_number?: number
        }
      }
      comments: {
        Row: Comment
        Insert: {
          id?: string
          video_id: string
          user_id: string
          content: string
          emojis?: string[] | null
          created_at?: string
        }
        Update: {
          content?: string
          emojis?: string[] | null
        }
      }
      reactions: {
        Row: Reaction
        Insert: {
          id?: string
          video_id: string
          user_id: string
          reaction_type: string
          created_at?: string
        }
        Update: {
          reaction_type?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
