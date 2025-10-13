'use client'

import { useState, useCallback, useMemo } from 'react'
import { cn } from '@/utils/cn'

interface FilterState {
  priceRange: [number, number]
  propertyType: string[]
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
  location: string
  sortBy: 'price' | 'area' | 'newest' | 'oldest'
  sortOrder: 'asc' | 'desc'
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartamento', icon: 'fas fa-home' },
  { value: 'house', label: 'Casa', icon: 'fas fa-house' },
  { value: 'villa', label: 'Villa', icon: 'fas fa-castle' },
  { value: 'commercial', label: 'Comercial', icon: 'fas fa-store' },
  { value: 'land', label: 'Terreno', icon: 'fas fa-tree' }
]

const amenities = [
  { value: 'pool', label: 'Piscina', icon: 'fas fa-swimming-pool' },
  { value: 'garage', label: 'Garaje', icon: 'fas fa-car' },
  { value: 'garden', label: 'Jardín', icon: 'fas fa-seedling' },
  { value: 'elevator', label: 'Ascensor', icon: 'fas fa-elevator' },
  { value: 'balcony', label: 'Balcón', icon: 'fas fa-balcony' },
  { value: 'security', label: 'Seguridad 24/7', icon: 'fas fa-shield-alt' },
  { value: 'gym', label: 'Gimnasio', icon: 'fas fa-dumbbell' },
  { value: 'parking', label: 'Estacionamiento', icon: 'fas fa-parking' }
]

const bedroomOptions = [1, 2, 3, 4, 5, 6]
const bathroomOptions = [1, 2, 3, 4, 5]

export default function PropertyFilters({ onFiltersChange, className }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    location: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }, [filters, onFiltersChange])

  const handleMultiSelect = useCallback((key: 'propertyType' | 'bedrooms' | 'bathrooms' | 'amenities', value: string | number) => {
    const currentArray = filters[key] as (string | number)[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    handleFilterChange(key, newArray)
  }, [filters, handleFilterChange])

  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      priceRange: [0, 100],
      propertyType: [],
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      location: '',
      sortBy: 'newest',
      sortOrder: 'desc'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.propertyType.length > 0) count++
    if (filters.bedrooms.length > 0) count++
    if (filters.bathrooms.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.location) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++
    return count
  }, [filters])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
              {activeFiltersCount} activos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Limpiar todo
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <i className={cn('fas text-sm', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down')} />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={cn(
        'space-y-6 transition-all duration-300 overflow-hidden',
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Rango de Precio: {filters.priceRange[0]} - {filters.priceRange[1]} ETH
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 ETH</span>
              <span>100 ETH</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tipo de Propiedad
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => handleMultiSelect('propertyType', type.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
                  filters.propertyType.includes(type.value)
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <i className={cn('text-sm', type.icon)} />
                <span className="text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Dormitorios
          </label>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map(bedrooms => (
              <button
                key={bedrooms}
                onClick={() => handleMultiSelect('bedrooms', bedrooms)}
                className={cn(
                  'px-3 py-2 rounded-lg border transition-all duration-200',
                  filters.bedrooms.includes(bedrooms)
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                {bedrooms}+
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Baños
          </label>
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.map(bathrooms => (
              <button
                key={bathrooms}
                onClick={() => handleMultiSelect('bathrooms', bathrooms)}
                className={cn(
                  'px-3 py-2 rounded-lg border transition-all duration-200',
                  filters.bathrooms.includes(bathrooms)
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                {bathrooms}+
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Amenidades
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenities.map(amenity => (
              <button
                key={amenity.value}
                onClick={() => handleMultiSelect('amenities', amenity.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
                  filters.amenities.includes(amenity.value)
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <i className={cn('text-sm', amenity.icon)} />
                <span className="text-sm">{amenity.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ubicación
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Buscar por ciudad, país..."
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="price">Precio</option>
              <option value="area">Área</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Orden
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
