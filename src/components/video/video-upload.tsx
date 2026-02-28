'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { getCurrentWeek, formatWeekLabel } from '@/lib/utils/week-utils'
import { Upload, Film, CheckCircle, AlertCircle, X } from 'lucide-react'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']

export function VideoUpload() {
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const currentWeek = getCurrentWeek()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Solo se aceptan archivos MP4, WebM, MOV o AVI')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('El archivo no puede superar los 500MB')
      return
    }

    setError(null)
    setFile(selectedFile)

    const url = URL.createObjectURL(selectedFile)
    setPreview(url)

    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleUpload = async () => {
    if (!user || !file || !title.trim()) return

    setUploading(true)
    setError(null)
    setProgress(10)

    try {
      const videoServerUrl = process.env.NEXT_PUBLIC_VIDEO_SERVER_URL
      if (!videoServerUrl) {
        throw new Error('Servidor de videos no configurado')
      }

      const formData = new FormData()
      formData.append('video', file)
      formData.append('userId', user.id)

      setProgress(30)

      const uploadRes = await fetch(`${videoServerUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}))
        throw new Error(err.message || 'Error al subir el video al servidor')
      }

      const { videoUrl } = await uploadRes.json()
      setProgress(70)

      const { data: existing } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_number', currentWeek)
        .single()

      if (existing) {
        throw new Error('Ya subiste un video esta semana. Solo se permite uno por semana.')
      }

      const { error: dbError } = await supabase.from('videos').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        video_url: videoUrl,
        week_number: currentWeek,
      })

      if (dbError) throw new Error(dbError.message)

      setProgress(100)
      setSuccess(true)

      setTimeout(() => router.push('/feed'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (success) {
    return (
      <GlassCard glow="cyan" className="p-8 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-black text-white">¡Video subido! 🎉</h2>
        <p className="text-white/60">Redirigiendo al feed...</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard glow="pink" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Subir Coreografía</h2>
          <p className="text-white/50 text-sm mt-0.5">
            {formatWeekLabel(currentWeek)}
          </p>
        </div>
        <span className="text-3xl">💃</span>
      </div>

      <div
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          file
            ? 'border-cyan-500/50 bg-cyan-500/5'
            : 'border-white/20 hover:border-pink-500/50 hover:bg-pink-500/5 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                <span className="text-white/80 text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile() }}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {preview && (
              <video
                src={preview}
                className="w-full rounded-lg aspect-video object-cover bg-black"
                controls
                preload="metadata"
              />
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Upload className="w-10 h-10 text-white/30 mx-auto" />
            <p className="text-white/50 font-medium">
              Click para seleccionar video
            </p>
            <p className="text-white/30 text-xs">
              MP4, WebM, MOV · Máx. 500MB
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-white/70 text-sm font-medium block mb-1.5">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Coreografía Semana 5 - Hip Hop"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-pink-500/60 focus:bg-white/8 transition-all"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-1.5">
            Descripción (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuéntanos sobre tu coreografía..."
            rows={3}
            maxLength={500}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-pink-500/60 resize-none transition-all"
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/50">
            <span>Subiendo...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <NeonButton
        variant="pink"
        size="lg"
        onClick={handleUpload}
        disabled={!file || !title.trim() || uploading || !user}
        className="w-full justify-center"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Subiendo {progress}%...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload size={18} />
            Subir Coreografía
          </span>
        )}
      </NeonButton>
    </GlassCard>
  )
}
