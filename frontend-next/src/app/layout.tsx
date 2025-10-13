import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppKitProvider from '@/context/AppKitProvider'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlockBase - Real Estate Marketplace',
  description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
  keywords: ['blockchain', 'real estate', 'Web3', 'NFT', 'marketplace', 'propiedades', 'inmobiliaria'],
  authors: [{ name: 'BlockBase Team' }],
  creator: 'BlockBase',
  publisher: 'BlockBase',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blockbase.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BlockBase - Real Estate Marketplace',
    description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
    url: 'https://blockbase.app',
    siteName: 'BlockBase',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockBase - Real Estate Marketplace',
    description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
    creator: '@BlockBase',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <AppKitProvider cookies={cookies}>
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}