# ✦ GemaSocial — Gema Company Dance Academy

**Webapp Y2K-style** para alumnos de danza donde suben videos semanales de coreografías y se comentan con emojis y reacciones motivacionales.

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   VERCEL        │     │   SUPABASE      │     │   PC LOCAL      │
│   Next.js 16    │────▶│   PostgreSQL    │     │   Express.js    │
│   App Router    │     │   Auth          │     │   + Ngrok       │
│   Tailwind v4   │◀────│   Realtime      │◀────│   Videos        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🚀 Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4
- **Animaciones**: Framer Motion
- **Base de datos**: Supabase (PostgreSQL + Auth + Realtime)
- **Video Server**: Express.js (PC local) + Ngrok
- **Deploy**: Vercel

## 📦 Setup Frontend

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 3. Ejecutar en desarrollo
npm run dev
```

## 🗄️ Setup Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta `supabase/migrations/001_initial_schema.sql`
3. Copia tus credenciales a `.env.local`

## 🎬 Setup Video Server (PC Local)

```bash
cd video-server
npm install
cp .env.example .env
# Edita .env si necesitas cambiar el puerto

# Opción 1: Script automático con ngrok
chmod +x start.sh
./start.sh

# Opción 2: Solo servidor (sin ngrok)
node server.js
```

Después actualiza `NEXT_PUBLIC_VIDEO_SERVER_URL` en Vercel con tu URL de ngrok.

## 🌐 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

Variables de entorno necesarias en Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_VIDEO_SERVER_URL=
```

## ✨ Funcionalidades

- 🔐 **Auth**: Registro e inicio de sesión con Supabase Auth
- 📹 **Videos**: Subida de coreografías semanales (1 por semana por alumna)
- 🔥 **Reacciones**: 8 reacciones emoji motivacionales con animaciones
- 💬 **Comentarios**: Comentarios en tiempo real con emoji picker
- 📱 **Responsive**: Mobile-first con nav inferior para móvil
- 🌟 **Y2K Style**: Glassmorphism, colores neón, estrellas animadas
- 📡 **Estado del servidor**: Indicador de si el servidor de videos está online

## 📁 Estructura

```
src/
├── app/
│   ├── (auth)/login|register    # Páginas de autenticación
│   ├── (main)/upload|profile    # Subir videos, perfil
│   ├── (main)/video/[id]        # Vista individual de video
│   ├── feed/                    # Feed principal
│   └── api/                     # API Routes
├── components/
│   ├── ui/          # Componentes base (botones, cards, avatars)
│   ├── layout/      # Header, MobileNav
│   ├── video/       # VideoCard, VideoFeed, VideoUpload, VideoPlayer
│   └── social/      # ReactionBar, CommentSection
├── lib/
│   ├── supabase/    # Cliente browser/server, middleware
│   ├── hooks/       # useUser, useVideos
│   └── utils/       # cn(), week-utils
└── types/
    └── database.ts  # Tipos TypeScript
```

## 🎨 Diseño Y2K

- Fondo oscuro `#050510` con gradientes neón sutiles
- Glassmorphism cards con `backdrop-blur`
- Colores: Pink `#ff2d78`, Cyan `#00f5ff`, Violet `#a855f7`
- Estrellas animadas en canvas
- Texto con gradiente animado
- Fuente Inter + Orbitron para títulos
