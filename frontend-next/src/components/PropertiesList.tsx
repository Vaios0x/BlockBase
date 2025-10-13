'use client'

import { usePropertyRental } from '@/hooks/useContracts'
import NeuralButton from './NeuralButton'
import { useState, useCallback } from 'react'

interface Property {
  id: string
  name: string
  description: string
  price: string
  isRented: boolean
  isActive: boolean
  owner: string
}

export default function PropertiesList() {
  const { 
    properties, 
    loadingProperties, 
    createNewProperty, 
    rentPropertyById, 
    isCreatingProperty, 
    isRentingProperty 
  } = usePropertyRental()
  
  const [creatingPropertyId, setCreatingPropertyId] = useState<string | null>(null)
  const [rentingPropertyId, setRentingPropertyId] = useState<string | null>(null)

  const handleCreateProperty = useCallback(async () => {
    try {
      setCreatingPropertyId('creating')
      await createNewProperty(
        'Villa Moderna',
        'Hermosa villa con vista al mar en Madrid',
        '2500000000000000000' // 2.5 ETH en wei
      )
    } catch (error) {
      console.error('Error creating property:', error)
    } finally {
      setCreatingPropertyId(null)
    }
  }, [createNewProperty])

  const handleRentProperty = useCallback(async (propertyId: string, price: string) => {
    try {
      setRentingPropertyId(propertyId)
      await rentPropertyById(Number(propertyId), price)
    } catch (error) {
      console.error('Error renting property:', error)
    } finally {
      setRentingPropertyId(null)
    }
  }, [rentPropertyById])

  const formatPrice = (price: string) => {
    const ethPrice = Number(price) / Math.pow(10, 18)
    return ethPrice.toFixed(2)
  }

  const getPropertyStatus = (property: Property) => {
    if (!property.isActive) return { text: 'Inactiva', color: 'bg-gray-500/20 text-gray-400' }
    if (property.isRented) return { text: 'Rentada', color: 'bg-red-500/20 text-red-400' }
    return { text: 'Disponible', color: 'bg-green-500/20 text-green-400' }
  }

  if (loadingProperties) {
    return (
      <div className="flex justify-center items-center p-8" role="status" aria-label="Cargando propiedades">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <span className="sr-only">Cargando propiedades...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Propiedades Disponibles</h2>
          <p className="text-gray-400 text-sm mt-1">
            {properties?.length || 0} propiedades encontradas
          </p>
        </div>
        <NeuralButton
          variant="primary"
          onClick={handleCreateProperty}
          disabled={isCreatingProperty || creatingPropertyId === 'creating'}
          className="flex items-center gap-2"
          aria-label="Crear nueva propiedad"
        >
          <i className="fas fa-plus"></i>
          {isCreatingProperty || creatingPropertyId === 'creating' ? 'Creando...' : 'Crear Propiedad'}
        </NeuralButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties && properties.length > 0 ? (
          properties.map((property: Property, index: number) => {
            const status = getPropertyStatus(property)
            const isRentingThis = rentingPropertyId === property.id
            const isDisabled = property.isRented || isRentingProperty || isRentingThis
            
            return (
              <div 
                key={property.id} 
                className="p-6 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-400"
                role="article"
                aria-label={`Propiedad: ${property.name}`}
              >
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <i className="fas fa-home text-4xl text-white/80"></i>
                    {property.isRented && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Rentada
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{property.name}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2">{property.description}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-cyan-400">
                        {formatPrice(property.price)} ETH
                      </span>
                      <span className="text-gray-400 text-sm">/ mes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.isActive 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {property.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                  
                  <NeuralButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleRentProperty(property.id, property.price)}
                    disabled={isDisabled}
                    className="w-full flex items-center justify-center gap-2"
                    aria-label={`${isDisabled ? 'No se puede rentar' : 'Rentar'} propiedad ${property.name}`}
                  >
                    <i className="fas fa-key"></i>
                    {isRentingThis ? 'Rentando...' : 
                     property.isRented ? 'Ya Rentada' : 
                     isRentingProperty ? 'Procesando...' : 'Rentar'}
                  </NeuralButton>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg">
              <i className="fas fa-home text-4xl mb-4"></i>
              <p>No hay propiedades disponibles</p>
              <p className="text-sm mt-2">Crea la primera propiedad para comenzar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
