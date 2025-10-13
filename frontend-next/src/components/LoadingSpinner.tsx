'use client'

import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
  text?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const variantClasses = {
  primary: 'border-cyan-400',
  secondary: 'border-purple-400',
  accent: 'border-blue-400'
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  className,
  text,
  showText = false 
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-t-transparent',
          sizeClasses[size],
          variantClasses[variant]
        )}
        role="status"
        aria-label="Cargando"
      >
        <span className="sr-only">Cargando...</span>
      </div>
      {showText && text && (
        <span className="text-sm text-gray-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}
