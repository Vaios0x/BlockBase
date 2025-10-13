'use client'

import { useAccount, useDisconnect, useBalance, useChainId } from 'wagmi'
import { useWalletConnection } from '@/hooks/useWalletConnection'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'
import ErrorNotification from './ErrorNotification'
import ConnectionHelp from './ConnectionHelp'
import { useState, useEffect } from 'react'

export default function AppKitWalletConnect() {
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  })
  const { isConnecting, error, connect, clearError } = useWalletConnection()
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance: any) => {
    if (!balance) return '0.0000 ETH'
    const formatted = parseFloat(balance.formatted)
    return `${formatted.toFixed(4)} ${balance.symbol}`
  }

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      84532: 'Base Sepolia',
      1: 'Ethereum',
      137: 'Polygon',
      10: 'Optimism',
    }
    return chains[chainId] || `Chain ${chainId}`
  }

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true)
      await disconnect()
      clearError()
    } catch (error) {
      console.error('Error disconnecting:', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleConnect = () => {
    connect()
  }

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        // Aquí podrías mostrar un toast de confirmación
      } catch (error) {
        console.error('Error copying address:', error)
      }
    }
  }

  return (
    <>
      <ClientOnlyWrapper>
        {isConnected && address ? (
          <div className="flex items-center gap-4 p-4 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12 hover:bg-white/12 transition-all duration-300">
            <div className="flex flex-col items-end min-w-0">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-mono text-white cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={copyAddress}
                  title={`Click para copiar: ${address}`}
                >
                  {formatAddress(address)}
                </span>
                <button
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Copiar dirección"
                >
                  <i className="fas fa-copy text-xs"></i>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400">
                  {balanceLoading ? 'Cargando...' : formatBalance(balance)}
                </span>
                <span className="text-xs text-gray-400">
                  {getChainName(chainId)}
                </span>
              </div>
              {connector && (
                <span className="text-xs text-gray-500">
                  {connector.name}
                </span>
              )}
            </div>
            <NeuralButton
              variant="secondary"
              size="sm"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="flex items-center gap-2"
              aria-label="Desconectar wallet"
            >
              {isDisconnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Desconectando...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-out-alt"></i>
                  Desconectar
                </>
              )}
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
              aria-label="Conectar wallet"
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
