import { useEffect, useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { 
  trackWalletConnection, 
  trackTransaction, 
  trackContractInteraction,
  getWeeklyMetrics,
  resetWeeklyMetrics,
  BUILDER_REWARDS_CONFIG 
} from '@/config/builderRewards'

export function useBuilderRewards() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  // Track wallet connection when user connects
  useEffect(() => {
    if (isConnected && address) {
      trackWalletConnection(address)
    }
  }, [isConnected, address])

  // Track when user is on Base network
  useEffect(() => {
    if (chainId === 84532) { // Base Sepolia
      console.log('🎯 User connected to Base network - Builder Rewards eligible')
    }
  }, [chainId])

  // Function to track contract interactions
  const trackContractCall = useCallback((contractAddress: string, functionName: string) => {
    trackContractInteraction(contractAddress, functionName)
  }, [])

  // Function to track successful transactions
  const trackSuccessfulTransaction = useCallback((txHash: string, gasUsed: string) => {
    trackTransaction(txHash, gasUsed, true)
  }, [])

  // Function to track failed transactions
  const trackFailedTransaction = useCallback((txHash: string, gasUsed: string) => {
    trackTransaction(txHash, gasUsed, false)
  }, [])

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
      isOnBase: chainId === 84532,
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
    config: BUILDER_REWARDS_CONFIG
  }
}
