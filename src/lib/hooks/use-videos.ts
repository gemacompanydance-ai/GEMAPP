'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Video } from '@/types/database'

export function useVideos(weekNumber?: number) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('videos')
      .select(
        `
        *,
        profiles (id, username, avatar_url, full_name),
        reactions (id, reaction_type, user_id),
        comments (id, content, created_at, user_id, profiles(username, avatar_url))
      `
      )
      .order('created_at', { ascending: false })

    if (weekNumber) {
      query = query.eq('week_number', weekNumber)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
    } else {
      setVideos(data || [])
    }

    setLoading(false)
  }, [supabase, weekNumber])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { videos, loading, error, refetch: fetchVideos }
}

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVideo = async () => {
      const { data } = await supabase
        .from('videos')
        .select(
          `
          *,
          profiles (id, username, avatar_url, full_name),
          reactions (id, reaction_type, user_id, profiles(username, avatar_url)),
          comments (id, content, emojis, created_at, user_id, profiles(username, avatar_url))
        `
        )
        .eq('id', id)
        .single()

      setVideo(data)
      setLoading(false)
    }

    fetchVideo()

    const channel = supabase
      .channel(`video-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
          filter: `video_id=eq.${id}`,
        },
        () => fetchVideo()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `video_id=eq.${id}`,
        },
        () => fetchVideo()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, id])

  return { video, loading }
}
