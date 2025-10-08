// Frontend Configuration
const CONFIG = {
    // Network Configuration
    network: {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: 'https://sepolia.base.org',
        explorerUrl: 'https://sepolia.basescan.org',
        currency: 'ETH'
    },
    
    // Contract Addresses
    contracts: {
        propertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
        propertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
        escrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
        propertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
        propertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
        propertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
    },
    
    // UI Configuration
    ui: {
        theme: 'dark',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        glassOpacity: 0.05,
        blurIntensity: 20
    },
    
    // Feature Flags
    features: {
        enableNFTs: true,
        enableAuctions: true,
        enableInsurance: true,
        enableManagement: true,
        enableEscrow: true
    },
    
    // API Configuration
    api: {
        baseUrl: 'https://api.blockbase.com',
        timeout: 30000,
        retries: 3
    },
    
    // Default Values
    defaults: {
        gasLimit: 300000,
        gasPrice: '20000000000', // 20 gwei
        maxPrice: 10, // ETH
        minRentDays: 1,
        maxRentDays: 365
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
