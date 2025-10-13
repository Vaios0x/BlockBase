'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  isSlowDevice: boolean
}

interface UsePerformanceOptions {
  enableFPSMonitoring?: boolean
  enableMemoryMonitoring?: boolean
  enableRenderTimeMonitoring?: boolean
  slowDeviceThreshold?: number
  onPerformanceIssue?: (metrics: PerformanceMetrics) => void
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableFPSMonitoring = true,
    enableMemoryMonitoring = true,
    enableRenderTimeMonitoring = true,
    slowDeviceThreshold = 30,
    onPerformanceIssue
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isSlowDevice: false
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number>()
  const renderStartRef = useRef<number>()

  // Monitorear FPS
  const measureFPS = useCallback(() => {
    if (!enableFPSMonitoring) return

    const now = performance.now()
    frameCountRef.current++

    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
      
      setMetrics(prev => ({
        ...prev,
        fps,
        isSlowDevice: fps < slowDeviceThreshold
      }))

      if (fps < slowDeviceThreshold && onPerformanceIssue) {
        onPerformanceIssue({
          ...metrics,
          fps,
          isSlowDevice: true
        })
      }

      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    animationFrameRef.current = requestAnimationFrame(measureFPS)
  }, [enableFPSMonitoring, slowDeviceThreshold, onPerformanceIssue, metrics])

  // Monitorear uso de memoria
  const measureMemory = useCallback(() => {
    if (!enableMemoryMonitoring || !('memory' in performance)) return

    const memory = (performance as any).memory
    if (memory) {
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage
      }))
    }
  }, [enableMemoryMonitoring])

  // Monitorear tiempo de renderizado
  const startRenderMeasurement = useCallback(() => {
    if (enableRenderTimeMonitoring) {
      renderStartRef.current = performance.now()
    }
  }, [enableRenderTimeMonitoring])

  const endRenderMeasurement = useCallback(() => {
    if (enableRenderTimeMonitoring && renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current
      
      setMetrics(prev => ({
        ...prev,
        renderTime
      }))
    }
  }, [enableRenderTimeMonitoring])

  // Inicializar monitoreo
  useEffect(() => {
    if (enableFPSMonitoring) {
      animationFrameRef.current = requestAnimationFrame(measureFPS)
    }

    if (enableMemoryMonitoring) {
      const memoryInterval = setInterval(measureMemory, 1000)
      return () => clearInterval(memoryInterval)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enableFPSMonitoring, enableMemoryMonitoring, measureFPS, measureMemory])

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement
  }
}

// Hook para optimización de imágenes
export function useImageOptimization() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

  const loadImage = useCallback((src: string): Promise<void> => {
    if (loadedImages.has(src)) {
      return Promise.resolve()
    }

    if (loadingImages.has(src)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (loadedImages.has(src)) {
            resolve()
          } else {
            requestAnimationFrame(checkLoaded)
          }
        }
        checkLoaded()
      })
    }

    setLoadingImages(prev => new Set(prev).add(src))

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src))
        setLoadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(src)
          return newSet
        })
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }, [loadedImages, loadingImages])

  const preloadImages = useCallback((srcs: string[]) => {
    return Promise.all(srcs.map(loadImage))
  }, [loadImage])

  return {
    loadImage,
    preloadImages,
    isImageLoaded: (src: string) => loadedImages.has(src),
    isImageLoading: (src: string) => loadingImages.has(src)
  }
}

// Hook para lazy loading
export function useLazyLoading(options: { rootMargin?: string; threshold?: number } = {}) {
  const { rootMargin = '50px', threshold = 0.1 } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { rootMargin, threshold }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [rootMargin, threshold])

  return {
    elementRef,
    isIntersecting
  }
}

// Hook para debounce de scroll
export function useScrollOptimization() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          setIsScrolling(true)

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }

          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false)
          }, 150)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return {
    scrollY,
    isScrolling
  }
}

// Hook para optimización de re-renders
export function useRenderOptimization() {
  const renderCountRef = useRef(0)
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    renderCountRef.current++
    setRenderCount(renderCountRef.current)
  })

  const resetRenderCount = useCallback(() => {
    renderCountRef.current = 0
    setRenderCount(0)
  }, [])

  return {
    renderCount,
    resetRenderCount
  }
}
