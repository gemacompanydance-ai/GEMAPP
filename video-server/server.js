require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3001
const UPLOAD_DIR = path.join(__dirname, 'uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://gemasocial.vercel.app']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o.trim()))) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
  })
)

app.use(express.json())

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo MP4, WebM, MOV, AVI.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se recibió ningún archivo' })
  }

  const baseUrl = process.env.NGROK_URL || `http://localhost:${PORT}`
  const videoUrl = `${baseUrl}/videos/${req.file.filename}`

  console.log(`[UPLOAD] ${req.file.originalname} → ${req.file.filename} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`)

  res.json({
    videoUrl,
    filename: req.file.filename,
    size: req.file.size,
  })
})

app.use('/videos', express.static(UPLOAD_DIR, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
    }
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext])
    }
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=31536000')
  },
}))

app.get('/api/videos', (_req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR).filter((f) =>
    ['.mp4', '.webm', '.mov', '.avi'].includes(path.extname(f).toLowerCase())
  )
  const baseUrl = process.env.NGROK_URL || `http://localhost:${PORT}`
  const videos = files.map((f) => ({
    filename: f,
    url: `${baseUrl}/videos/${f}`,
    size: fs.statSync(path.join(UPLOAD_DIR, f)).size,
    created: fs.statSync(path.join(UPLOAD_DIR, f)).birthtime,
  }))
  res.json(videos)
})

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'El archivo supera los 500MB permitidos' })
  }
  res.status(500).json({ message: err.message || 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`\n🎬 GemaSocial Video Server corriendo en http://localhost:${PORT}`)
  console.log(`📁 Carpeta de uploads: ${UPLOAD_DIR}`)
  console.log(`\n¡Recuerda configurar NGROK_URL en .env cuando uses ngrok!\n`)
})
