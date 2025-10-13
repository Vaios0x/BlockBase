/**
 * Advanced testing utilities for BlockBase
 * Comprehensive test helpers and mocks
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { AppKitProvider } from '@/context/AppKitProvider'

// Mock data generators
export const mockProperty = (overrides: Partial<any> = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Test Property',
  price: '1.5',
  area: 120,
  bedrooms: 3,
  bathrooms: 2,
  location: 'Test City',
  type: 'apartment',
  amenities: ['pool', 'garage'],
  images: ['/test-image.jpg'],
  description: 'Test property description',
  isRented: false,
  isActive: true,
  ...overrides
})

export const mockUser = (overrides: Partial<any> = {}) => ({
  address: '0x1234567890123456789012345678901234567890',
  chainId: 84532,
  isConnected: true,
  ...overrides
})

export const mockTransaction = (overrides: Partial<any> = {}) => ({
  hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  status: 'success',
  gasUsed: '21000',
  blockNumber: 12345678,
  timestamp: Date.now(),
  ...overrides
})

// Mock Web3 providers
export const mockWeb3Provider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true
}

export const mockWagmiConfig = {
  chains: [],
  connectors: [],
  publicClient: {
    getBlock: jest.fn(),
    getTransaction: jest.fn(),
    getBalance: jest.fn()
  },
  walletClient: {
    writeContract: jest.fn(),
    sendTransaction: jest.fn()
  }
}

// Custom render function with providers
export const renderWithProviders = (
  ui: ReactElement,
  options: RenderOptions & {
    initialEntries?: string[]
    user?: any
    web3Provider?: any
  } = {}
) => {
  const {
    initialEntries = ['/'],
    user = mockUser(),
    web3Provider = mockWeb3Provider,
    ...renderOptions
  } = options

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <AppKitProvider>
        {children}
      </AppKitProvider>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

// Mock blockchain interactions
export const mockBlockchainCalls = {
  getProperties: jest.fn().mockResolvedValue([mockProperty()]),
  createProperty: jest.fn().mockResolvedValue(mockTransaction()),
  rentProperty: jest.fn().mockResolvedValue(mockTransaction()),
  cancelRent: jest.fn().mockResolvedValue(mockTransaction()),
  getBalance: jest.fn().mockResolvedValue('1000000000000000000'), // 1 ETH
  getGasPrice: jest.fn().mockResolvedValue('20000000000'), // 20 gwei
  estimateGas: jest.fn().mockResolvedValue('21000')
}

// Test utilities for async operations
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms))

export const waitForCondition = async (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
) => {
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    if (condition()) {
      return true
    }
    await waitForAsync(interval)
  }
  
  throw new Error(`Condition not met within ${timeout}ms`)
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  }
}

// Mock fetch
export const mockFetch = (response: any, status: number = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response))
  })
}

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })
  window.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })
  window.ResizeObserver = mockResizeObserver
  return mockResizeObserver
}

// Mock performance
export const mockPerformance = () => {
  const mockPerformance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn()
  }
  
  Object.defineProperty(window, 'performance', {
    value: mockPerformance,
    writable: true
  })
  
  return mockPerformance
}

// Test data factories
export const createMockProperties = (count: number) => 
  Array.from({ length: count }, (_, index) => 
    mockProperty({ 
      id: `property-${index}`,
      name: `Property ${index + 1}`,
      price: (Math.random() * 10 + 0.5).toFixed(2)
    })
  )

export const createMockTransactions = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    mockTransaction({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: 12345678 + index
    })
  )

// Assertion helpers
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument()
}

export const expectToHaveTextContent = (element: HTMLElement | null, text: string) => {
  expect(element).toHaveTextContent(text)
}

export const expectToHaveClass = (element: HTMLElement | null, className: string) => {
  expect(element).toHaveClass(className)
}

export const expectToBeVisible = (element: HTMLElement | null) => {
  expect(element).toBeVisible()
}

// Mock error scenarios
export const mockNetworkError = () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
}

export const mockBlockchainError = () => {
  mockBlockchainCalls.createProperty.mockRejectedValue(new Error('Transaction failed'))
}

export const mockWalletError = () => {
  mockWeb3Provider.request.mockRejectedValue(new Error('User rejected request'))
}

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock console methods to reduce noise in tests
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage(),
    writable: true
  })
  
  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockLocalStorage(),
    writable: true
  })
  
  // Mock IntersectionObserver
  mockIntersectionObserver()
  
  // Mock ResizeObserver
  mockResizeObserver()
  
  // Mock performance
  mockPerformance()
}

export const cleanupTestEnvironment = () => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
}

// Custom matchers
export const customMatchers = {
  toBeValidProperty: (received: any) => {
    const hasRequiredFields = received && 
      typeof received.id === 'string' &&
      typeof received.name === 'string' &&
      typeof received.price === 'string' &&
      typeof received.area === 'number'
    
    return {
      message: () => `Expected ${received} to be a valid property`,
      pass: hasRequiredFields
    }
  },
  
  toBeValidTransaction: (received: any) => {
    const hasRequiredFields = received &&
      typeof received.hash === 'string' &&
      received.hash.startsWith('0x') &&
      typeof received.status === 'string'
    
    return {
      message: () => `Expected ${received} to be a valid transaction`,
      pass: hasRequiredFields
    }
  }
}

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidProperty(): R
      toBeValidTransaction(): R
    }
  }
}
