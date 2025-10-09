'use client'

import { useBuilderRewards } from '@/hooks/useBuilderRewards'
import { useAccount, useChainId } from 'wagmi'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function BuilderRewardsStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { 
    getCurrentMetrics, 
    isEligibleForRewards, 
    getBuilderScoreInfo 
  } = useBuilderRewards()

  const metrics = getCurrentMetrics()
  const eligibility = isEligibleForRewards()
  const scoreInfo = getBuilderScoreInfo()

  const isOnBase = chainId === 84532
  const isEligible = eligibility.hasBasename && eligibility.hasBuilderScore && isOnBase && isConnected

  return (
    <ClientOnlyWrapper>
      <div className="p-6 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Builder Rewards Status</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isEligible 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {isEligible ? 'Eligible' : 'Pending'}
            </div>
          </div>

          {/* Eligibility Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Eligibility Requirements</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-2 p-2 rounded ${
                eligibility.hasBasename ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${eligibility.hasBasename ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Basename: vaiosx.base.eth</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${
                eligibility.hasBuilderScore ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${eligibility.hasBuilderScore ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Builder Score ≥40</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${
                isOnBase ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${isOnBase ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Base Network</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${
                isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${isConnected ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Wallet Connected</span>
              </div>
            </div>
          </div>

          {/* Weekly Metrics */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Weekly Activity</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{metrics.connections}</div>
                <div className="text-xs text-gray-400">Connections</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{metrics.transactions}</div>
                <div className="text-xs text-gray-400">Transactions</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{metrics.contractCalls}</div>
                <div className="text-xs text-gray-400">Contract Calls</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{metrics.uniqueUsers}</div>
                <div className="text-xs text-gray-400">Unique Users</div>
              </div>
            </div>
          </div>

          {/* Builder Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Builder Info</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white">Basename:</span> vaiosx.base.eth</p>
              <p><span className="text-white">Builder Score:</span> {eligibility.builderInfo?.builderScore || 'Pending'}</p>
              <p><span className="text-white">Status:</span> {eligibility.builderInfo?.isEligible ? 'Eligible' : 'Pending'}</p>
              <p><span className="text-white">Last Activity:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Project Info</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white">Project ID:</span> e1b7b8bda639fe3153018f6c76ced0a4</p>
              <p><span className="text-white">Network:</span> Base Sepolia (84532)</p>
              <p><span className="text-white">Contracts:</span> 6 deployed</p>
              <p><span className="text-white">WalletConnect:</span> ✅ Integrated</p>
            </div>
          </div>

          {/* Builder Score Tips */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Builder Score Tips</h4>
            <div className="text-xs text-gray-300 space-y-1">
              {scoreInfo.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <i className="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <NeuralButton
              variant="primary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => window.open('https://basename.org', '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              Get Basename
            </NeuralButton>
            
            <NeuralButton
              variant="secondary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => window.open('https://builder.base.org', '_blank')}
            >
              <i className="fas fa-chart-line"></i>
              Builder Score
            </NeuralButton>
          </div>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
