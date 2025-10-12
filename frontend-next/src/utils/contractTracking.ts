// Automatic Contract Interaction Tracking for Builder Rewards
// This ensures all contract interactions are properly tracked for WalletConnect Builder Rewards

import { contractTracker } from '@/config/contractTracking'

// Track contract interactions automatically
export function setupAutomaticTracking() {
  if (typeof window === 'undefined') return

  // Track all contract calls
  const originalSend = (window as any).ethereum?.send
  if (originalSend) {
    (window as any).ethereum.send = function(...args: any[]) {
      const result = originalSend.apply(this, args)
      
      // Track if it's a contract interaction
      if (args[0]?.method === 'eth_sendTransaction' || args[0]?.method === 'eth_call') {
        const transaction = args[0]?.params?.[0]
        if (transaction?.to) {
          console.log('🎯 Builder Rewards: Contract interaction detected', {
            to: transaction.to,
            method: args[0].method,
            from: transaction.from
          })
          
          // Track the interaction
          contractTracker.trackContractInteraction(
            transaction.to,
            args[0].method,
            transaction.from || 'unknown'
          )
        }
      }
      
      return result
    }
  }

  // Track wallet connections
  const originalRequest = (window as any).ethereum?.request
  if (originalRequest) {
    (window as any).ethereum.request = function(...args: any[]) {
      const result = originalRequest.apply(this, args)
      
      // Track wallet connection
      if (args[0]?.method === 'eth_requestAccounts') {
        result.then((accounts: string[]) => {
          if (accounts.length > 0) {
            console.log('🎯 Builder Rewards: Wallet connection detected', {
              accounts: accounts[0]
            })
            contractTracker.trackWalletConnection(accounts[0])
          }
        })
      }
      
      return result
    }
  }

  // Track successful transactions
  if ((window as any).ethereum?.on) {
    (window as any).ethereum.on('transactionHash', (txHash: string) => {
      console.log('🎯 Builder Rewards: Transaction hash detected', { txHash })
      // We'll track this when we get more details
    })
  }

  // Track page visibility changes to ensure we're active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('🎯 Builder Rewards: Page became visible - ensuring tracking is active')
    }
  })

  // Track user interactions
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target?.closest('[data-contract-address]')) {
      const contractAddress = target.closest('[data-contract-address]')?.getAttribute('data-contract-address')
      if (contractAddress) {
        console.log('🎯 Builder Rewards: Contract interaction via UI', { contractAddress })
        contractTracker.trackContractInteraction(
          contractAddress,
          'ui_interaction',
          'user_click'
        )
      }
    }
  })

  console.log('🎯 Builder Rewards: Automatic tracking setup complete')
}

// Track specific contract interactions
export function trackContractCall(contractAddress: string, functionName: string, userAddress: string) {
  console.log('🎯 Builder Rewards: Manual contract call tracking', {
    contractAddress,
    functionName,
    userAddress
  })
  
  contractTracker.trackContractInteraction(contractAddress, functionName, userAddress)
}

// Track successful transactions
export function trackSuccessfulTransaction(txHash: string, gasUsed: string, userAddress: string) {
  console.log('🎯 Builder Rewards: Successful transaction tracking', {
    txHash,
    gasUsed,
    userAddress
  })
  
  contractTracker.trackTransaction(txHash, gasUsed, true, userAddress)
}

// Track failed transactions
export function trackFailedTransaction(txHash: string, gasUsed: string, userAddress: string) {
  console.log('🎯 Builder Rewards: Failed transaction tracking', {
    txHash,
    gasUsed,
    userAddress
  })
  
  contractTracker.trackTransaction(txHash, gasUsed, false, userAddress)
}

// Get current metrics
export function getCurrentMetrics() {
  return contractTracker.getWeeklyMetrics()
}

// Reset weekly metrics
export function resetWeeklyMetrics() {
  contractTracker.resetWeeklyMetrics()
}

// Get verified contracts
export function getVerifiedContracts() {
  return contractTracker.getVerifiedContracts()
}

// Check if contract is verified
export function isContractVerified(contractAddress: string) {
  return contractTracker.isContractVerified(contractAddress)
}

// Get contract by address
export function getContractByAddress(contractAddress: string) {
  return contractTracker.getContractByAddress(contractAddress)
}

// Initialize tracking on page load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutomaticTracking)
  } else {
    setupAutomaticTracking()
  }
}
