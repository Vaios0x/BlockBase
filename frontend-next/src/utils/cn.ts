import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilidad para combinar clases de Tailwind CSS de forma segura
 * Combina clsx para lógica condicional y twMerge para resolver conflictos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utilidad para crear clases de variantes de forma type-safe
 */
export function createVariants<T extends Record<string, string>>(variants: T) {
  return (variant: keyof T) => variants[variant]
}

/**
 * Utilidad para crear clases condicionales basadas en props
 */
export function createConditionalClasses<T extends Record<string, any>>(
  props: T,
  classMap: Record<string, string>
) {
  return Object.entries(props)
    .filter(([_, value]) => Boolean(value))
    .map(([key, _]) => classMap[key])
    .filter(Boolean)
    .join(' ')
}

/**
 * Utilidad para crear clases responsive
 */
export function createResponsiveClasses(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
) {
  const classes = [base]
  if (sm) classes.push(`sm:${sm}`)
  if (md) classes.push(`md:${md}`)
  if (lg) classes.push(`lg:${lg}`)
  if (xl) classes.push(`xl:${xl}`)
  return classes.join(' ')
}
