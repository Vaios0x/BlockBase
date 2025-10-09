'use client'

import { useAccount, useBalance, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function AppKitDemo() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const chainId = useChainId()
  const { open } = useAppKit()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <ClientOnlyWrapper>
      <div className="p-6 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
        <h3 className="text-xl font-bold text-white mb-4">AppKit Demo</h3>
        
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Dirección:</span>
                <p className="font-mono text-white">{formatAddress(address)}</p>
              </div>
              <div>
                <span className="text-gray-400">Balance:</span>
                <p className="text-cyan-400">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Red:</span>
                <p className="text-white">Base Sepolia (Chain ID: {chainId})</p>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <p className="text-green-400">Conectado</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <NeuralButton variant="primary" size="sm" className="flex items-center gap-2">
                <i className="fas fa-exchange-alt"></i>
                Cambiar Red
              </NeuralButton>
              <NeuralButton variant="secondary" size="sm" className="flex items-center gap-2">
                <i className="fas fa-cog"></i>
                Configuración
              </NeuralButton>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <i className="fas fa-wallet text-4xl mb-4"></i>
              <p>Conecta tu wallet para comenzar</p>
            </div>
            <NeuralButton
              variant="primary"
              size="md"
              neural={true}
              onClick={() => open()}
              className="flex items-center gap-2"
            >
              <i className="fas fa-wallet"></i>
              Conectar Wallet
            </NeuralButton>
          </div>
        )}
      </div>
    </ClientOnlyWrapper>
  )
}
