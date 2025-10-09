import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'

// Project ID de Reown Dashboard
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'e1b7b8bda639fe3153018f6c76ced0a4'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Configuración de redes - Base Sepolia
export const networks = [baseSepolia]

// Configuración del adaptador Wagmi
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
