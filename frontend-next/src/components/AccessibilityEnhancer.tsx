'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

interface AccessibilityEnhancerProps {
  children: React.ReactNode
  className?: string
}

export default function AccessibilityEnhancer({ children, className }: AccessibilityEnhancerProps) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(highContrastQuery.matches)

    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(reducedMotionQuery.matches)

    // Listen for changes
    const handleHighContrastChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches)
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)

    highContrastQuery.addEventListener('change', handleHighContrastChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [])

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content
      if (e.key === 'Tab' && e.shiftKey && e.altKey) {
        e.preventDefault()
        const mainContent = document.querySelector('main')
        if (mainContent) {
          mainContent.focus()
        }
      }

      // Skip to navigation
      if (e.key === 'Tab' && e.altKey) {
        e.preventDefault()
        const navigation = document.querySelector('nav')
        if (navigation) {
          navigation.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className={cn(
        'accessibility-enhanced',
        isHighContrast && 'high-contrast',
        isReducedMotion && 'reduced-motion',
        className
      )}
      style={{
        fontSize: `${fontSize}px`,
        '--font-size': `${fontSize}px`
      } as React.CSSProperties}
    >
      {children}
      
      {/* Skip links */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:top-0 focus:left-0"
        >
          Saltar al contenido principal
        </a>
        <a
          href="#navigation"
          className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:top-12 focus:left-0"
        >
          Saltar a navegación
        </a>
      </div>
    </div>
  )
}
