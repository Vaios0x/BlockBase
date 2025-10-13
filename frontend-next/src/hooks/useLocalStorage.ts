'use client'

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((val: T) => T)

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Función para establecer el valor
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Permitir que value sea una función para que tengamos la misma API que useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Escuchar cambios en localStorage desde otras pestañas
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

// Hook especializado para configuraciones de usuario
export function useUserPreferences() {
  const [theme, setTheme, removeTheme] = useLocalStorage('blockbase-theme', 'dark')
  const [language, setLanguage, removeLanguage] = useLocalStorage('blockbase-language', 'es')
  const [notifications, setNotifications, removeNotifications] = useLocalStorage('blockbase-notifications', true)
  const [autoConnect, setAutoConnect, removeAutoConnect] = useLocalStorage('blockbase-auto-connect', false)

  const resetPreferences = useCallback(() => {
    removeTheme()
    removeLanguage()
    removeNotifications()
    removeAutoConnect()
  }, [removeTheme, removeLanguage, removeNotifications, removeAutoConnect])

  return {
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
    autoConnect,
    setAutoConnect,
    resetPreferences
  }
}

// Hook para manejo de cache de datos
export function useCache<T>(key: string, ttl: number = 5 * 60 * 1000) { // 5 minutos por defecto
  const [cache, setCache, removeCache] = useLocalStorage<{
    data: T
    timestamp: number
  } | null>(`cache_${key}`, null)

  const setCachedData = useCallback((data: T) => {
    setCache({
      data,
      timestamp: Date.now()
    })
  }, [setCache])

  const getCachedData = useCallback((): T | null => {
    if (!cache) return null
    
    const isExpired = Date.now() - cache.timestamp > ttl
    if (isExpired) {
      removeCache()
      return null
    }
    
    return cache.data
  }, [cache, ttl, removeCache])

  const clearCache = useCallback(() => {
    removeCache()
  }, [removeCache])

  return {
    setCachedData,
    getCachedData,
    clearCache,
    isCached: !!cache,
    isExpired: cache ? Date.now() - cache.timestamp > ttl : false
  }
}
