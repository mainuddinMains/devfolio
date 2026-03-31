/** @type {import('next').NextConfig} */
const nextConfig = {}

// Expose Cloudflare bindings (D1, KV, R2, etc.) during `next dev`
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = await import('@cloudflare/next-on-pages/next-dev')
  await setupDevPlatform()
}

export default nextConfig
