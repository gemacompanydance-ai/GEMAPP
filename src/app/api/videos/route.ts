import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const url = new URL(request.url)
  const weekNumber = url.searchParams.get('week')

  let query = supabase
    .from('videos')
    .select(
      `
      *,
      profiles (id, username, avatar_url, full_name),
      reactions (id, reaction_type, user_id),
      comments (id)
    `
    )
    .order('created_at', { ascending: false })

  if (weekNumber) {
    query = query.eq('week_number', parseInt(weekNumber))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
