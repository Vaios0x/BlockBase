// Contract Tracking Configuration for Builder Rewards
// This ensures verified contracts are properly tracked for WalletConnect Builder Rewards

export const VERIFIED_CONTRACTS = {
  PropertyRental: {
    address: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
    name: 'PropertyRental',
    function: 'Core marketplace for buying/renting',
    commission: '2%',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0x7094f1eb1c49Cf89B793844CecE4baE655f3359b'
  },
  PropertyNFT: {
    address: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
    name: 'PropertyNFT',
    function: 'Digital property ownership',
    commission: 'None (ERC721)',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0x51FBdDcD12704e4FCc28880E22b582362811cCdf'
  },
  EscrowService: {
    address: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
    name: 'EscrowService',
    function: 'Secure transaction custody',
    commission: '1%',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4'
  },
  PropertyAuction: {
    address: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
    name: 'PropertyAuction',
    function: 'Dynamic pricing through auctions',
    commission: '2%',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0x1b43c611F3709e2372a108E3424a7C0D89724e93'
  },
  PropertyInsurance: {
    address: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
    name: 'PropertyInsurance',
    function: 'Risk management and protection',
    commission: '5%',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff'
  },
  PropertyManagement: {
    address: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6',
    name: 'PropertyManagement',
    function: 'Complete property lifecycle',
    commission: '3%',
    verified: true,
    network: 'Base Sepolia',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org/address/0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
  }
} as const

// Contract interaction tracking for Builder Rewards
export class ContractActivityTracker {
  private static instance: ContractActivityTracker
  private activityLog: Map<string, any[]> = new Map()
  private weeklyMetrics: {
    contractCalls: number
    uniqueUsers: number
    transactions: number
    connections: number
    verifiedContracts: string[]
  } = {
    contractCalls: 0,
    uniqueUsers: 0,
    transactions: 0,
    connections: 0,
    verifiedContracts: Object.keys(VERIFIED_CONTRACTS)
  }

  static getInstance(): ContractActivityTracker {
    if (!ContractActivityTracker.instance) {
      ContractActivityTracker.instance = new ContractActivityTracker()
    }
    return ContractActivityTracker.instance
  }

  // Track contract interaction for Builder Rewards
  trackContractInteraction(contractAddress: string, functionName: string, userAddress: string) {
    const contract = Object.values(VERIFIED_CONTRACTS).find(c => c.address.toLowerCase() === contractAddress.toLowerCase())
    
    if (contract) {
      console.log(`🎯 Builder Rewards: Contract interaction tracked`, {
        contract: contract.name,
        address: contractAddress,
        function: functionName,
        user: userAddress,
        verified: contract.verified
      })

      // Track for Builder Rewards metrics
      this.weeklyMetrics.contractCalls++
      
      // Store interaction for analytics
      const key = `${contractAddress}-${userAddress}`
      if (!this.activityLog.has(key)) {
        this.activityLog.set(key, [])
        this.weeklyMetrics.uniqueUsers++
      }
      
      this.activityLog.get(key)?.push({
        timestamp: Date.now(),
        function: functionName,
        contract: contract.name
      })

      // Emit event for external tracking
      this.emitBuilderRewardsEvent('contract_interaction', {
        contractAddress,
        contractName: contract.name,
        functionName,
        userAddress,
        verified: true
      })
    }
  }

  // Track transaction for Builder Rewards
  trackTransaction(txHash: string, gasUsed: string, success: boolean, userAddress: string) {
    console.log(`🎯 Builder Rewards: Transaction tracked`, {
      txHash,
      gasUsed,
      success,
      user: userAddress
    })

    this.weeklyMetrics.transactions++

    // Emit event for external tracking
    this.emitBuilderRewardsEvent('transaction', {
      txHash,
      gasUsed,
      success,
      userAddress
    })
  }

  // Track wallet connection for Builder Rewards
  trackWalletConnection(userAddress: string) {
    console.log(`🎯 Builder Rewards: Wallet connection tracked`, {
      user: userAddress,
      timestamp: Date.now()
    })

    this.weeklyMetrics.connections++

    // Emit event for external tracking
    this.emitBuilderRewardsEvent('wallet_connection', {
      userAddress,
      timestamp: Date.now()
    })
  }

  // Get weekly metrics for Builder Rewards
  getWeeklyMetrics() {
    return {
      ...this.weeklyMetrics,
      verifiedContractsCount: this.weeklyMetrics.verifiedContracts.length,
      totalActivity: this.activityLog.size,
      lastUpdated: new Date().toISOString()
    }
  }

  // Reset weekly metrics (call every Tuesday)
  resetWeeklyMetrics() {
    this.weeklyMetrics = {
      contractCalls: 0,
      uniqueUsers: 0,
      transactions: 0,
      connections: 0,
      verifiedContracts: Object.keys(VERIFIED_CONTRACTS)
    }
    this.activityLog.clear()
    console.log('🔄 Builder Rewards: Weekly metrics reset')
  }

  // Emit events for external tracking systems
  private emitBuilderRewardsEvent(eventType: string, data: any) {
    // Emit custom event for Builder Rewards tracking
    const event = new CustomEvent('builderRewardsActivity', {
      detail: {
        type: eventType,
        data,
        timestamp: Date.now(),
        source: 'BlockBase'
      }
    })
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event)
    }

    // Also emit to global tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'builder_rewards_activity', {
        event_category: 'Builder Rewards',
        event_label: eventType,
        value: 1
      })
    }
  }

  // Get verified contracts information
  getVerifiedContracts() {
    return Object.values(VERIFIED_CONTRACTS)
  }

  // Check if contract is verified
  isContractVerified(contractAddress: string): boolean {
    return Object.values(VERIFIED_CONTRACTS).some(
      contract => contract.address.toLowerCase() === contractAddress.toLowerCase()
    )
  }

  // Get contract by address
  getContractByAddress(contractAddress: string) {
    return Object.values(VERIFIED_CONTRACTS).find(
      contract => contract.address.toLowerCase() === contractAddress.toLowerCase()
    )
  }
}

// Export singleton instance
export const contractTracker = ContractActivityTracker.getInstance()

// Export helper functions
export const trackContractInteraction = (contractAddress: string, functionName: string, userAddress: string) => {
  contractTracker.trackContractInteraction(contractAddress, functionName, userAddress)
}

export const trackTransaction = (txHash: string, gasUsed: string, success: boolean, userAddress: string) => {
  contractTracker.trackTransaction(txHash, gasUsed, success, userAddress)
}

export const trackWalletConnection = (userAddress: string) => {
  contractTracker.trackWalletConnection(userAddress)
}

export const getWeeklyMetrics = () => {
  return contractTracker.getWeeklyMetrics()
}

export const resetWeeklyMetrics = () => {
  contractTracker.resetWeeklyMetrics()
}

export const getVerifiedContracts = () => {
  return contractTracker.getVerifiedContracts()
}

export const isContractVerified = (contractAddress: string) => {
  return contractTracker.isContractVerified(contractAddress)
}

export const getContractByAddress = (contractAddress: string) => {
  return contractTracker.getContractByAddress(contractAddress)
}
