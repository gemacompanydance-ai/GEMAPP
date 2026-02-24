import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ReactionType } from '@/types/database'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { videoId, reactionType } = (await request.json()) as {
    videoId: string
    reactionType: ReactionType
  }

  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', user.id)
    .eq('reaction_type', reactionType)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ action: 'removed' })
  } else {
    const { error } = await supabase.from('reactions').insert({
      video_id: videoId,
      user_id: user.id,
      reaction_type: reactionType,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ action: 'added' })
  }
}
