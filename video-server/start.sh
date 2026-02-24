#!/bin/bash
set -e

echo "🎬 Iniciando GemaSocial Video Server..."

if [ ! -f .env ]; then
  echo "⚠️  No se encontró .env, copiando desde .env.example..."
  cp .env.example .env
  echo "✏️  Por favor edita .env con tu URL de ngrok"
fi

if ! command -v ngrok &> /dev/null; then
  echo "❌ ngrok no está instalado. Descárgalo en https://ngrok.com/download"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "📦 Instalando dependencias..."
  npm install
fi

echo "🌐 Iniciando ngrok en puerto 3001..."
ngrok http 3001 --log=stdout > ngrok.log &
NGROK_PID=$!

sleep 5

NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); print([t['public_url'] for t in d['tunnels'] if t['proto']=='https'][0])" 2>/dev/null || echo "")

if [ -n "$NGROK_URL" ]; then
  echo "✅ Ngrok URL: $NGROK_URL"
  sed -i "s|NGROK_URL=.*|NGROK_URL=$NGROK_URL|" .env
  echo "💾 URL actualizada en .env"
else
  echo "⚠️  No se pudo obtener la URL de ngrok automáticamente"
  echo "   Actualiza NGROK_URL en .env manualmente"
fi

echo "🚀 Iniciando servidor de videos..."
node server.js

trap "kill $NGROK_PID 2>/dev/null" EXIT
