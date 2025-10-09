'use client'

import { useAppKit } from '@reown/appkit/react'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function AppKitConnectModal() {
  const { open } = useAppKit()

  const handleOpenModal = () => {
    open()
  }

  return (
    <ClientOnlyWrapper>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Conectar Wallet</h3>
          <p className="text-gray-400 text-sm mb-4">
            Elige tu método de conexión preferido
          </p>
        </div>
        
        <div className="space-y-3">
          <NeuralButton
            variant="primary"
            size="lg"
            neural={true}
            onClick={handleOpenModal}
            className="w-full flex items-center justify-center gap-3"
          >
            <i className="fas fa-wallet"></i>
            Conectar con Wallet
          </NeuralButton>
          
          <div className="text-center text-gray-400 text-xs">
            <p>600+ wallets soportados</p>
            <p>Incluye MetaMask, WalletConnect, Coinbase y más</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <i className="fas fa-shield-alt text-green-400"></i>
            <span>Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-bolt text-yellow-400"></i>
            <span>Rápido</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-mobile-alt text-blue-400"></i>
            <span>Mobile</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-globe text-purple-400"></i>
            <span>Multi-chain</span>
          </div>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
