'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string | null;
  chainId: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  // Base Sepolia configuration
  const BASE_SEPOLIA_CHAIN_ID = '0x14A34'; // 84532 in hex
  const BASE_SEPOLIA_RPC_URL = 'https://sepolia.base.org';

  useEffect(() => {
    checkConnection();
    setupEventListeners();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setChainId(chainId);
          await updateBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      await updateBalance(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
    if (newChainId !== BASE_SEPOLIA_CHAIN_ID) {
      console.warn('Please switch to Base Sepolia network');
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance(null);
    setChainId(null);
  };

  const updateBalance = async (address: string) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        // Convert from wei to ETH
        const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
        setBalance(balanceInEth);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Check and switch to Base Sepolia if needed
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
          await switchToBaseSepolia();
        }
        
        await updateBalance(accounts[0]);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else {
        throw new Error('Failed to connect wallet: ' + error.message);
      }
    }
  };

  const switchToBaseSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BASE_SEPOLIA_CHAIN_ID,
              chainName: 'Base Sepolia',
              rpcUrls: [BASE_SEPOLIA_RPC_URL],
              blockExplorerUrls: ['https://sepolia.basescan.org/'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              }
            }],
          });
        } catch (addError) {
          throw new Error('Failed to add Base Sepolia network: ' + addError);
        }
      } else {
        throw new Error('Failed to switch to Base Sepolia: ' + switchError.message);
      }
    }
  };

  const disconnect = () => {
    handleDisconnect();
  };

  const value: Web3ContextType = {
    account,
    isConnected,
    connect,
    disconnect,
    balance,
    chainId
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}
