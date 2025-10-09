'use client'

import { useBuilderRewards } from '@/hooks/useBuilderRewards'
import { useAccount, useChainId } from 'wagmi'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function BuilderProfile() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { getCurrentMetrics, isEligibleForRewards } = useBuilderRewards()

  const metrics = getCurrentMetrics()
  const eligibility = isEligibleForRewards()

  return (
    <ClientOnlyWrapper>
      <div className="p-6 rounded-2xl border shadow-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md border-white/12">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-user text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-white">vaiosx.base.eth</h3>
            <p className="text-sm text-gray-400">Builder Profile</p>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              eligibility.hasBasename && eligibility.isOnBase && isConnected
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              <i className={`fas ${eligibility.hasBasename ? 'fa-check-circle' : 'fa-clock'}`}></i>
              {eligibility.hasBasename && eligibility.isOnBase && isConnected ? 'Active Builder' : 'Pending Activation'}
            </div>
          </div>

          {/* Builder Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-cyan-400">{metrics.connections}</div>
              <div className="text-xs text-gray-400">Connections</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{metrics.transactions}</div>
              <div className="text-xs text-gray-400">Transactions</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{metrics.contractCalls}</div>
              <div className="text-xs text-gray-400">Contract Calls</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-green-400">{metrics.uniqueUsers}</div>
              <div className="text-xs text-gray-400">Unique Users</div>
            </div>
          </div>

          {/* Builder Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Builder Information</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white">Basename:</span> vaiosx.base.eth</p>
              <p><span className="text-white">Builder Score:</span> {eligibility.builderInfo?.builderScore || 'Pending'}</p>
              <p><span className="text-white">Network:</span> {chainId === 84532 ? 'Base Sepolia ✅' : 'Switch to Base'}</p>
              <p><span className="text-white">Wallet:</span> {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <NeuralButton
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://builder.base.org', '_blank')}
            >
              <i className="fas fa-chart-line"></i>
              Check Builder Score
            </NeuralButton>
            
            <NeuralButton
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://basename.org', '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              View Basename
            </NeuralButton>
          </div>

          {/* Rewards Info */}
          <div className="text-center text-xs text-gray-400">
            <p>🎯 Builder Rewards Program</p>
            <p>💰 $WCT Tokens Available</p>
            <p>📅 Weekly Distributions</p>
          </div>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
