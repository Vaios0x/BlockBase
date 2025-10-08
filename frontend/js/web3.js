// Web3 Configuration and Connection
class Web3Manager {
    constructor() {
        this.web3 = null;
        this.accounts = [];
        this.currentAccount = null;
        this.chainId = null;
        this.isConnected = false;
        
        // Base Sepolia configuration
        this.networkConfig = {
            chainId: '0x14A34', // 84532 in hex
            chainName: 'Base Sepolia',
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org/'],
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
            }
        };
        
        this.contractAddresses = {
            propertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
            propertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
            escrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
            propertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
            propertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
            propertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
        };
        
        this.init();
    }
    
    async init() {
        if (typeof window.ethereum !== 'undefined') {
            this.web3 = new Web3(window.ethereum);
            this.setupEventListeners();
            await this.checkConnection();
        } else {
            this.showError('MetaMask no está instalado. Por favor, instala MetaMask para usar esta aplicación.');
        }
    }
    
    setupEventListeners() {
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            this.handleAccountsChanged(accounts);
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
            this.handleChainChanged(chainId);
        });
        
        // Listen for connection status
        window.ethereum.on('connect', (connectInfo) => {
            console.log('Wallet connected:', connectInfo);
        });
        
        window.ethereum.on('disconnect', (error) => {
            console.log('Wallet disconnected:', error);
            this.handleDisconnect();
        });
    }
    
    async checkConnection() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await this.handleAccountsChanged(accounts);
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    }
    
    async connectWallet() {
        try {
            this.showLoading('Conectando wallet...');
            
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            // Check if we're on the correct network
            await this.checkNetwork();
            
            await this.handleAccountsChanged(accounts);
            
            this.hideLoading();
            this.showSuccess('Wallet conectado exitosamente');
            
        } catch (error) {
            this.hideLoading();
            if (error.code === 4001) {
                this.showError('Conexión rechazada por el usuario');
            } else {
                this.showError('Error conectando wallet: ' + error.message);
            }
        }
    }
    
    async checkNetwork() {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            if (chainId !== this.networkConfig.chainId) {
                await this.switchNetwork();
            }
        } catch (error) {
            console.error('Error checking network:', error);
            throw error;
        }
    }
    
    async switchNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.networkConfig.chainId }],
            });
        } catch (switchError) {
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [this.networkConfig],
                    });
                } catch (addError) {
                    throw new Error('Error adding network: ' + addError.message);
                }
            } else {
                throw new Error('Error switching network: ' + switchError.message);
            }
        }
    }
    
    async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.handleDisconnect();
        } else {
            this.accounts = accounts;
            this.currentAccount = accounts[0];
            this.isConnected = true;
            this.updateUI();
            await this.updateBalance();
        }
    }
    
    handleChainChanged(chainId) {
        this.chainId = chainId;
        if (chainId !== this.networkConfig.chainId) {
            this.showError('Por favor, cambia a la red Base Sepolia');
        }
    }
    
    handleDisconnect() {
        this.accounts = [];
        this.currentAccount = null;
        this.isConnected = false;
        this.updateUI();
    }
    
    async updateBalance() {
        if (!this.currentAccount) return;
        
        try {
            const balance = await this.web3.eth.getBalance(this.currentAccount);
            const balanceInEth = this.web3.utils.fromWei(balance, 'ether');
            const formattedBalance = parseFloat(balanceInEth).toFixed(4);
            
            const balanceElement = document.getElementById('wallet-balance');
            if (balanceElement) {
                balanceElement.textContent = `${formattedBalance} ETH`;
            }
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    }
    
    updateUI() {
        const connectButton = document.getElementById('connect-wallet');
        const walletInfo = document.getElementById('wallet-info');
        const walletAddress = document.getElementById('wallet-address');
        
        if (this.isConnected) {
            connectButton.style.display = 'none';
            walletInfo.style.display = 'flex';
            if (walletAddress) {
                walletAddress.textContent = this.formatAddress(this.currentAccount);
            }
        } else {
            connectButton.style.display = 'flex';
            walletInfo.style.display = 'none';
        }
    }
    
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    async sendTransaction(transaction) {
        try {
            this.showLoading('Enviando transacción...');
            
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transaction]
            });
            
            this.hideLoading();
            this.showSuccess(`Transacción enviada: ${txHash}`);
            
            return txHash;
        } catch (error) {
            this.hideLoading();
            this.showError('Error en la transacción: ' + error.message);
            throw error;
        }
    }
    
    async getTransactionReceipt(txHash) {
        try {
            const receipt = await this.web3.eth.getTransactionReceipt(txHash);
            return receipt;
        } catch (error) {
            console.error('Error getting transaction receipt:', error);
            throw error;
        }
    }
    
    async waitForTransaction(txHash, confirmations = 1) {
        try {
            this.showLoading('Esperando confirmaciones...');
            
            const receipt = await this.web3.eth.waitForTransactionReceipt(txHash);
            
            this.hideLoading();
            this.showSuccess('Transacción confirmada');
            
            return receipt;
        } catch (error) {
            this.hideLoading();
            this.showError('Error esperando confirmación: ' + error.message);
            throw error;
        }
    }
    
    // Utility methods for UI feedback
    showLoading(message = 'Cargando...') {
        const overlay = document.getElementById('loading-overlay');
        const spinner = overlay.querySelector('p');
        if (overlay && spinner) {
            spinner.textContent = message;
            overlay.style.display = 'block';
        }
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
        }
        
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Get current account
    getCurrentAccount() {
        return this.currentAccount;
    }
    
    // Get web3 instance
    getWeb3() {
        return this.web3;
    }
    
    // Get contract addresses
    getContractAddresses() {
        return this.contractAddresses;
    }
    
    // Check if connected
    isWalletConnected() {
        return this.isConnected;
    }
}

// Initialize Web3 Manager
const web3Manager = new Web3Manager();

// Connect wallet button event listener
document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connect-wallet');
    if (connectButton) {
        connectButton.addEventListener('click', () => {
            web3Manager.connectWallet();
        });
    }
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
