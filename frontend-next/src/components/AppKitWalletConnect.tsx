'use client'

import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { useWalletConnection } from '@/hooks/useWalletConnection'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'
import ErrorNotification from './ErrorNotification'
import ConnectionHelp from './ConnectionHelp'

export default function AppKitWalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })
  const { isConnecting, error, connect, clearError } = useWalletConnection()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleDisconnect = () => {
    disconnect()
    clearError()
  }

  const handleConnect = () => {
    connect()
  }

  return (
    <>
      <ClientOnlyWrapper>
        {isConnected && address ? (
          <div className="flex items-center gap-4 p-4 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
            <div className="flex flex-col items-end">
              <span className="text-sm font-mono text-white">
                {formatAddress(address)}
              </span>
              <span className="text-xs text-cyan-400">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
              </span>
            </div>
            <NeuralButton
              variant="secondary"
              size="sm"
              onClick={handleDisconnect}
              className="flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              Desconectar
            </NeuralButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NeuralButton
              variant="primary"
              size="md"
              neural={true}
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <i className="fas fa-wallet"></i>
                  Conectar Wallet
                </>
              )}
            </NeuralButton>
            
            <ConnectionHelp />
          </div>
        )}
      </ClientOnlyWrapper>
      
      <ErrorNotification 
        error={error} 
        onClose={clearError}
        autoClose={true}
        duration={6000}
      />
    </>
  )
}
