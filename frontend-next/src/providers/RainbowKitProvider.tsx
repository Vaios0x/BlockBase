'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'wagmi';

// Configuración de cadenas
const config = getDefaultConfig({
  appName: 'BlockBase - Real Estate Marketplace',
  projectId: '2f05a7f74c1f039070e7d78b3b8a0b8b', // Tu Project ID de WalletConnect
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

// Query client para wagmi
const queryClient = new QueryClient();

interface RainbowKitProviderProps {
  children: React.ReactNode;
}

export default function RainbowKitProviderWrapper({ children }: RainbowKitProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={true}
          appInfo={{
            appName: 'BlockBase',
            learnMoreUrl: 'https://blockbase.com',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
