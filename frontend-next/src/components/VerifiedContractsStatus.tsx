'use client'

import { useBuilderRewards } from '@/hooks/useBuilderRewards'
import { useAccount, useChainId } from 'wagmi'
import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function VerifiedContractsStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { 
    getVerifiedContracts,
    isContractVerified,
    getContractByAddress,
    getCurrentMetrics
  } = useBuilderRewards()

  const verifiedContracts = getVerifiedContracts()
  const metrics = getCurrentMetrics()
  const isOnBase = (() => {
    const baseChainIds = [84532, 8453, 84531]
    return baseChainIds.includes(chainId as any)
  })()

  return (
    <ClientOnlyWrapper>
      <div className="p-6 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Verified Contracts Status</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isOnBase && isConnected
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {isOnBase && isConnected ? 'Active' : 'Pending'}
            </div>
          </div>

          {/* Network Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Network Status</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-2 p-2 rounded ${
                isOnBase ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${isOnBase ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Base Sepolia (84532)</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${
                isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <i className={`fas ${isConnected ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Wallet Connected</span>
              </div>
            </div>
          </div>

          {/* Verified Contracts List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Verified Contracts ({verifiedContracts.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {verifiedContracts.map((contract, index) => (
                <div key={contract.address} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-white">{contract.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {contract.commission}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p><span className="text-white">Address:</span> 
                      <a 
                        href={contract.explorer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 ml-1"
                      >
                        {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                      </a>
                    </p>
                    <p><span className="text-white">Function:</span> {contract.function}</p>
                    <p><span className="text-white">Status:</span> 
                      <span className="text-green-400 ml-1">✅ Verified</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Weekly Activity</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{metrics.contractCalls}</div>
                <div className="text-xs text-gray-400">Contract Calls</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{metrics.transactions}</div>
                <div className="text-xs text-gray-400">Transactions</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{metrics.uniqueUsers}</div>
                <div className="text-xs text-gray-400">Unique Users</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{metrics.connections}</div>
                <div className="text-xs text-gray-400">Connections</div>
              </div>
            </div>
          </div>

          {/* Builder Rewards Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Builder Rewards Eligibility</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white">Verified Contracts:</span> {metrics.verifiedContractsCount} deployed</p>
              <p><span className="text-white">Network:</span> Base Sepolia (84532)</p>
              <p><span className="text-white">WalletConnect:</span> ✅ Integrated</p>
              <p><span className="text-white">Activity Tracking:</span> ✅ Active</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <NeuralButton
              variant="primary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => window.open('https://sepolia.basescan.org/', '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              View on BaseScan
            </NeuralButton>
            
            <NeuralButton
              variant="secondary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => window.open('https://app.talentprotocol.com/f239f212-d969-44b1-b78c-5a05ae79d5b6', '_blank')}
            >
              <i className="fas fa-chart-line"></i>
              Builder Score
            </NeuralButton>
          </div>

          {/* Builder Rewards Tips */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Builder Rewards Tips</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <div className="flex items-start gap-2">
                <i className="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
                <span>Interact with your verified contracts regularly</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
                <span>Use WalletConnect for wallet connections</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
                <span>Maintain active user engagement</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
                <span>Contribute to open source repositories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
