-- ============================================
-- GemaSocial - Initial Schema (Hardcoded Users)
-- ============================================

-- Profiles table (independent, not linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'alumno' CHECK (role IN ('alumno', 'profesor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  description TEXT CHECK (char_length(description) <= 500),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  week_number INTEGER NOT NULL CHECK (week_number > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_week UNIQUE (user_id, week_number)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  emojis TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reactions table
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('fire', 'heart', 'star', 'clap', 'muscle', 'sparkles', 'rainbow', 'butterfly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_reaction UNIQUE (video_id, user_id, reaction_type)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_week_number ON public.videos(week_number);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON public.comments(video_id);
CREATE INDEX IF NOT EXISTS idx_reactions_video_id ON public.reactions(video_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON public.reactions(user_id);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Profiles can be inserted"
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Profiles can be updated"
  ON public.profiles FOR UPDATE USING (true);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON public.videos FOR SELECT USING (true);

CREATE POLICY "Videos can be inserted by anyone"
  ON public.videos FOR INSERT WITH CHECK (true);

CREATE POLICY "Videos can be updated by anyone"
  ON public.videos FOR UPDATE USING (true);

CREATE POLICY "Videos can be deleted by anyone"
  ON public.videos FOR DELETE USING (true);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Comments can be inserted by anyone"
  ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments can be deleted by anyone"
  ON public.comments FOR DELETE USING (true);

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone"
  ON public.reactions FOR SELECT USING (true);

CREATE POLICY "Reactions can be inserted by anyone"
  ON public.reactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Reactions can be deleted by anyone"
  ON public.reactions FOR DELETE USING (true);

-- ============================================
-- Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
