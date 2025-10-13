'use client'

import { useState, useCallback, useEffect } from 'react'

interface ErrorState {
  error: Error | null
  hasError: boolean
  errorId: string | null
}

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void
  onRetry?: () => void
  maxRetries?: number
  retryDelay?: number
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    errorId: null
  })
  
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const { onError, onRetry, maxRetries = 3, retryDelay = 1000 } = options

  const handleError = useCallback((error: Error) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setErrorState({
      error,
      hasError: true,
      errorId
    })

    if (onError) {
      onError(error)
    }
  }, [onError])

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      errorId: null
    })
    setRetryCount(0)
    setIsRetrying(false)
  }, [])

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      console.warn('Máximo número de reintentos alcanzado')
      return
    }

    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    if (onRetry) {
      try {
        await onRetry()
        clearError()
      } catch (error) {
        if (error instanceof Error) {
          handleError(error)
        }
      }
    }

    setIsRetrying(false)
  }, [retryCount, maxRetries, onRetry, clearError, handleError])

  const reset = useCallback(() => {
    clearError()
    setRetryCount(0)
    setIsRetrying(false)
  }, [clearError])

  // Auto-retry con delay
  useEffect(() => {
    if (errorState.hasError && retryCount < maxRetries && !isRetrying) {
      const timer = setTimeout(() => {
        retry()
      }, retryDelay)

      return () => clearTimeout(timer)
    }
  }, [errorState.hasError, retryCount, maxRetries, isRetrying, retry, retryDelay])

  return {
    ...errorState,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
    handleError,
    clearError,
    retry,
    reset
  }
}
