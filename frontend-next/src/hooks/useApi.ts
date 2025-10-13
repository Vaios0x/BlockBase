'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  success: boolean
}

interface UseApiOptions {
  retryCount?: number
  retryDelay?: number
  timeout?: number
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const {
    retryCount = 3,
    retryDelay = 1000,
    timeout = 10000,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false
  })

  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Función para hacer petición con retry
  const execute = useCallback(async (
    url: string,
    requestOptions: RequestInit = {}
  ): Promise<T> => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController()

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }))

    try {
      const controller = abortControllerRef.current
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      setState({
        data,
        loading: false,
        error: null,
        success: true
      })

      if (onSuccess) {
        onSuccess(data)
      }

      retryCountRef.current = 0
      return data

    } catch (error) {
      const isAborted = error instanceof Error && error.name === 'AbortError'
      
      if (!isAborted && retryCountRef.current < retryCount) {
        retryCountRef.current++
        
        // Retry con delay exponencial
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return execute(url, requestOptions)
      }

      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      
      setState({
        data: null,
        loading: false,
        error: errorObj,
        success: false
      })

      if (onError) {
        onError(errorObj)
      }

      throw errorObj
    }
  }, [retryCount, retryDelay, timeout, onSuccess, onError])

  // Función para resetear estado
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false
    })
    retryCountRef.current = 0
  }, [])

  // Función para cancelar petición
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    cancel
  }
}

// Hook especializado para GET requests
export function useGet<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const get = useCallback(() => {
    return api.execute(url, { method: 'GET' })
  }, [api, url])

  return {
    ...api,
    get
  }
}

// Hook especializado para POST requests
export function usePost<T = any>(url: string, options: UseApiOptions = {}) {
  const api = useApi<T>(options)

  const post = useCallback((data: any) => {
    return api.execute(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }, [api, url])

  return {
    ...api,
    post
  }
}

// Hook para múltiples endpoints
export function useMultiApi() {
  const [endpoints, setEndpoints] = useState<Record<string, ApiState<any>>>({})

  const executeEndpoint = useCallback(async (
    key: string,
    url: string,
    requestOptions: RequestInit = {}
  ) => {
    setEndpoints(prev => ({
      ...prev,
      [key]: {
        data: null,
        loading: true,
        error: null,
        success: false
      }
    }))

    try {
      const response = await fetch(url, requestOptions)
      const data = await response.json()

      setEndpoints(prev => ({
        ...prev,
        [key]: {
          data,
          loading: false,
          error: null,
          success: true
        }
      }))

      return data
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      
      setEndpoints(prev => ({
        ...prev,
        [key]: {
          data: null,
          loading: false,
          error: errorObj,
          success: false
        }
      }))

      throw errorObj
    }
  }, [])

  const resetEndpoint = useCallback((key: string) => {
    setEndpoints(prev => ({
      ...prev,
      [key]: {
        data: null,
        loading: false,
        error: null,
        success: false
      }
    }))
  }, [])

  return {
    endpoints,
    executeEndpoint,
    resetEndpoint
  }
}
