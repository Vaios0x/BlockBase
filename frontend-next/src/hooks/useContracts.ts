import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from 'wagmi'
import { useBuilderRewards } from './useBuilderRewards'

// ABI simplificado para los contratos principales
const PROPERTY_RENTAL_ABI = [
  {
    "inputs": [],
    "name": "getAllProperties",
    "outputs": [
      {
        "internalType": "tuple[]",
        "name": "",
        "type": "tuple[]",
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "owner", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "bool", "name": "isRented", "type": "bool"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ]
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_price", "type": "uint256"}
    ],
    "name": "createProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
    "name": "rentProperty",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

const PROPERTY_NFT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Direcciones de los contratos
const CONTRACT_ADDRESSES = {
  propertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
  propertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
  escrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
  propertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
  propertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
  propertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
} as const

export function usePropertyRental() {
  const { address } = useAccount()
  const { trackContractCall, trackSuccessfulTransaction, trackFailedTransaction } = useBuilderRewards()
  
  // Leer todas las propiedades
  const { data: properties, isLoading: loadingProperties, refetch: refetchProperties } = useReadContract({
    address: CONTRACT_ADDRESSES.propertyRental,
    abi: PROPERTY_RENTAL_ABI,
    functionName: 'getAllProperties',
  })

  // Escribir contrato para crear propiedad
  const { writeContract: createProperty, isPending: isCreatingProperty } = useWriteContract()

  // Escribir contrato para rentar propiedad
  const { writeContract: rentProperty, isPending: isRentingProperty } = useWriteContract()

  const createNewProperty = async (name: string, description: string, price: string) => {
    try {
      // Track contract interaction for Builder Rewards
      trackContractCall(CONTRACT_ADDRESSES.propertyRental, 'createProperty')
      
      await createProperty({
        address: CONTRACT_ADDRESSES.propertyRental,
        abi: PROPERTY_RENTAL_ABI,
        functionName: 'createProperty',
        args: [name, description, BigInt(price)]
      })
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  }

  const rentPropertyById = async (propertyId: number, value: string) => {
    try {
      // Track contract interaction for Builder Rewards
      trackContractCall(CONTRACT_ADDRESSES.propertyRental, 'rentProperty')
      
      await rentProperty({
        address: CONTRACT_ADDRESSES.propertyRental,
        abi: PROPERTY_RENTAL_ABI,
        functionName: 'rentProperty',
        args: [BigInt(propertyId)],
        value: BigInt(value)
      })
    } catch (error) {
      console.error('Error renting property:', error)
      throw error
    }
  }

  return {
    properties,
    loadingProperties,
    refetchProperties,
    createNewProperty,
    rentPropertyById,
    isCreatingProperty,
    isRentingProperty,
    userAddress: address
  }
}

export function usePropertyNFT() {
  const { address } = useAccount()

  // Obtener balance de NFTs del usuario
  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.propertyNFT,
    abi: PROPERTY_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  return {
    nftBalance,
    userAddress: address
  }
}
