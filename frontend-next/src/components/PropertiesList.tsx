'use client'

import { usePropertyRental } from '@/hooks/useContracts'
import NeuralButton from './NeuralButton'

export default function PropertiesList() {
  const { 
    properties, 
    loadingProperties, 
    createNewProperty, 
    rentPropertyById, 
    isCreatingProperty, 
    isRentingProperty 
  } = usePropertyRental()

  const handleCreateProperty = async () => {
    try {
      await createNewProperty(
        'Villa Moderna',
        'Hermosa villa con vista al mar en Madrid',
        '2500000000000000000' // 2.5 ETH en wei
      )
    } catch (error) {
      console.error('Error creating property:', error)
    }
  }

  const handleRentProperty = async (propertyId: number, price: string) => {
    try {
      await rentPropertyById(propertyId, price)
    } catch (error) {
      console.error('Error renting property:', error)
    }
  }

  if (loadingProperties) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Propiedades Disponibles</h2>
        <NeuralButton
          variant="primary"
          onClick={handleCreateProperty}
          disabled={isCreatingProperty}
          className="flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          {isCreatingProperty ? 'Creando...' : 'Crear Propiedad'}
        </NeuralButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties && properties.length > 0 ? (
          properties.map((property: any, index: number) => (
            <div key={index} className="p-6 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-home text-4xl text-white/80"></i>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{property.name}</h3>
                  <p className="text-gray-300 text-sm">{property.description}</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-cyan-400">
                      {(Number(property.price) / Math.pow(10, 18)).toFixed(2)} ETH
                    </span>
                    <span className="text-gray-400">/ mes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.isRented 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {property.isRented ? 'Rentada' : 'Disponible'}
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
                  onClick={() => handleRentProperty(Number(property.id), property.price)}
                  disabled={property.isRented || isRentingProperty}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <i className="fas fa-key"></i>
                  {isRentingProperty ? 'Rentando...' : property.isRented ? 'Ya Rentada' : 'Rentar'}
                </NeuralButton>
              </div>
            </div>
          ))
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
