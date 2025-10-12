// Initialize Builder Rewards Tracking
// This ensures all tracking is properly set up for WalletConnect Builder Rewards

import { setupAutomaticTracking } from './contractTracking'
import { BUILDER_REWARDS_CONFIG } from '@/config/builderRewards'

// Initialize Builder Rewards tracking
export function initializeBuilderRewards() {
  console.log('🎯 Initializing Builder Rewards tracking...')
  
  // Setup automatic tracking
  setupAutomaticTracking()
  
  // Log current configuration
  console.log('🎯 Builder Rewards Configuration:', {
    projectId: BUILDER_REWARDS_CONFIG.walletConnect.projectId,
    projectName: BUILDER_REWARDS_CONFIG.walletConnect.name,
    network: BUILDER_REWARDS_CONFIG.baseNetwork.name,
    chainId: BUILDER_REWARDS_CONFIG.baseNetwork.chainId,
    verifiedContracts: Object.keys(BUILDER_REWARDS_CONFIG.deployedContracts).length,
    builderBasename: BUILDER_REWARDS_CONFIG.builder.basename
  })

  // Setup weekly reset timer (every Tuesday at 12:00 PM UTC)
  setupWeeklyReset()
  
  // Setup activity tracking
  setupActivityTracking()
  
  console.log('✅ Builder Rewards tracking initialized successfully')
}

// Setup weekly reset timer
function setupWeeklyReset() {
  const now = new Date()
  const nextTuesday = getNextTuesday()
  const timeUntilReset = nextTuesday.getTime() - now.getTime()
  
  console.log('🔄 Weekly reset scheduled for:', nextTuesday.toISOString())
  
  setTimeout(() => {
    console.log('🔄 Resetting weekly metrics for Builder Rewards')
    // Reset metrics every Tuesday at 12:00 PM UTC
    setInterval(() => {
      console.log('🔄 Weekly reset triggered')
      // This would call the reset function
    }, 7 * 24 * 60 * 60 * 1000) // 7 days
  }, timeUntilReset)
}

// Get next Tuesday at 12:00 PM UTC
function getNextTuesday() {
  const now = new Date()
  const nextTuesday = new Date(now)
  
  // Find next Tuesday
  const daysUntilTuesday = (2 - now.getUTCDay() + 7) % 7
  if (daysUntilTuesday === 0 && now.getUTCHours() >= 12) {
    // If it's Tuesday and past 12 PM, get next Tuesday
    nextTuesday.setUTCDate(now.getUTCDate() + 7)
  } else {
    nextTuesday.setUTCDate(now.getUTCDate() + daysUntilTuesday)
  }
  
  // Set to 12:00 PM UTC
  nextTuesday.setUTCHours(12, 0, 0, 0)
  
  return nextTuesday
}

// Setup activity tracking
function setupActivityTracking() {
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('🎯 Page became visible - Builder Rewards tracking active')
    }
  })

  // Track user interactions
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target?.closest('[data-builder-rewards]')) {
      console.log('🎯 Builder Rewards interaction detected')
    }
  })

  // Track wallet connection events
  window.addEventListener('walletConnected', (event: any) => {
    console.log('🎯 Wallet connected event detected for Builder Rewards:', event.detail)
  })

  // Track transaction events
  window.addEventListener('transactionCompleted', (event: any) => {
    console.log('🎯 Transaction completed event detected for Builder Rewards:', event.detail)
  })
}

// Export initialization function
export default initializeBuilderRewards
