'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'
import LoadingSpinner from './LoadingSpinner'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  loading?: boolean
  loadingText?: string
  className?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  loading = false,
  loadingText = 'Cargando...',
  className,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Manejar tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevenir scroll del body cuando el modal está abierto
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

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-2xl border shadow-2xl',
          'bg-white/10 backdrop-blur-md border-white/20',
          'animate-slide-up',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <i className="fas fa-times text-lg" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" text={loadingText} showText />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}

// Hook para usar Modal de forma programática
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalProps, setModalProps] = useState<Partial<ModalProps>>({})

  const openModal = (props: Partial<ModalProps> = {}) => {
    setModalProps(props)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalProps({})
  }

  const ModalComponent = () => (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      {...modalProps}
    />
  )

  return {
    isOpen,
    openModal,
    closeModal,
    ModalComponent
  }
}
