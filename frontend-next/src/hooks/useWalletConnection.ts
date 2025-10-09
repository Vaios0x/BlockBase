import { useState, useCallback } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { trackWalletConnection } from '@/config/builderRewards'

interface ConnectionState {
  isConnecting: boolean
  error: string | null
  retryCount: number
}

export function useWalletConnection() {
  const { open } = useAppKit()
  const [state, setState] = useState<ConnectionState>({
    isConnecting: false,
    error: null,
    retryCount: 0
  })

  const connect = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        isConnecting: true,
        error: null
      }))
      
      await open()
      
      // Track successful connection for Builder Rewards
      // Note: We'll track the actual address when it's available
      console.log('🎯 Wallet connection initiated for Builder Rewards tracking')
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        retryCount: 0
      }))
    } catch (err: any) {
      console.error('Wallet connection error:', err)
      
      let errorMessage = 'Error al conectar wallet'
      
      if (err.message?.includes('User rejected') || err.message?.includes('User denied')) {
        errorMessage = 'Conexión cancelada por el usuario'
      } else if (err.message?.includes('No Ethereum provider')) {
        errorMessage = 'No se encontró wallet. Instala MetaMask o similar'
      } else if (err.message?.includes('Already processing')) {
        errorMessage = 'Ya hay una conexión en proceso'
      } else if (err.message?.includes('Chain not supported')) {
        errorMessage = 'Red no soportada. Cambia a Base Sepolia'
      }
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }))
    }
  }, [open])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isConnecting: false,
      error: null,
      retryCount: 0
    })
  }, [])

  return {
    ...state,
    connect,
    clearError,
    reset
  }
}
