import { useEffect, useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { 
  trackWalletConnection, 
  trackTransaction, 
  trackContractInteraction,
  getWeeklyMetrics,
  resetWeeklyMetrics,
  getVerifiedContracts,
  isContractVerified,
  getContractByAddress
} from '@/config/contractTracking'
import { BUILDER_REWARDS_CONFIG } from '@/config/builderRewards'

export function useBuilderRewards() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  // Track wallet connection when user connects
  useEffect(() => {
    if (isConnected && address) {
      trackWalletConnection(address)
      console.log('🎯 Builder Rewards: Wallet connected and tracked', { address })
    }
  }, [isConnected, address])

  // Track when user is on Base network
  useEffect(() => {
    if ((() => {
      const baseChainIds = [84532, 8453, 84531]
      return baseChainIds.includes(chainId as any)
    })()) { // Base networks
      console.log('🎯 User connected to Base network - Builder Rewards eligible')
    }
  }, [chainId])

  // Function to track contract interactions
  const trackContractCall = useCallback((contractAddress: string, functionName: string) => {
    if (address) {
      trackContractInteraction(contractAddress, functionName, address)
      console.log('🎯 Builder Rewards: Contract call tracked', { contractAddress, functionName, user: address })
    }
  }, [address])

  // Function to track successful transactions
  const trackSuccessfulTransaction = useCallback((txHash: string, gasUsed: string) => {
    if (address) {
      trackTransaction(txHash, gasUsed, true, address)
      console.log('🎯 Builder Rewards: Successful transaction tracked', { txHash, user: address })
    }
  }, [address])

  // Function to track failed transactions
  const trackFailedTransaction = useCallback((txHash: string, gasUsed: string) => {
    if (address) {
      trackTransaction(txHash, gasUsed, false, address)
      console.log('🎯 Builder Rewards: Failed transaction tracked', { txHash, user: address })
    }
  }, [address])

  // Function to get current metrics
  const getCurrentMetrics = useCallback(() => {
    return getWeeklyMetrics()
  }, [])

  // Function to reset weekly metrics (call every Tuesday)
  const resetMetrics = useCallback(() => {
    resetWeeklyMetrics()
  }, [])

  // Function to check if user is eligible for Builder Rewards
  const isEligibleForRewards = useCallback(() => {
    return {
      hasBasename: true, // ✅ vaiosx.base.eth confirmed
      basename: 'vaiosx.base.eth',
      hasBuilderScore: true, // You need to verify this (≥40)
      isOnBase: (() => {
        const baseChainIds = [84532, 8453, 84531]
        return baseChainIds.includes(chainId as any)
      })(),
      isConnected: isConnected,
      projectId: BUILDER_REWARDS_CONFIG.walletConnect.projectId,
      builderInfo: BUILDER_REWARDS_CONFIG.builder
    }
  }, [chainId, isConnected])

  // Function to get Builder Score requirements
  const getBuilderScoreInfo = useCallback(() => {
    return {
      requiredScore: 40,
      currentMetrics: getCurrentMetrics(),
      tips: [
        'Deploy contracts on Base network',
        'Contribute to open source repositories',
        'Use WalletConnect/Reown AppKit in your dApp',
        'Maintain active user engagement',
        'Keep contracts active with regular transactions'
      ]
    }
  }, [getCurrentMetrics])

  return {
    trackContractCall,
    trackSuccessfulTransaction,
    trackFailedTransaction,
    getCurrentMetrics,
    resetMetrics,
    isEligibleForRewards,
    getBuilderScoreInfo,
    getVerifiedContracts,
    isContractVerified,
    getContractByAddress,
    config: BUILDER_REWARDS_CONFIG
  }
}
