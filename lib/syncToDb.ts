/**
 * Fire-and-forget sync of a portfolio section to the D1 database via the API.
 * Errors are logged to the console but do not throw, so localStorage always wins.
 */
export function syncSection(key: string, data: unknown): void {
  fetch('/api/portfolio', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data }),
  }).catch((err) => console.error('[syncSection]', err))
}
