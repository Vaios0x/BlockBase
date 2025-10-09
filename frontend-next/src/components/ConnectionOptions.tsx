'use client'

import { useAppKit } from '@reown/appkit/react'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function ConnectionOptions() {
  const { open } = useAppKit()

  const connectionMethods = [
    {
      name: 'MetaMask',
      icon: 'fab fa-ethereum',
      description: 'Wallet más popular',
      color: 'text-orange-400'
    },
    {
      name: 'WalletConnect',
      icon: 'fas fa-qrcode',
      description: 'Conexión móvil',
      color: 'text-blue-400'
    },
    {
      name: 'Coinbase',
      icon: 'fab fa-bitcoin',
      description: 'Exchange wallet',
      color: 'text-blue-500'
    },
    {
      name: 'Social Login',
      icon: 'fas fa-users',
      description: 'Google, Twitter, etc.',
      color: 'text-purple-400'
    }
  ]

  return (
    <ClientOnlyWrapper>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Métodos de Conexión</h3>
          <p className="text-gray-400">
            Elige tu método preferido para conectar tu wallet
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {connectionMethods.map((method, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => open()}
            >
              <div className="text-center space-y-2">
                <i className={`${method.icon} text-2xl ${method.color}`}></i>
                <h4 className="font-semibold text-white">{method.name}</h4>
                <p className="text-xs text-gray-400">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <NeuralButton
            variant="primary"
            size="lg"
            neural={true}
            onClick={() => open()}
            className="w-full flex items-center justify-center gap-3"
          >
            <i className="fas fa-wallet"></i>
            Abrir Modal de Conexión
          </NeuralButton>
        </div>

        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>🔒 Conexión segura y encriptada</p>
          <p>⚡ Soporte para 600+ wallets</p>
          <p>🌐 Multi-chain: Ethereum, Base, Polygon</p>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
