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
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemoveProperty: (propertyId: string) => void
  onClearAll: () => void
  className?: string
}

export default function PropertyComparison({ 
  properties, 
  onRemoveProperty, 
  onClearAll, 
  className 
}: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>(properties)

  const handleRemoveProperty = useCallback((propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId))
    onRemoveProperty(propertyId)
  }, [onRemoveProperty])

  const handleClearAll = useCallback(() => {
    setSelectedProperties([])
    onClearAll()
  }, [onClearAll])

  const getComparisonData = useCallback(() => {
    if (selectedProperties.length === 0) return null

    const prices = selectedProperties.map(p => parseFloat(p.price))
    const areas = selectedProperties.map(p => p.area)
    const bedrooms = selectedProperties.map(p => p.bedrooms)
    const bathrooms = selectedProperties.map(p => p.bathrooms)

    return {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((a, b) => a + b, 0) / prices.length
      },
      areaRange: {
        min: Math.min(...areas),
        max: Math.max(...areas),
        avg: areas.reduce((a, b) => a + b, 0) / areas.length
      },
      bedroomRange: {
        min: Math.min(...bedrooms),
        max: Math.max(...bedrooms),
        avg: bedrooms.reduce((a, b) => a + b, 0) / bedrooms.length
      },
      bathroomRange: {
        min: Math.min(...bathrooms),
        max: Math.max(...bathrooms),
        avg: bathrooms.reduce((a, b) => a + b, 0) / bathrooms.length
      }
    }
  }, [selectedProperties])

  const comparisonData = getComparisonData()

  if (selectedProperties.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-gray-400 mb-4">
          <i className="fas fa-balance-scale text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No hay propiedades para comparar
        </h3>
        <p className="text-gray-400">
          Selecciona al menos 2 propiedades para comenzar la comparación
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">
            Comparación de Propiedades
          </h2>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
            {selectedProperties.length} propiedades
          </span>
        </div>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Limpiar todo
        </button>
      </div>

      {/* Comparison Stats */}
      {comparisonData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {comparisonData.priceRange.min.toFixed(1)} - {comparisonData.priceRange.max.toFixed(1)} ETH
            </div>
            <div className="text-sm text-gray-400">Rango de Precio</div>
            <div className="text-xs text-gray-500">
              Promedio: {comparisonData.priceRange.avg.toFixed(1)} ETH
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {comparisonData.areaRange.min} - {comparisonData.areaRange.max} m²
            </div>
            <div className="text-sm text-gray-400">Área</div>
            <div className="text-xs text-gray-500">
              Promedio: {Math.round(comparisonData.areaRange.avg)} m²
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {comparisonData.bedroomRange.min} - {comparisonData.bedroomRange.max}
            </div>
            <div className="text-sm text-gray-400">Dormitorios</div>
            <div className="text-xs text-gray-500">
              Promedio: {comparisonData.bedroomRange.avg.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {comparisonData.bathroomRange.min} - {comparisonData.bathroomRange.max}
            </div>
            <div className="text-sm text-gray-400">Baños</div>
            <div className="text-xs text-gray-500">
              Promedio: {comparisonData.bathroomRange.avg.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedProperties.map((property, index) => (
          <div
            key={property.id}
            className="relative p-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveProperty(property.id)}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Remover de comparación"
            >
              <i className="fas fa-times text-sm" />
            </button>

            {/* Property Image */}
            <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-home text-4xl text-white/80" />
            </div>

            {/* Property Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{property.name}</h3>
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

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-white">{property.area} m²</div>
                  <div className="text-xs text-gray-400">Área</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{property.bedrooms}</div>
                  <div className="text-xs text-gray-400">Dormitorios</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{property.bathrooms}</div>
                  <div className="text-xs text-gray-400">Baños</div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-2">Amenidades</div>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                        +{property.amenities.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-300 text-sm line-clamp-2">
                {property.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300">
          <i className="fas fa-download mr-2" />
          Exportar Comparación
        </button>
        <button className="px-6 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300">
          <i className="fas fa-share mr-2" />
          Compartir Comparación
        </button>
      </div>
    </div>
  )
}
