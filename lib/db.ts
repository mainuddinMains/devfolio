/**
 * Thin helpers for reading and writing portfolio data in Cloudflare D1.
 * Each portfolio section is stored as a JSON string under its localStorage key.
 */

export type PortfolioKey =
  | 'pf_header'
  | 'pf_projects'
  | 'pf_project_intro'
  | 'pf_project_media'
  | 'pf_experience'
  | 'pf_education'
  | 'pf_skills'
  | 'pf_extras'
  | 'pf_about_media'
  | 'pf_contact'

export async function getSection<T>(db: D1Database, key: PortfolioKey): Promise<T | null> {
  const row = await db
    .prepare('SELECT value FROM portfolio_data WHERE key = ?')
    .bind(key)
    .first<{ value: string }>()

  if (!row || !row.value || row.value === '{}') return null
  try {
    return JSON.parse(row.value) as T
  } catch {
    return null
  }
}

export async function getAllSections(db: D1Database): Promise<Record<string, unknown>> {
  const { results } = await db
    .prepare('SELECT key, value FROM portfolio_data')
    .all<{ key: string; value: string }>()

  const out: Record<string, unknown> = {}
  for (const row of results) {
    try {
      out[row.key] = JSON.parse(row.value)
    } catch {
      out[row.key] = null
    }
  }
  return out
}

export async function setSection(db: D1Database, key: PortfolioKey, data: unknown): Promise<void> {
  await db
    .prepare(`
      INSERT INTO portfolio_data (key, value, updated_at)
      VALUES (?, ?, unixepoch())
      ON CONFLICT(key) DO UPDATE SET
        value      = excluded.value,
        updated_at = excluded.updated_at
    `)
    .bind(key, JSON.stringify(data))
    .run()
}
