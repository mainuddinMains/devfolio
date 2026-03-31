/**
 * GET  /api/portfolio        – return all sections
 * PUT  /api/portfolio        – upsert one section  { key, data }
 */

import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllSections, setSection, type PortfolioKey } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext<CloudflareEnv>()
    const all = await getAllSections(env.DB)
    return Response.json({ ok: true, data: all })
  } catch (err) {
    console.error('[portfolio GET]', err)
    return Response.json({ ok: false, error: 'Failed to load portfolio data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { env } = getRequestContext<CloudflareEnv>()
    const body = await request.json() as { key: PortfolioKey; data: unknown }

    if (!body.key || body.data === undefined) {
      return Response.json({ ok: false, error: 'Missing key or data' }, { status: 400 })
    }

    await setSection(env.DB, body.key, body.data)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[portfolio PUT]', err)
    return Response.json({ ok: false, error: 'Failed to save portfolio data' }, { status: 500 })
  }
}
