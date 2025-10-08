import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RainbowKitProviderWrapper from '@/providers/RainbowKitProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlockBase - Real Estate Marketplace',
  description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/@walletconnect/modal@2.7.1/dist/index.css" />
      </head>
      <body className={inter.className}>
        <RainbowKitProviderWrapper>
          {children}
        </RainbowKitProviderWrapper>
      </body>
    </html>
  )
}