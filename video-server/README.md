# 🎬 GemaSocial Video Server

Servidor local Express para almacenar y servir los videos de las alumnas de Gema Company.

## Requisitos

- Node.js 18+
- [ngrok](https://ngrok.com/download) instalado y con cuenta gratuita

## Instalación

```bash
cd video-server
npm install
cp .env.example .env
```

Edita `.env` con tu configuración:

```env
PORT=3001
NGROK_URL=https://tu-id.ngrok.io   # se actualiza automáticamente con start.sh
ALLOWED_ORIGINS=http://localhost:3000,https://tu-app.vercel.app
```

## Iniciar

### Opción 1: Script automático (recomendado)

```bash
chmod +x start.sh
./start.sh
```

Este script:
1. Inicia ngrok en el puerto 3001
2. Detecta la URL pública automáticamente
3. Actualiza el `.env` con la URL
4. Inicia el servidor de Express

### Opción 2: Manual

```bash
# Terminal 1: iniciar ngrok
ngrok http 3001

# Terminal 2: copiar la URL https de ngrok a .env y luego:
node server.js
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| POST | `/api/upload` | Subir video (multipart/form-data, campo: `video`) |
| GET | `/videos/:filename` | Servir video (con soporte de range requests) |
| GET | `/api/videos` | Listar todos los videos almacenados |

## Variables en Vercel

Después de iniciar el servidor y obtener la URL de ngrok, actualiza en Vercel:

```
NEXT_PUBLIC_VIDEO_SERVER_URL=https://tu-id.ngrok.io
```

## ⚠️ Consideraciones

- **Ngrok gratuito**: La URL cambia cada vez que reinicias. Actualiza `NEXT_PUBLIC_VIDEO_SERVER_URL` en Vercel cada vez o usa un plan de pago con dominio fijo.
- **Almacenamiento**: Los videos se guardan en `uploads/`. Asegúrate de tener suficiente espacio en disco.
- **Límite**: Máximo 500MB por video.
- **Cuando el PC está apagado**: Los videos no estarán disponibles para reproducir, pero los metadatos en Supabase sí.
