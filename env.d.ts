/// <reference types="@cloudflare/workers-types" />

// Cloudflare bindings exposed to Next.js edge routes via @cloudflare/next-on-pages
interface CloudflareEnv extends Record<string, unknown> {
  DB: D1Database
  /** Owner login password – set in Cloudflare Pages environment variables */
  OWNER_PASSWORD: string
  /** Random secret used to sign/verify JWT tokens – set in Cloudflare Pages environment variables */
  JWT_SECRET: string
}
