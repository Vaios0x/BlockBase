'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'

interface Property {
  id: string
  name: string
  price: string
  area: number
  bedrooms: number
  bathrooms: number
  location: string
  type: string
  amenities: string[]
  images: string[]
  description: string
  isRented: boolean
  isActive: boolean
}

interface MobilePropertyCardProps {
  property: Property
  onRent?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  onCompare?: (propertyId: string) => void
  className?: string
}

export default function MobilePropertyCard({
  property,
  onRent,
  onView,
  onCompare,
  className
}: MobilePropertyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const handleRent = useCallback(() => {
    if (onRent && !property.isRented) {
      onRent(property.id)
    }
  }, [onRent, property.id, property.isRented])

  const handleView = useCallback(() => {
    if (onView) {
      onView(property.id)
    }
  }, [onView, property.id])

  const handleCompare = useCallback(() => {
    if (onCompare) {
      onCompare(property.id)
    }
  }, [onCompare, property.id])

  const nextImage = useCallback(() => {
    setImageIndex(prev => (prev + 1) % property.images.length)
  }, [property.images.length])

  const prevImage = useCallback(() => {
    setImageIndex(prev => (prev - 1 + property.images.length) % property.images.length)
  }, [property.images.length])

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300',
      isExpanded ? 'shadow-2xl shadow-purple-500/20' : 'shadow-lg',
      className
    )}>
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500">
        {/* Property Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-home text-4xl text-white/80" />
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <i className="fas fa-chevron-left text-sm" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <i className="fas fa-chevron-right text-sm" />
            </button>
          </>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {property.isRented && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
              Rentada
            </span>
          )}
          {!property.isActive && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full font-medium">
              Inactiva
            </span>
          )}
        </div>

        {/* Image Counter */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {imageIndex + 1} / {property.images.length}
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <i className={cn('fas text-sm', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down')} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white line-clamp-1">{property.name}</h3>
          <p className="text-gray-300 text-sm">{property.location}</p>
          <p className="text-gray-400 text-xs capitalize">{property.type}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-400">
            {property.price} ETH
          </span>
          <span className="text-gray-400 text-sm">/ mes</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{property.area} m²</div>
            <div className="text-xs text-gray-400">Área</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{property.bedrooms}</div>
            <div className="text-xs text-gray-400">Dormitorios</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{property.bathrooms}</div>
            <div className="text-xs text-gray-400">Baños</div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Descripción</h4>
              <p className="text-gray-400 text-sm line-clamp-3">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Amenidades</h4>
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 4 && (
                    <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                      +{property.amenities.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={handleRent}
            disabled={property.isRented}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              property.isRented
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
            )}
          >
            {property.isRented ? 'Rentada' : 'Rentar'}
          </button>
          <button
            onClick={handleView}
            className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <i className="fas fa-eye" />
          </button>
          <button
            onClick={handleCompare}
            className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <i className="fas fa-balance-scale" />
          </button>
        </div>
      </div>
    </div>
  )
}
