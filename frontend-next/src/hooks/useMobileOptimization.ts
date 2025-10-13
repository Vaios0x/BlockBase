'use client'

import { useState, useEffect, useCallback } from 'react'

interface MobileOptimizationState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  touchDevice: boolean
  reducedMotion: boolean
  connectionType: 'slow' | 'fast' | 'unknown'
  viewportHeight: number
  viewportWidth: number
}

interface UseMobileOptimizationOptions {
  enableConnectionDetection?: boolean
  enableMotionDetection?: boolean
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void
  onViewportChange?: (width: number, height: number) => void
}

export function useMobileOptimization(options: UseMobileOptimizationOptions = {}) {
  const {
    enableConnectionDetection = true,
    enableMotionDetection = true,
    onOrientationChange,
    onViewportChange
  } = options

  const [state, setState] = useState<MobileOptimizationState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait',
    touchDevice: false,
    reducedMotion: false,
    connectionType: 'unknown',
    viewportHeight: 0,
    viewportWidth: 0
  })

  // Detect device type
  const detectDeviceType = useCallback(() => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024

    return { isMobile, isTablet, isDesktop }
  }, [])

  // Detect orientation
  const detectOrientation = useCallback(() => {
    if (typeof window === 'undefined') return 'portrait'

    const width = window.innerWidth
    const height = window.innerHeight
    return width > height ? 'landscape' : 'portrait'
  }, [])

  // Detect touch device
  const detectTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false

    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    )
  }, [])

  // Detect reduced motion preference
  const detectReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Detect connection type
  const detectConnectionType = useCallback(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 'unknown'
    }

    // @ts-ignore
    const connection = navigator.connection
    if (!connection) return 'unknown'

    // @ts-ignore
    const effectiveType = connection.effectiveType
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow'
    return 'fast'
  }, [])

  // Update state
  const updateState = useCallback(() => {
    const deviceType = detectDeviceType()
    const orientation = detectOrientation()
    const touchDevice = detectTouchDevice()
    const reducedMotion = detectReducedMotion()
    const connectionType = enableConnectionDetection ? detectConnectionType() : 'unknown'

    setState(prev => {
      const newState = {
        ...prev,
        ...deviceType,
        orientation,
        touchDevice,
        reducedMotion,
        connectionType,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth
      }

      // Call callbacks if state changed
      if (prev.orientation !== orientation && onOrientationChange) {
        onOrientationChange(orientation)
      }

      if ((prev.viewportWidth !== newState.viewportWidth || prev.viewportHeight !== newState.viewportHeight) && onViewportChange) {
        onViewportChange(newState.viewportWidth, newState.viewportHeight)
      }

      return newState
    })
  }, [detectDeviceType, detectOrientation, detectTouchDevice, detectReducedMotion, detectConnectionType, enableConnectionDetection, onOrientationChange, onViewportChange])

  // Initialize state
  useEffect(() => {
    updateState()
  }, [updateState])

  // Listen for resize events
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      updateState()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateState])

  // Listen for orientation change
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(updateState, 100)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    return () => window.removeEventListener('orientationchange', handleOrientationChange)
  }, [updateState])

  // Listen for connection change
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator) || !enableConnectionDetection) return

    // @ts-ignore
    const connection = navigator.connection
    if (!connection) return

    const handleConnectionChange = () => {
      updateState()
    }

    connection.addEventListener('change', handleConnectionChange)
    return () => connection.removeEventListener('change', handleConnectionChange)
  }, [updateState, enableConnectionDetection])

  // Listen for motion preference change
  useEffect(() => {
    if (!enableMotionDetection) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      updateState()
    }

    mediaQuery.addEventListener('change', handleMotionChange)
    return () => mediaQuery.removeEventListener('change', handleMotionChange)
  }, [updateState, enableMotionDetection])

  return state
}

// Hook for mobile-specific optimizations
export function useMobileOptimizations() {
  const mobileState = useMobileOptimization()

  // Optimize images for mobile
  const getOptimizedImageSrc = useCallback((src: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    if (!mobileState.isMobile) return src

    const sizeMap = {
      small: 'w_300,h_200,c_fill',
      medium: 'w_600,h_400,c_fill',
      large: 'w_800,h_600,c_fill'
    }

    // Add image optimization parameters
    return `${src}?${sizeMap[size]}&f_auto,q_auto`
  }, [mobileState.isMobile])

  // Optimize animations for mobile
  const getOptimizedAnimation = useCallback((animation: string) => {
    if (mobileState.reducedMotion || mobileState.connectionType === 'slow') {
      return 'none'
    }
    return animation
  }, [mobileState.reducedMotion, mobileState.connectionType])

  // Get responsive grid columns
  const getResponsiveColumns = useCallback((mobile: number, tablet: number, desktop: number) => {
    if (mobileState.isMobile) return mobile
    if (mobileState.isTablet) return tablet
    return desktop
  }, [mobileState.isMobile, mobileState.isTablet])

  // Get optimized font size
  const getOptimizedFontSize = useCallback((baseSize: number) => {
    if (mobileState.isMobile) {
      return Math.max(baseSize * 0.9, 14) // Minimum 14px for mobile
    }
    return baseSize
  }, [mobileState.isMobile])

  // Get touch-friendly spacing
  const getTouchSpacing = useCallback((baseSpacing: number) => {
    if (mobileState.touchDevice) {
      return Math.max(baseSpacing * 1.2, 44) // Minimum 44px for touch targets
    }
    return baseSpacing
  }, [mobileState.touchDevice])

  return {
    ...mobileState,
    getOptimizedImageSrc,
    getOptimizedAnimation,
    getResponsiveColumns,
    getOptimizedFontSize,
    getTouchSpacing
  }
}

// Hook for mobile gestures
export function useMobileGestures() {
  const [gestureState, setGestureState] = useState({
    swipeDirection: null as 'left' | 'right' | 'up' | 'down' | null,
    pinchScale: 1,
    isDragging: false
  })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Implementation for touch gestures
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Implementation for touch gestures
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Implementation for touch gestures
  }, [])

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
