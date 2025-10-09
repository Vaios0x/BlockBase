'use client'

import NeuralButton from './NeuralButton'
import ClientOnlyWrapper from './ClientOnlyWrapper'

export default function TalentProtocolProfile() {
  const talentProtocolUrl = 'https://app.talentprotocol.com/f239f212-d969-44b1-b78c-5a05ae79d5b6'

  return (
    <ClientOnlyWrapper>
      <div className="p-6 rounded-2xl border shadow-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-md border-white/12">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-trophy text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-white">Talent Protocol</h3>
            <p className="text-sm text-gray-400">Builder Rewards Program</p>
          </div>

          {/* Profile Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Profile Information</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white">Builder:</span> vaiosx.base.eth</p>
              <p><span className="text-white">Profile ID:</span> f239f212-d969-44b1-b78c-5a05ae79d5b6</p>
              <p><span className="text-white">Status:</span> <span className="text-green-400">Active</span></p>
              <p><span className="text-white">Program:</span> WalletConnect Builder Rewards</p>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Rewards Information</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="text-lg font-bold text-yellow-400">$WCT</div>
                <div className="text-gray-400">Token</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="text-lg font-bold text-orange-400">Weekly</div>
                <div className="text-gray-400">Distribution</div>
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Program Details</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <div className="flex items-center gap-2">
                <i className="fas fa-calendar text-blue-400"></i>
                <span>First Distribution: Sep 23, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-clock text-green-400"></i>
                <span>Weekly: Sep 30 - Dec 2, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-coins text-yellow-400"></i>
                <span>Total Pool: 1,000,000 $WCT</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-trophy text-purple-400"></i>
                <span>Top 100 Weekly</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <NeuralButton
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open(talentProtocolUrl, '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              View Talent Protocol Profile
            </NeuralButton>
            
            <NeuralButton
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open('https://docs.reown.com/overview', '_blank')}
            >
              <i className="fas fa-book"></i>
              Reown Documentation
            </NeuralButton>
          </div>

          {/* Status */}
          <div className="text-center text-xs text-gray-400">
            <p>🎯 Builder Rewards Program</p>
            <p>💰 $WCT Tokens Available</p>
            <p>📅 Weekly Distributions</p>
            <p>🏆 Top 100 Ranking</p>
          </div>
        </div>
      </div>
    </ClientOnlyWrapper>
  )
}
