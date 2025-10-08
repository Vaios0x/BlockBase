// Global type declarations for Web3 and WalletConnect

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isConnected: () => boolean;
  };
  WalletConnectModal?: new (config: {
    projectId: string;
    chains: number[];
    enableNetworkSwitching?: boolean;
    enableExplorer?: boolean;
  }) => {
    open: () => void;
    close: () => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
  };
  WalletConnectEthereumProvider?: new (config: {
    projectId: string;
    chains: number[];
    showQrModal?: boolean;
    qrModalOptions?: any;
  }) => {
    enable: () => Promise<string[]>;
    disconnect: () => Promise<void>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
  Web3?: any;
  ethers?: any;
  QRCode?: any;
  app?: any;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isConnected: () => boolean;
    };
    WalletConnectModal?: new (config: {
      projectId: string;
      chains: number[];
      enableNetworkSwitching?: boolean;
      enableExplorer?: boolean;
    }) => {
      open: () => void;
      close: () => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
    WalletConnectEthereumProvider?: new (config: {
      projectId: string;
      chains: number[];
      showQrModal?: boolean;
      qrModalOptions?: any;
    }) => {
      enable: () => Promise<string[]>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
    Web3?: any;
    ethers?: any;
    QRCode?: any;
    app?: any;
  }
}

export {};
