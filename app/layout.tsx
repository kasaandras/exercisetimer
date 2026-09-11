import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/Providers'
import { ServiceWorker } from '@/components/ServiceWorker'
import { TopBar } from '@/components/TopBar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cue Timer',
  description:
    'An interval timer for guided exercise where the audio carries the instruction. Every change is announced by sound before it happens.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Cue Timer' },
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#0d2a2e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ServiceWorker />
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
