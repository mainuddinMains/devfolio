/**
 * GET /api/portfolio/:key  – return a single section
 */

import { getRequestContext } from '@cloudflare/next-on-pages'
import { getSection, type PortfolioKey } from '@/lib/db'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    // Parse key from URL to avoid Next.js version-specific params typing issues
    const key = new URL(request.url).pathname.split('/').pop() as PortfolioKey
    const { env } = getRequestContext<CloudflareEnv>()
    const data = await getSection(env.DB, key)
    return Response.json({ ok: true, data })
  } catch (err) {
    console.error('[portfolio GET key]', err)
    return Response.json({ ok: false, error: 'Failed to load section' }, { status: 500 })
  }
}
