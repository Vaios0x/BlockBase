'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import NeuralButton from './NeuralButton';
import GlassCard from './GlassCard';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <GlassCard className="flex items-center gap-4 p-4" intensity="medium">
        <div className="flex flex-col items-end">
          <span className="text-sm font-mono text-white">
            {formatAddress(address)}
          </span>
          <span className="text-xs text-cyan-400">
            {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
          </span>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <NeuralButton
                        variant="primary"
                        size="md"
                        neural={true}
                        onClick={openConnectModal}
                        className="flex items-center gap-2"
                      >
                        <i className="fas fa-wallet"></i>
                        Conectar Wallet
                      </NeuralButton>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <NeuralButton
                        variant="danger"
                        size="md"
                        onClick={openChainModal}
                        className="flex items-center gap-2"
                      >
                        <i className="fas fa-exclamation-triangle"></i>
                        Red Incorrecta
                      </NeuralButton>
                    );
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <NeuralButton
                        variant="secondary"
                        size="sm"
                        onClick={openChainModal}
                        className="flex items-center gap-2"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </NeuralButton>

                      <NeuralButton
                        variant="danger"
                        size="sm"
                        onClick={openAccountModal}
                        className="flex items-center gap-2"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Desconectar
                      </NeuralButton>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </GlassCard>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <NeuralButton
                    variant="primary"
                    size="md"
                    neural={true}
                    onClick={openConnectModal}
                    className="flex items-center gap-2"
                  >
                    <i className="fas fa-wallet"></i>
                    Conectar Wallet
                  </NeuralButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <NeuralButton
                    variant="danger"
                    size="md"
                    onClick={openChainModal}
                    className="flex items-center gap-2"
                  >
                    <i className="fas fa-exclamation-triangle"></i>
                    Red Incorrecta
                  </NeuralButton>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <NeuralButton
                    variant="secondary"
                    size="sm"
                    onClick={openChainModal}
                    className="flex items-center gap-2"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </NeuralButton>

                  <NeuralButton
                    variant="danger"
                    size="sm"
                    onClick={openAccountModal}
                    className="flex items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Desconectar
                  </NeuralButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
