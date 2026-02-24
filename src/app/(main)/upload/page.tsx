import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VideoUpload } from '@/components/video/video-upload'

export default async function UploadPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Subir Coreografía 💃</h1>
        <p className="text-white/50 text-sm mt-1">
          Comparte tu progreso semanal con la academia
        </p>
      </div>

      <VideoUpload />
    </div>
  )
}
