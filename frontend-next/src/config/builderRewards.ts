// Builder Rewards Configuration for WalletConnect $WCT Tokens
// Project ID: e1b7b8bda639fe3153018f6c76ced0a4

export const BUILDER_REWARDS_CONFIG = {
  // WalletConnect Integration Metrics
  walletConnect: {
    projectId: 'e1b7b8bda639fe3153018f6c76ced0a4',
    usage: {
      // Track wallet connections
      connections: 0,
      // Track transactions
      transactions: 0,
      // Track unique users
      uniqueUsers: new Set<string>(),
      // Track weekly activity
      weeklyActivity: {
        connections: 0,
        transactions: 0,
        newUsers: 0
      }
    }
  },

  // Base Network Configuration
  baseNetwork: {
    chainId: 84532, // Base Sepolia
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org'
  },

  // Smart Contracts on Base
  deployedContracts: {
    propertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
    propertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
    escrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
    propertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
    propertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
    propertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
  },

  // Analytics for Builder Score
  analytics: {
    // Track user engagement
    userEngagement: {
      totalSessions: 0,
      averageSessionDuration: 0,
      pageViews: 0,
      uniqueVisitors: new Set<string>()
    },
    
    // Track contract interactions
    contractInteractions: {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      gasUsed: 0,
      transactionFees: 0
    },

    // Track weekly metrics
    weeklyMetrics: {
      startDate: new Date(),
      connections: 0,
      transactions: 0,
      newUsers: 0,
      contractCalls: 0
    }
  },

  // GitHub Repository Information
  repository: {
    url: 'https://github.com/your-username/blockbase-real-estate',
    isPublic: true,
    contributions: {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      stars: 0,
      forks: 0
    }
  },

  // Builder Information
  builder: {
    basename: 'vaiosx.base.eth',
    builderScore: 0, // Will be updated when available
    isEligible: true,
    lastActivity: new Date(),
    totalRewards: 0
  }
}

// Function to track wallet connections for Builder Rewards
export function trackWalletConnection(userAddress: string) {
  BUILDER_REWARDS_CONFIG.walletConnect.usage.connections++
  BUILDER_REWARDS_CONFIG.walletConnect.usage.uniqueUsers.add(userAddress)
  BUILDER_REWARDS_CONFIG.walletConnect.usage.weeklyActivity.connections++
  
  // Track in analytics
  BUILDER_REWARDS_CONFIG.analytics.userEngagement.uniqueVisitors.add(userAddress)
  BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.connections++
  
  console.log('🔗 Wallet connection tracked for Builder Rewards:', {
    totalConnections: BUILDER_REWARDS_CONFIG.walletConnect.usage.connections,
    uniqueUsers: BUILDER_REWARDS_CONFIG.walletConnect.usage.uniqueUsers.size,
    weeklyConnections: BUILDER_REWARDS_CONFIG.walletConnect.usage.weeklyActivity.connections
  })
}

// Function to track transactions for Builder Rewards
export function trackTransaction(transactionHash: string, gasUsed: string, success: boolean) {
  BUILDER_REWARDS_CONFIG.walletConnect.usage.transactions++
  BUILDER_REWARDS_CONFIG.walletConnect.usage.weeklyActivity.transactions++
  
  // Track in analytics
  BUILDER_REWARDS_CONFIG.analytics.contractInteractions.totalTransactions++
  BUILDER_REWARDS_CONFIG.analytics.contractInteractions.gasUsed += parseInt(gasUsed)
  
  if (success) {
    BUILDER_REWARDS_CONFIG.analytics.contractInteractions.successfulTransactions++
  } else {
    BUILDER_REWARDS_CONFIG.analytics.contractInteractions.failedTransactions++
  }
  
  BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.transactions++
  
  console.log('📊 Transaction tracked for Builder Rewards:', {
    totalTransactions: BUILDER_REWARDS_CONFIG.walletConnect.usage.transactions,
    weeklyTransactions: BUILDER_REWARDS_CONFIG.walletConnect.usage.weeklyActivity.transactions,
    success,
    gasUsed
  })
}

// Function to track contract interactions
export function trackContractInteraction(contractAddress: string, functionName: string) {
  BUILDER_REWARDS_CONFIG.analytics.contractInteractions.totalTransactions++
  BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.contractCalls++
  
  console.log('🏠 Contract interaction tracked for Builder Rewards:', {
    contract: contractAddress,
    function: functionName,
    totalCalls: BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.contractCalls
  })
}

// Function to get weekly metrics for Builder Rewards
export function getWeeklyMetrics() {
  return {
    connections: BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.connections,
    transactions: BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.transactions,
    newUsers: BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.newUsers,
    contractCalls: BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics.contractCalls,
    uniqueUsers: BUILDER_REWARDS_CONFIG.walletConnect.usage.uniqueUsers.size
  }
}

// Function to reset weekly metrics (call every Tuesday at 12:00 PM UTC)
export function resetWeeklyMetrics() {
  BUILDER_REWARDS_CONFIG.walletConnect.usage.weeklyActivity = {
    connections: 0,
    transactions: 0,
    newUsers: 0
  }
  
  BUILDER_REWARDS_CONFIG.analytics.weeklyMetrics = {
    startDate: new Date(),
    connections: 0,
    transactions: 0,
    newUsers: 0,
    contractCalls: 0
  }
  
  console.log('🔄 Weekly metrics reset for Builder Rewards')
}
