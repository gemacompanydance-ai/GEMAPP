import { NextResponse } from 'next/server'
import { authenticateUser, getSession, clearSession } from '@/lib/auth/session'

export async function GET() {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Usuario y contraseña requeridos' },
      { status: 400 }
    )
  }

  const user = await authenticateUser(username, password)

  if (!user) {
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    )
  }

  return NextResponse.json({ user })
}

export async function DELETE() {
  await clearSession()
  return NextResponse.json({ success: true })
}
