'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '@/components/ui/avatar'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Camera, X, Loader2 } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string | null
  username: string
  onUpdate: (newUrl: string | null) => void
}

export function AvatarUpload({ currentAvatar, username, onUpdate }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar 2MB')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!preview) return
    setUploading(true)
    setError(null)

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: preview }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al guardar')
        return
      }

      onUpdate(preview)
      setIsOpen(false)
      setPreview(null)
    } catch {
      setError('Error de conexión')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    setUploading(true)
    setError(null)

    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE' })

      if (!res.ok) {
        setError('Error al eliminar')
        return
      }

      onUpdate(null)
      setIsOpen(false)
      setPreview(null)
    } catch {
      setError('Error de conexión')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="relative inline-block">
        <Avatar src={currentAvatar} alt={username} size="xl" />
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera size={20} className="text-white" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <GlassCard glow="pink" className="p-6 w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">Foto de perfil</h3>
                  <button
                    onClick={() => { setIsOpen(false); setPreview(null); setError(null) }}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex justify-center">
                  <Avatar
                    src={preview || currentAvatar}
                    alt={username}
                    size="xl"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col gap-2">
                  <NeonButton
                    variant="pink"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Camera size={14} />
                      Elegir foto
                    </span>
                  </NeonButton>

                  {preview && (
                    <NeonButton
                      variant="cyan"
                      size="sm"
                      onClick={handleSave}
                      disabled={uploading}
                      className="w-full"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : null}
                        {uploading ? 'Guardando...' : 'Guardar foto'}
                      </span>
                    </NeonButton>
                  )}

                  {currentAvatar && !preview && (
                    <NeonButton
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      disabled={uploading}
                      className="w-full text-red-400 hover:text-red-300"
                    >
                      {uploading ? 'Eliminando...' : 'Eliminar foto'}
                    </NeonButton>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
