import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'

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

export async function POST(request: Request) {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('videos')
    .insert({
      user_id: user.id,
      title: body.title,
      description: body.description,
      video_url: body.video_url,
      thumbnail_url: body.thumbnail_url,
      week_number: body.week_number,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
