'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
  className?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const typeStyles = {
  success: 'bg-green-500/20 border-green-500/30 text-green-400',
  error: 'bg-red-500/20 border-red-500/30 text-red-400',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
}

const icons = {
  success: 'fas fa-check-circle',
  error: 'fas fa-exclamation-circle',
  warning: 'fas fa-exclamation-triangle',
  info: 'fas fa-info-circle'
}

export default function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className,
  position = 'top-right'
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) {
        onClose()
      }
    }, 300) // Duración de la animación de salida
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full mx-4',
        positionStyles[position],
        'animate-slide-up'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md',
          'shadow-lg transition-all duration-300',
          typeStyles[type],
          isLeaving && 'opacity-0 transform scale-95',
          className
        )}
        role="alert"
        aria-live="polite"
      >
        <i className={cn('text-lg', icons[type])} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar notificación"
        >
          <i className="fas fa-times text-sm" />
        </button>
      </div>
    </div>
  )
}

// Hook para usar Toast de forma programática
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )

  return {
    showToast,
    ToastContainer
  }
}
