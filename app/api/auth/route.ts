/**
 * GET    /api/auth  – check if the current cookie is a valid owner token
 * POST   /api/auth  – login with password → sets httpOnly cookie
 * DELETE /api/auth  – logout → clears cookie
 */

import { getRequestContext } from '@cloudflare/next-on-pages'
import { signToken, verifyToken, getCookieFromHeader, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

export const runtime = 'edge'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = getCookieFromHeader(cookieHeader, COOKIE_NAME)
  if (!token) return Response.json({ ok: false, owner: false })

  try {
    const { env } = getRequestContext<CloudflareEnv>()
    const valid = await verifyToken(token, env.JWT_SECRET)
    return Response.json({ ok: valid, owner: valid })
  } catch {
    return Response.json({ ok: false, owner: false })
  }
}

export async function POST(request: Request) {
  try {
    const { env } = getRequestContext<CloudflareEnv>()
    const { password } = await request.json() as { password?: string }

    if (!password || password !== env.OWNER_PASSWORD) {
      return Response.json({ ok: false, error: 'Invalid password' }, { status: 401 })
    }

    const token = await signToken(env.JWT_SECRET)
    const cookieStr = `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}; Path=/`

    return Response.json({ ok: true }, { headers: { 'Set-Cookie': cookieStr } })
  } catch {
    return Response.json({ ok: false, error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStr = `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': cookieStr } })
}
