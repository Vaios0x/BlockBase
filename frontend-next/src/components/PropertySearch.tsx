'use client'

import { useState, useCallback, useMemo } from 'react'
import { useDebouncedSearch } from '@/hooks/useDebounce'
import { cn } from '@/utils/cn'
import LoadingSpinner from './LoadingSpinner'

interface Property {
  id: string
  name: string
  description: string
  price: string
  location: string
  type: 'apartment' | 'house' | 'villa' | 'commercial'
  bedrooms: number
  bathrooms: number
  area: number
  isRented: boolean
  isActive: boolean
  images: string[]
  amenities: string[]
}

interface PropertySearchProps {
  onPropertySelect?: (property: Property) => void
  className?: string
}

const propertyTypes = [
  { value: 'all', label: 'Todos', icon: 'fas fa-building' },
  { value: 'apartment', label: 'Apartamento', icon: 'fas fa-home' },
  { value: 'house', label: 'Casa', icon: 'fas fa-house' },
  { value: 'villa', label: 'Villa', icon: 'fas fa-castle' },
  { value: 'commercial', label: 'Comercial', icon: 'fas fa-store' }
]

const priceRanges = [
  { label: 'Cualquier precio', min: 0, max: Infinity },
  { label: 'Hasta 1 ETH', min: 0, max: 1 },
  { label: '1 - 5 ETH', min: 1, max: 5 },
  { label: '5 - 10 ETH', min: 5, max: 10 },
  { label: 'Más de 10 ETH', min: 10, max: Infinity }
]

export default function PropertySearch({ onPropertySelect, className }: PropertySearchProps) {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'price' | 'area' | 'newest'>('newest')

  // Mock search function - en producción sería una API call
  const searchProperties = useCallback(async (query: string): Promise<Property[]> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data
    const mockProperties: Property[] = [
      {
        id: '1',
        name: 'Villa Moderna en Madrid',
        description: 'Hermosa villa con vista al mar',
        price: '2.5',
        location: 'Madrid, España',
        type: 'villa',
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        isRented: false,
        isActive: true,
        images: ['/images/villa1.jpg'],
        amenities: ['piscina', 'garaje', 'jardín']
      },
      {
        id: '2',
        name: 'Apartamento Centro',
        description: 'Apartamento moderno en el centro',
        price: '1.2',
        location: 'Barcelona, España',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        isRented: false,
        isActive: true,
        images: ['/images/apt1.jpg'],
        amenities: ['ascensor', 'balcón']
      }
    ]

    return mockProperties.filter(property => 
      property.name.toLowerCase().includes(query.toLowerCase()) ||
      property.description.toLowerCase().includes(query.toLowerCase()) ||
      property.location.toLowerCase().includes(query.toLowerCase())
    )
  }, [])

  const {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch
  } = useDebouncedSearch(searchProperties, 300)

  // Filtrar resultados por criterios seleccionados
  const filteredResults = useMemo(() => {
    if (!results) return []

    return results
      .filter(property => {
        // Filtrar por tipo
        if (selectedType !== 'all' && property.type !== selectedType) {
          return false
        }

        // Filtrar por rango de precio
        const price = parseFloat(property.price)
        const priceRange = priceRanges[selectedPriceRange]
        if (price < priceRange.min || price > priceRange.max) {
          return false
        }

        // Filtrar por amenidades
        if (selectedAmenities.length > 0) {
          const hasAllAmenities = selectedAmenities.every(amenity =>
            property.amenities.includes(amenity)
          )
          if (!hasAllAmenities) return false
        }

        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return parseFloat(a.price) - parseFloat(b.price)
          case 'area':
            return b.area - a.area
          case 'newest':
            return parseInt(b.id) - parseInt(a.id)
          default:
            return 0
        }
      })
  }, [results, selectedType, selectedPriceRange, selectedAmenities, sortBy])

  const handlePropertyClick = useCallback((property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }, [onPropertySelect])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-search text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar propiedades por nombre, descripción o ubicación..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tipo de propiedad */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Propiedad
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rango de Precio
          </label>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {priceRanges.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="newest">Más recientes</option>
            <option value="price">Precio</option>
            <option value="area">Área</option>
          </select>
        </div>

        {/* Limpiar filtros */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedType('all')
              setSelectedPriceRange(0)
              setSelectedAmenities([])
              setSortBy('newest')
            }}
            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="space-y-4">
        {isSearching && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Buscando propiedades..." showText />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">
              <i className="fas fa-exclamation-triangle text-2xl" />
            </div>
            <p className="text-gray-400">Error al buscar propiedades</p>
          </div>
        )}

        {!isSearching && !error && filteredResults.length === 0 && query && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <i className="fas fa-search text-2xl" />
            </div>
            <p className="text-gray-400">No se encontraron propiedades</p>
          </div>
        )}

        {!isSearching && !error && filteredResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(property => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className="p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-home text-4xl text-white/80" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{property.name}</h3>
                    <p className="text-gray-300 text-sm">{property.location}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{property.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-400">
                        {property.price} ETH
                      </span>
                      <span className="text-sm text-gray-400">
                        {property.area}m²
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span><i className="fas fa-bed mr-1" />{property.bedrooms}</span>
                      <span><i className="fas fa-bath mr-1" />{property.bathrooms}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
