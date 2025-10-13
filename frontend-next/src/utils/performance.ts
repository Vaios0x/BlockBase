/**
 * Performance utilities for BlockBase
 * Optimized functions for better user experience
 */

// Debounce function with immediate execution option
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// Throttle function with leading and trailing options
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options
  let inThrottle: boolean
  let lastFunc: NodeJS.Timeout | null = null
  let lastRan: number

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      if (leading) {
        func(...args)
        lastRan = Date.now()
      }
      inThrottle = true
      setTimeout(() => {
        if (trailing && Date.now() - lastRan >= limit) {
          func(...args)
        }
        inThrottle = false
      }, limit - (Date.now() - lastRan))
    } else {
      if (lastFunc) clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (trailing) func(...args)
      }, limit)
    }
  }
}

// Request Animation Frame throttle
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (rafId) return

    rafId = requestAnimationFrame(() => {
      func(...args)
      rafId = null
    })
  }
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof performance === 'undefined' || !('memory' in performance)) {
    return null
  }

  const memory = (performance as any).memory
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
    percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }
}

// Performance observer for long tasks
export function observeLongTasks(callback: (entries: PerformanceEntry[]) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  try {
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries())
    })

    observer.observe({ entryTypes: ['longtask'] })
    return observer
  } catch (error) {
    console.warn('Long task observation not supported:', error)
    return null
  }
}

// Image lazy loading with intersection observer
export function createLazyImageLoader(
  rootMargin = '50px',
  threshold = 0.1
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    },
    { rootMargin, threshold }
  )

  return imageObserver
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const totalSize = [...scripts, ...styles].reduce((total, element) => {
    const href = element.getAttribute('src') || element.getAttribute('href')
    if (href && !href.startsWith('data:')) {
      // This is a simplified calculation
      // In a real implementation, you'd fetch and measure actual sizes
      return total + (href.includes('chunk') ? 100 : 50) // Estimated KB
    }
    return total
  }, 0)

  return {
    scripts: scripts.length,
    styles: styles.length,
    estimatedSize: totalSize,
    recommendations: totalSize > 500 ? ['Consider code splitting', 'Optimize images'] : []
  }
}

// Critical resource hints
export function addResourceHints() {
  if (typeof document === 'undefined') return

  // Preconnect to external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
  ]

  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })

  // Preload critical resources
  const criticalResources = [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    { href: '/images/hero-bg.webp', as: 'image' }
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.href
    link.as = resource.as
    if (resource.type) link.type = resource.type
    document.head.appendChild(link)
  })
}

// Performance metrics collector
export function collectPerformanceMetrics() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  const metrics = {
    // Navigation timing
    dns: navigation.dnsLookupEnd - navigation.dnsLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ssl: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
    ttfb: navigation.responseStart - navigation.requestStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    load: navigation.loadEventEnd - navigation.loadEventStart,

    // Paint timing
    fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    lcp: 0, // Would need LCP observer

    // Memory usage
    memory: getMemoryUsage(),

    // User timing
    userTimings: performance.getEntriesByType('measure').map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime
    }))
  }

  return metrics
}

// Web Vitals implementation
export function measureWebVitals(onPerfEntry?: (metric: any) => void) {
  if (typeof window === 'undefined' || !onPerfEntry) return

  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      onPerfEntry({
        name: 'FCP',
        value: entry.startTime,
        delta: entry.startTime
      })
    })
  })

  try {
    fcpObserver.observe({ entryTypes: ['paint'] })
  } catch (error) {
    console.warn('FCP measurement not supported:', error)
  }

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    onPerfEntry({
      name: 'LCP',
      value: lastEntry.startTime,
      delta: lastEntry.startTime
    })
  })

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (error) {
    console.warn('LCP measurement not supported:', error)
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      onPerfEntry({
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        delta: entry.processingStart - entry.startTime
      })
    })
  })

  try {
    fidObserver.observe({ entryTypes: ['first-input'] })
  } catch (error) {
    console.warn('FID measurement not supported:', error)
  }

  // Cumulative Layout Shift
  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        onPerfEntry({
          name: 'CLS',
          value: clsValue,
          delta: entry.value
        })
      }
    })
  })

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    console.warn('CLS measurement not supported:', error)
  }
}

// Performance budget checker
export function checkPerformanceBudget(metrics: any) {
  const budgets = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    memory: 50 // 50MB
  }

  const violations = []

  if (metrics.fcp > budgets.fcp) {
    violations.push(`FCP exceeded budget: ${metrics.fcp}ms > ${budgets.fcp}ms`)
  }

  if (metrics.lcp > budgets.lcp) {
    violations.push(`LCP exceeded budget: ${metrics.lcp}ms > ${budgets.lcp}ms`)
  }

  if (metrics.fid > budgets.fid) {
    violations.push(`FID exceeded budget: ${metrics.fid}ms > ${budgets.fid}ms`)
  }

  if (metrics.cls > budgets.cls) {
    violations.push(`CLS exceeded budget: ${metrics.cls} > ${budgets.cls}`)
  }

  if (metrics.memory && metrics.memory.used > budgets.memory) {
    violations.push(`Memory exceeded budget: ${metrics.memory.used}MB > ${budgets.memory}MB`)
  }

  return {
    passed: violations.length === 0,
    violations,
    score: Math.max(0, 100 - (violations.length * 20))
  }
}
