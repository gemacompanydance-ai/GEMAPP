import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canDelete } from '@/lib/utils/permissions'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabase = await createClient()

  const { data: comment } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!comment) {
    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 })
  }

  if (!canDelete(user, comment.user_id)) {
    return NextResponse.json({ error: 'Sin permisos para eliminar este comentario' }, { status: 403 })
  }

  const { error } = await supabase.from('comments').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
