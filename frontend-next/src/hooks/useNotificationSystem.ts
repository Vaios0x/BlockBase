'use client'

import { useState, useCallback, useEffect } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'blockchain'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
  metadata?: Record<string, any>
  timestamp: number
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface NotificationSystemState {
  notifications: Notification[]
  isEnabled: boolean
  permission: NotificationPermission
}

export function useNotificationSystem() {
  const [state, setState] = useState<NotificationSystemState>({
    notifications: [],
    isEnabled: false,
    permission: 'default'
  })

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setState(prev => ({ ...prev, permission, isEnabled: permission === 'granted' }))
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [])

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now()
    }

    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }))

    // Auto remove if not persistent
    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    // Show browser notification if enabled
    if (state.isEnabled && notification.type !== 'info') {
      showBrowserNotification(newNotification)
    }

    return id
  }, [state.isEnabled])

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }))
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }))
  }, [])

  // Show browser notification
  const showBrowserNotification = useCallback((notification: Notification) => {
    if (!state.isEnabled) return

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/badge-icon.png',
      tag: notification.id,
      requireInteraction: notification.persistent,
      silent: notification.type === 'info'
    })

    browserNotification.onclick = () => {
      window.focus()
      browserNotification.close()
    }

    // Auto close after duration
    if (!notification.persistent) {
      setTimeout(() => {
        browserNotification.close()
      }, notification.duration || 5000)
    }
  }, [state.isEnabled])

  // Blockchain transaction notifications
  const notifyTransaction = useCallback((
    txHash: string,
    status: 'pending' | 'success' | 'failed',
    message?: string
  ) => {
    const baseNotification = {
      type: 'blockchain' as const,
      title: `Transacción ${status === 'pending' ? 'Enviada' : status === 'success' ? 'Confirmada' : 'Fallida'}`,
      message: message || `Hash: ${txHash.slice(0, 10)}...`,
      persistent: status === 'pending',
      actions: [
        {
          label: 'Ver en Explorer',
          action: () => window.open(`https://sepolia.basescan.org/tx/${txHash}`, '_blank'),
          variant: 'primary' as const
        }
      ],
      metadata: { txHash, status }
    }

    return addNotification(baseNotification)
  }, [addNotification])

  // Property-specific notifications
  const notifyPropertyAction = useCallback((
    action: 'created' | 'rented' | 'cancelled',
    propertyName: string
  ) => {
    const messages = {
      created: `Propiedad "${propertyName}" creada exitosamente`,
      rented: `Propiedad "${propertyName}" rentada exitosamente`,
      cancelled: `Renta de "${propertyName}" cancelada`
    }

    return addNotification({
      type: 'success',
      title: 'Acción Completada',
      message: messages[action],
      duration: 5000
    })
  }, [addNotification])

  // Error notifications
  const notifyError = useCallback((
    error: Error | string,
    context?: string
  ) => {
    const message = typeof error === 'string' ? error : error.message
    const title = context ? `Error en ${context}` : 'Error'

    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true,
      actions: [
        {
          label: 'Reintentar',
          action: () => window.location.reload(),
          variant: 'primary'
        }
      ]
    })
  }, [addNotification])

  // Success notifications
  const notifySuccess = useCallback((
    message: string,
    title = 'Éxito'
  ) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 3000
    })
  }, [addNotification])

  // Warning notifications
  const notifyWarning = useCallback((
    message: string,
    title = 'Advertencia'
  ) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 7000
    })
  }, [addNotification])

  // Initialize permission check
  useEffect(() => {
    if ('Notification' in window) {
      setState(prev => ({
        ...prev,
        permission: Notification.permission,
        isEnabled: Notification.permission === 'granted'
      }))
    }
  }, [])

  return {
    ...state,
    requestPermission,
    addNotification,
    removeNotification,
    clearAll,
    notifyTransaction,
    notifyPropertyAction,
    notifyError,
    notifySuccess,
    notifyWarning
  }
}
