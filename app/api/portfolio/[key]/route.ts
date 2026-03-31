/**
 * GET /api/portfolio/:key  – return a single section
 */

import { getRequestContext } from '@cloudflare/next-on-pages'
import { getSection, type PortfolioKey } from '@/lib/db'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const { env } = getRequestContext<CloudflareEnv>()
    const data = await getSection(env.DB, key as PortfolioKey)
    return Response.json({ ok: true, data })
  } catch (err) {
    console.error('[portfolio GET key]', err)
    return Response.json({ ok: false, error: 'Failed to load section' }, { status: 500 })
  }
}
