'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useRouter } from 'next/navigation'

interface MobileNavigationProps {
  className?: string
}

const navigationItems = [
  { id: 'home', label: 'Inicio', icon: 'fas fa-home', href: '#home' },
  { id: 'properties', label: 'Propiedades', icon: 'fas fa-building', href: '#properties' },
  { id: 'auctions', label: 'Subastas', icon: 'fas fa-gavel', href: '#auctions' },
  { id: 'insurance', label: 'Seguros', icon: 'fas fa-shield-alt', href: '#insurance' },
  { id: 'management', label: 'Gestión', icon: 'fas fa-tools', href: '#management' },
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line', href: '#dashboard' }
]

export default function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const router = useRouter()

  // Detectar sección activa basada en scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id)
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-4 right-4 z-50 p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300',
          'md:hidden',
          className
        )}
        aria-label="Abrir menú de navegación"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={cn(
            'block w-5 h-0.5 bg-white transition-all duration-300',
            isOpen && 'rotate-45 translate-y-1'
          )} />
          <span className={cn(
            'block w-5 h-0.5 bg-white transition-all duration-300 mt-1',
            isOpen && 'opacity-0'
          )} />
          <span className={cn(
            'block w-5 h-0.5 bg-white transition-all duration-300 mt-1',
            isOpen && '-rotate-45 -translate-y-1'
          )} />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú lateral */}
      <div className={cn(
        'fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white/10 backdrop-blur-md border-l border-white/20 transform transition-transform duration-300 md:hidden',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-building text-white text-sm" />
              </div>
              <span className="text-lg font-bold text-white">BlockBase</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar menú"
            >
              <i className="fas fa-times text-lg" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-6 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200',
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                )}
              >
                <i className={cn('text-lg w-5', item.icon)} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <i className="fas fa-chevron-right text-sm ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="space-y-3">
              <div className="text-xs text-gray-400">
                <p>Red: Base Sepolia</p>
                <p>Chain ID: 84532</p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://twitter.com/blockbase"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter" />
                </a>
                <a
                  href="https://discord.gg/blockbase"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Discord"
                >
                  <i className="fab fa-discord" />
                </a>
                <a
                  href="https://github.com/blockbase"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation para móviles */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-t border-white/20 md:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200',
                activeSection === item.id
                  ? 'text-cyan-400 bg-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <i className={cn('text-sm', item.icon)} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
