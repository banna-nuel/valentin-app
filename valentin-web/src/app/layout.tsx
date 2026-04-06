import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Valentin 💕',
  description: 'donde dos corazones se encuentran',
  manifest: '/manifest.json',
  icons: { apple: '/icon-192.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff6b9d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {/* Background pattern */}
        <div className="bg-pattern" />

        {/* Doodles */}
        <div className="doodle" style={{ top: '8%', left: '4%', animationDelay: '0s' }}>🌸</div>
        <div className="doodle" style={{ top: '18%', right: '6%', animationDelay: '-3s' }}>💕</div>
        <div className="doodle" style={{ top: '55%', left: '2%', animationDelay: '-5s' }}>🌷</div>
        <div className="doodle" style={{ bottom: '22%', right: '4%', animationDelay: '-7s' }}>✨</div>
        <div className="doodle" style={{ bottom: '8%', left: '7%', animationDelay: '-2s' }}>🦋</div>

        {children}
      </body>
    </html>
  )
}
