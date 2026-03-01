'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface VideoPageActionsProps {
  videoId: string
}

export function VideoPageActions({ videoId }: VideoPageActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este video y todos sus comentarios? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/videos/${videoId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/feed')
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all text-xs font-medium disabled:opacity-50"
      title="Eliminar video"
    >
      <Trash2 size={13} />
      {deleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
