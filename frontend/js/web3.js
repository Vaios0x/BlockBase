// Web3 Configuration and Connection with WalletConnect Support
class Web3Manager {
    constructor() {
        this.web3 = null;
        this.accounts = [];
        this.currentAccount = null;
        this.chainId = null;
        this.isConnected = false;
        this.walletConnect = null;
        this.connector = null;
        
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
        try {
            // Check for MetaMask first
            if (typeof window.ethereum !== 'undefined') {
                this.web3 = new Web3(window.ethereum);
                this.setupEventListeners();
                await this.checkConnection();
            } else {
                // Initialize WalletConnect as fallback
                await this.initializeWalletConnect();
                this.showWalletOptions();
            }
        } catch (error) {
            console.error('Error initializing Web3:', error);
            this.showError('Error inicializando la conexión de wallet. Por favor, recarga la página.');
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
            
            // Try MetaMask first
            if (typeof window.ethereum !== 'undefined') {
                await this.connectMetaMask();
            } else {
                // Use WalletConnect
                await this.connectWalletConnect();
            }
            
        } catch (error) {
            this.hideLoading();
            console.error('Error connecting wallet:', error);
            this.showError('Error conectando wallet: ' + error.message);
        }
    }
    
    async connectMetaMask() {
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            // Check if we're on the correct network
            await this.checkNetwork();
            
            await this.handleAccountsChanged(accounts);
            
            this.hideLoading();
            this.showSuccess('MetaMask conectado exitosamente');
            
        } catch (error) {
            this.hideLoading();
            if (error.code === 4001) {
                this.showError('Conexión rechazada por el usuario');
            } else {
                throw error;
            }
        }
    }
    
    async initializeWalletConnect() {
        try {
            // Load WalletConnect script dynamically
            if (!window.WalletConnect) {
                await this.loadWalletConnectScript();
            }
            
            // Initialize WalletConnect
            this.connector = new window.WalletConnect({
                bridge: 'https://bridge.walletconnect.org',
                qrcodeModal: window.WalletConnectQRCodeModal,
            });
            
            // Setup WalletConnect event listeners
            this.setupWalletConnectListeners();
            
        } catch (error) {
            console.error('Error initializing WalletConnect:', error);
            throw error;
        }
    }
    
    async loadWalletConnectScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupWalletConnectListeners() {
        if (!this.connector) return;
        
        // Listen for session updates
        this.connector.on('session_update', (error, payload) => {
            if (error) {
                console.error('WalletConnect session update error:', error);
                return;
            }
            
            const { accounts, chainId } = payload.params[0];
            this.handleAccountsChanged(accounts);
        });
        
        // Listen for disconnect
        this.connector.on('disconnect', (error, payload) => {
            if (error) {
                console.error('WalletConnect disconnect error:', error);
                return;
            }
            
            this.handleDisconnect();
        });
    }
    
    async connectWalletConnect() {
        try {
            if (!this.connector) {
                await this.initializeWalletConnect();
            }
            
            // Check if already connected
            if (this.connector.connected) {
                const { accounts, chainId } = this.connector.session;
                await this.handleAccountsChanged(accounts);
                this.hideLoading();
                this.showSuccess('WalletConnect conectado exitosamente');
                return;
            }
            
            // Create new session
            await this.connector.createSession();
            
            // Get QR code URI
            const uri = this.connector.uri;
            
            // Show QR code modal
            this.showQRCode(uri);
            
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }
    
    showQRCode(uri) {
        // Create QR code modal
        const modal = document.createElement('div');
        modal.className = 'walletconnect-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <h3>Escanea con tu wallet</h3>
                <div id="qrcode" style="margin: 1rem 0;"></div>
                <p>Usa tu wallet móvil para escanear este código QR</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Generate QR code
        this.generateQRCode(uri, 'qrcode');
    }
    
    generateQRCode(text, elementId) {
        try {
            // Use QRCode.js library if available
            if (typeof QRCode !== 'undefined') {
                const qrContainer = document.getElementById(elementId);
                qrContainer.innerHTML = ''; // Clear previous content
                
                QRCode.toCanvas(qrContainer, text, {
                    width: 200,
                    height: 200,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }, function (error) {
                    if (error) {
                        console.error('QR Code generation error:', error);
                        this.generateSimpleQRCode(text, elementId);
                    }
                });
            } else {
                this.generateSimpleQRCode(text, elementId);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.generateSimpleQRCode(text, elementId);
        }
    }
    
    generateSimpleQRCode(text, elementId) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 200;
        canvas.height = 200;
        
        // Draw a simple QR-like pattern
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 200, 200);
        
        // Create a simple pattern
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(i * 10, j * 10, 10, 10);
                }
            }
        }
        
        // Add text
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', 100, 190);
        
        document.getElementById(elementId).appendChild(canvas);
    }
    
    showWalletOptions() {
        const connectButton = document.getElementById('connect-wallet');
        if (connectButton) {
            connectButton.innerHTML = `
                <i class="fas fa-wallet"></i>
                Conectar Wallet
            `;
            connectButton.onclick = () => this.showWalletModal();
        }
    }
    
    showWalletModal() {
        const modal = document.createElement('div');
        modal.className = 'wallet-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                color: white;
            ">
                <h3>Selecciona tu Wallet</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0;">
                    <button onclick="web3Manager.connectMetaMask()" style="
                        background: linear-gradient(135deg, #f6851b, #e2761b);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        justify-content: center;
                    ">
                        <i class="fab fa-ethereum"></i>
                        MetaMask
                    </button>
                    <button onclick="web3Manager.connectWalletConnect()" style="
                        background: linear-gradient(135deg, #3b99fc, #1e88e5);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        justify-content: center;
                    ">
                        <i class="fas fa-qrcode"></i>
                        WalletConnect
                    </button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
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
