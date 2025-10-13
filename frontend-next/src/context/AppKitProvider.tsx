'use client'

import { wagmiAdapter, projectId } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { baseSepolia } from '@reown/appkit/networks'
import React, { type ReactNode, useMemo } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Configuración optimizada del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (antes cacheTime)
      retry: (failureCount, error: any) => {
        // No reintentar en errores de wallet
        if (error?.code === 'USER_REJECTED') return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
})

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Metadatos de la aplicación
const metadata = {
  name: 'BlockBase - Real Estate Marketplace',
  description: 'La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.',
  url: 'https://blockbase.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Crear el modal de AppKit con configuración optimizada
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata: metadata,
  features: {
    analytics: true,
    email: false,
    socials: ['google', 'twitter', 'discord', 'github'],
    emailShowWallets: true,
    onramp: true,
    walletFeatures: {
      email: false,
      socials: ['google', 'twitter', 'discord', 'github']
    }
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#6366f1',
    '--w3m-accent-fill-color': '#6366f1',
    '--w3m-background-color': '#1a1a1a',
    '--w3m-background-border-radius': '16px',
  }
})

interface AppKitProviderProps {
  children: ReactNode;
  cookies: string | null;
}

export default function AppKitProvider({ children, cookies }: AppKitProviderProps) {
  const initialState = useMemo(() => 
    cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies),
    [cookies]
  )

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
