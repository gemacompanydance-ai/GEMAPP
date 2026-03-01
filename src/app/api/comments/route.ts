import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createClient()
  const { videoId, content, emojis } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 })
  }

  if (content.length > 500) {
    return NextResponse.json({ error: 'El comentario es demasiado largo' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      video_id: videoId,
      user_id: user.id,
      content: content.trim(),
      emojis: emojis || [],
    })
    .select(`*, profiles (username, avatar_url)`)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
