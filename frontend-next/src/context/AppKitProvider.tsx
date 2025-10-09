'use client'

import { wagmiAdapter, projectId } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { baseSepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Configuración del QueryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Metadatos de la aplicación
const metadata = {
  name: 'BlockBase - Real Estate Marketplace',
  description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
  url: 'https://blockbase.app', // Cambiar por tu dominio
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Crear el modal de AppKit
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata: metadata,
  features: {
    analytics: true, // Opcional - por defecto usa tu configuración de Cloud
    email: false, // Deshabilitar autenticación por email
    socials: ['google', 'twitter', 'discord', 'github'], // Redes sociales habilitadas
    emailShowWallets: true, // Mostrar wallets en el modal de email
    onramp: true, // Habilitar onramp
    walletFeatures: {
      email: false, // Deshabilitar email en wallets
      socials: ['google', 'twitter', 'discord', 'github']
    }
  }
})

interface AppKitProviderProps {
  children: ReactNode;
  cookies: string | null;
}

export default function AppKitProvider({ children, cookies }: AppKitProviderProps) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
