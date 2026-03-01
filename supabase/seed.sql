-- Seed data for GemaSocial (Hardcoded Users)
-- Run this in Supabase SQL Editor after initial schema

-- Insert hardcoded users
INSERT INTO public.profiles (id, username, full_name, role) VALUES
  ('user-001', 'gema', 'Gema García', 'admin'),
  ('user-002', 'maria', 'María López', 'alumno'),
  ('user-003', 'sofia', 'Sofía Martín', 'alumno'),
  ('user-004', 'laura', 'Laura Fernández', 'alumno'),
  ('user-005', 'carmen', 'Carmen Ruiz', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Example videos (optional, for testing)
-- INSERT INTO public.videos (user_id, title, description, video_url, week_number) VALUES
--   ('user-002', 'Mi primera coreografía', '¡Semana 1 completada!', 'https://example.ngrok.io/videos/sample.mp4', 1),
--   ('user-003', 'Coreografía Hip Hop', 'Trabajando el flow', 'https://example.ngrok.io/videos/sample2.mp4', 1);
