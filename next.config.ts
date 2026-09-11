import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export: the whole app is client-side, so it can be served as plain
  // files and cached wholesale by the service worker for offline use.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
