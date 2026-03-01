import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { avatar_url } = await request.json()

  if (!avatar_url) {
    return NextResponse.json({ error: 'URL de avatar requerida' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, avatar_url })
}

export async function DELETE() {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
