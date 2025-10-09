'use client';

import { useWeb3 } from '@/providers/Web3Provider';
import NeuralButton from './NeuralButton';
import ClientOnlyWrapper from './ClientOnlyWrapper';

export default function SimpleWalletConnect() {
  const { account, isConnected, connect, disconnect, balance } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(error.message);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <ClientOnlyWrapper>
      {isConnected && account ? (
        <div className="flex items-center gap-4 p-4 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
          <div className="flex flex-col items-end">
            <span className="text-sm font-mono text-white">
              {formatAddress(account)}
            </span>
            <span className="text-xs text-cyan-400">
              {balance ? `${balance} ETH` : '0.0000 ETH'}
            </span>
          </div>
          <NeuralButton
            variant="secondary"
            size="sm"
            onClick={handleDisconnect}
            className="flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            Desconectar
          </NeuralButton>
        </div>
      ) : (
        <NeuralButton
          variant="primary"
          size="md"
          neural={true}
          onClick={handleConnect}
          className="flex items-center gap-2"
        >
          <i className="fas fa-wallet"></i>
          Conectar Wallet
        </NeuralButton>
      )}
    </ClientOnlyWrapper>
  );
}
