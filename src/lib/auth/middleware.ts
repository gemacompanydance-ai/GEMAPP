import { NextResponse, type NextRequest } from 'next/server'
import { getUserById } from './users'

const SESSION_COOKIE_NAME = 'gema_session'

export async function updateSession(request: NextRequest) {
  const userId = request.cookies.get(SESSION_COOKIE_NAME)?.value

  const user = userId ? getUserById(userId) : null

  const url = request.nextUrl.clone()
  const isAuthRoute = url.pathname.startsWith('/login')
  const isPublicRoute =
    url.pathname === '/' ||
    url.pathname.startsWith('/api') ||
    isAuthRoute

  if (!user && !isPublicRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    url.pathname = '/feed'
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next({ request })
  return response
}
