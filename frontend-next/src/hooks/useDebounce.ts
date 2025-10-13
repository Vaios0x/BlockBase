'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook para debounce de valores
 * Útil para optimizar búsquedas y evitar llamadas excesivas a APIs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de funciones
 * Útil para optimizar callbacks que se ejecutan frecuentemente
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)

  // Mantener la referencia del callback actualizada
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  ) as T

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

/**
 * Hook para debounce de búsquedas
 * Especializado para optimizar búsquedas con estado de loading
 */
export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setError(null)

    searchFn(debouncedQuery)
      .then(setResults)
      .catch(setError)
      .finally(() => setIsSearching(false))
  }, [debouncedQuery, searchFn])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults(null)
    setError(null)
    setIsSearching(false)
  }, [])

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch,
    hasResults: !!results,
    isEmpty: !query.trim()
  }
}

/**
 * Hook para throttle
 * Útil para limitar la frecuencia de ejecución de funciones
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastRun.current >= delay) {
        callbackRef.current(...args)
        lastRun.current = now
      }
    },
    [delay]
  ) as T

  return throttledCallback
}

/**
 * Hook para debounce con cancelación
 * Permite cancelar operaciones pendientes
 */
export function useDebouncedCallbackWithCancel<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  ) as T

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [debouncedCallback, cancel]
}
