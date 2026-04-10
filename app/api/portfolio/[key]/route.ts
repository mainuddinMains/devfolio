/**
 * GET /api/portfolio/:key  – return a single section
 */

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getSection, type PortfolioKey } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const key = new URL(request.url).pathname.split('/').pop() as PortfolioKey
    const { env } = getCloudflareContext<CloudflareEnv>()
    const data = await getSection(env.DB, key)
    return Response.json({ ok: true, data })
  } catch (err) {
    console.error('[portfolio GET key]', err)
    return Response.json({ ok: false, error: 'Failed to load section' }, { status: 500 })
  }
}
