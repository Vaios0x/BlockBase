// Tipos globales para la aplicación BlockBase

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

// Tipos para las propiedades
export interface Property {
  id: number
  owner: string
  name: string
  description: string
  price: bigint
  isRented: boolean
  isActive: boolean
}

// Tipos para las subastas
export interface Auction {
  id: number
  propertyId: number
  highestBid: bigint
  highestBidder: string
  endTime: number
  isActive: boolean
}

// Tipos para los seguros
export interface Insurance {
  id: number
  propertyId: number
  premium: bigint
  coverage: bigint
  isActive: boolean
}

export {}