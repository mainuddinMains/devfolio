/**
 * JWT utilities using Web Crypto API (Cloudflare Edge compatible)
 */

export const COOKIE_NAME = 'devfolio_auth'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function signToken(secret: string): Promise<string> {
  const header = urlB64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = urlB64(JSON.stringify({ owner: true, iat: Math.floor(Date.now() / 1000) }))
  const data = `${header}.${payload}`
  const key = await importKey(secret, 'sign')
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc(data))
  return `${data}.${urlB64Buf(sigBuf)}`
}

export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const data = `${parts[0]}.${parts[1]}`
    const sig = parts[2].replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - parts[2].length % 4) % 4)
    const key = await importKey(secret, 'verify')
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0))
    return await crypto.subtle.verify('HMAC', key, sigBytes, enc(data))
  } catch {
    return false
  }
}

export function getCookieFromHeader(header: string, name: string): string | null {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function enc(s: string) { return new TextEncoder().encode(s) }
function urlB64(s: string) { return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') }
function urlB64Buf(buf: ArrayBuffer) { return urlB64(String.fromCharCode(...new Uint8Array(buf))) }
async function importKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey('raw', enc(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage])
}
