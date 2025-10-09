'use client'

import { useState, useEffect } from 'react'

interface ErrorNotificationProps {
  error: string | null
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function ErrorNotification({ 
  error, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(onClose, 300) // Wait for animation
        }, duration)
        
        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [error, autoClose, duration, onClose])

  if (!error || !isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-triangle text-red-400 text-lg"></i>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-red-400 mb-1">
              Error de Conexión
            </h4>
            <p className="text-xs text-red-300 leading-relaxed">
              {error}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded transition-colors"
          >
            Entendido
          </button>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
              // Retry connection logic can be added here
            }}
            className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  )
}
