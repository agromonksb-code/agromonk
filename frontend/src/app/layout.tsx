import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AGROMONK - Fresh Organic Products',
  description: 'Your trusted source for fresh organic vegetables, fruits, grains, and spices. Direct from farm to your doorstep with guaranteed quality and freshness.',
  keywords: 'organic, fresh vegetables, fruits, grains, spices, farm to doorstep, agro products',
  authors: [{ name: 'AGROMONK Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'AGROMONK - Fresh Organic Products',
    description: 'Your trusted source for fresh organic vegetables, fruits, grains, and spices.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROMONK - Fresh Organic Products',
    description: 'Your trusted source for fresh organic vegetables, fruits, grains, and spices.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}