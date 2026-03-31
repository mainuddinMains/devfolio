/// <reference types="@cloudflare/workers-types" />

// Cloudflare bindings exposed to Next.js edge routes via @cloudflare/next-on-pages
interface CloudflareEnv extends Record<string, unknown> {
  DB: D1Database
}
