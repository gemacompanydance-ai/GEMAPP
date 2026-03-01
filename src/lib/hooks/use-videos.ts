'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Video } from '@/types/database'

// Get date 7 days ago
function getSevenDaysAgo(): string {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const supabase = createClient()
  const PAGE_SIZE = 10

  const fetchVideos = useCallback(async (pageNum = 0, append = false) => {
    if (pageNum === 0) {
      setLoading(true)
    }
    setError(null)

    const sevenDaysAgo = getSevenDaysAgo()

    const { data, error } = await supabase
      .from('videos')
      .select(
        `
        *,
        profiles (id, username, avatar_url, full_name),
        reactions (id, reaction_type, user_id),
        comments (id, content, created_at, user_id, profiles(username, avatar_url))
      `
      )
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    if (error) {
      setError(error.message)
    } else {
      const newVideos = data || []
      if (append) {
        setVideos(prev => [...prev, ...newVideos])
      } else {
        setVideos(newVideos)
      }
      setHasMore(newVideos.length === PAGE_SIZE)
    }

    setLoading(false)
  }, [supabase])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchVideos(nextPage, true)
    }
  }, [loading, hasMore, page, fetchVideos])

  // Initial load - use a ref to track if we've loaded
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      fetchVideos(0, false)
    }
  }, [fetchVideos])

  const refetch = useCallback(() => {
    setPage(0)
    fetchVideos(0, false)
  }, [fetchVideos])

  return { videos, loading, error, hasMore, loadMore, refetch }
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
