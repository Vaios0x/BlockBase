// Smart Contract ABIs and Interaction Logic
class ContractManager {
    constructor() {
        this.contracts = {};
        this.web3 = null;
        this.account = null;
        
        // Contract ABIs (simplified for demo)
        this.abis = {
            propertyRental: [
                {
                    "inputs": [
                        {"internalType": "string", "name": "_title", "type": "string"},
                        {"internalType": "string", "name": "_description", "type": "string"},
                        {"internalType": "string", "name": "_location", "type": "string"},
                        {"internalType": "uint256", "name": "_price", "type": "uint256"},
                        {"internalType": "bool", "name": "_isForSale", "type": "bool"},
                        {"internalType": "bool", "name": "_isForRent", "type": "bool"},
                        {"internalType": "uint256", "name": "_rentPricePerDay", "type": "uint256"}
                    ],
                    "name": "createProperty",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
                    "name": "getPropertyDetails",
                    "outputs": [
                        {
                            "components": [
                                {"internalType": "uint256", "name": "id", "type": "uint256"},
                                {"internalType": "address", "name": "owner", "type": "address"},
                                {"internalType": "string", "name": "title", "type": "string"},
                                {"internalType": "string", "name": "description", "type": "string"},
                                {"internalType": "string", "name": "location", "type": "string"},
                                {"internalType": "uint256", "name": "price", "type": "uint256"},
                                {"internalType": "bool", "name": "isForSale", "type": "bool"},
                                {"internalType": "bool", "name": "isForRent", "type": "bool"},
                                {"internalType": "bool", "name": "isActive", "type": "bool"},
                                {"internalType": "uint256", "name": "rentPricePerDay", "type": "uint256"},
                                {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
                            ],
                            "internalType": "struct PropertyRental.Property",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
                    "name": "getUserProperties",
                    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {"internalType": "uint256", "name": "_propertyId", "type": "uint256"},
                        {"internalType": "uint256", "name": "_startDate", "type": "uint256"},
                        {"internalType": "uint256", "name": "_endDate", "type": "uint256"}
                    ],
                    "name": "rentProperty",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
                    "name": "buyProperty",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalProperties",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            propertyNFT: [
                {
                    "inputs": [
                        {"internalType": "address", "name": "to", "type": "address"},
                        {"internalType": "string", "name": "uri", "type": "string"},
                        {
                            "components": [
                                {"internalType": "string", "name": "title", "type": "string"},
                                {"internalType": "string", "name": "description", "type": "string"},
                                {"internalType": "string", "name": "location", "type": "string"},
                                {"internalType": "uint256", "name": "price", "type": "uint256"},
                                {"internalType": "uint256", "name": "area", "type": "uint256"},
                                {"internalType": "uint256", "name": "bedrooms", "type": "uint256"},
                                {"internalType": "uint256", "name": "bathrooms", "type": "uint256"},
                                {"internalType": "string", "name": "propertyType", "type": "string"},
                                {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
                            ],
                            "internalType": "struct PropertyNFT.PropertyMetadata",
                            "name": "metadata",
                            "type": "tuple"
                        }
                    ],
                    "name": "mintProperty",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                    "name": "getPropertyMetadata",
                    "outputs": [
                        {
                            "components": [
                                {"internalType": "string", "name": "title", "type": "string"},
                                {"internalType": "string", "name": "description", "type": "string"},
                                {"internalType": "string", "name": "location", "type": "string"},
                                {"internalType": "uint256", "name": "price", "type": "uint256"},
                                {"internalType": "uint256", "name": "area", "type": "uint256"},
                                {"internalType": "uint256", "name": "bedrooms", "type": "uint256"},
                                {"internalType": "uint256", "name": "bathrooms", "type": "uint256"},
                                {"internalType": "string", "name": "propertyType", "type": "string"},
                                {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
                            ],
                            "internalType": "struct PropertyNFT.PropertyMetadata",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            escrowService: [
                {
                    "inputs": [
                        {"internalType": "address", "name": "_seller", "type": "address"},
                        {"internalType": "uint256", "name": "_propertyId", "type": "uint256"},
                        {"internalType": "uint256", "name": "_releaseDate", "type": "uint256"}
                    ],
                    "name": "createEscrow",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
                    "name": "releaseEscrow",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ],
            propertyAuction: [
                {
                    "inputs": [
                        {"internalType": "uint256", "name": "_propertyId", "type": "uint256"},
                        {"internalType": "uint256", "name": "_startingPrice", "type": "uint256"},
                        {"internalType": "uint256", "name": "_duration", "type": "uint256"},
                        {"internalType": "uint256", "name": "_minBidIncrement", "type": "uint256"}
                    ],
                    "name": "createAuction",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"internalType": "uint256", "name": "_auctionId", "type": "uint256"}],
                    "name": "placeBid",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                }
            ],
            propertyInsurance: [
                {
                    "inputs": [
                        {"internalType": "uint256", "name": "_propertyId", "type": "uint256"},
                        {"internalType": "uint256", "name": "_coverageAmount", "type": "uint256"},
                        {"internalType": "uint256", "name": "_duration", "type": "uint256"},
                        {"internalType": "string", "name": "_policyType", "type": "string"}
                    ],
                    "name": "createPolicy",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "payable",
                    "type": "function"
                }
            ],
            propertyManagement: [
                {
                    "inputs": [
                        {"internalType": "string", "name": "_title", "type": "string"},
                        {"internalType": "string", "name": "_description", "type": "string"},
                        {"internalType": "string", "name": "_location", "type": "string"},
                        {"internalType": "uint256", "name": "_price", "type": "uint256"},
                        {"internalType": "bool", "name": "_isForSale", "type": "bool"},
                        {"internalType": "bool", "name": "_isForRent", "type": "bool"},
                        {"internalType": "uint256", "name": "_rentPricePerDay", "type": "uint256"},
                        {"internalType": "uint256", "name": "_maintenanceInterval", "type": "uint256"}
                    ],
                    "name": "createProperty",
                    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        };
        
        this.contractAddresses = {
            propertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
            propertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
            escrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
            propertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
            propertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
            propertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
        };
    }
    
    async initialize(web3Instance, account) {
        this.web3 = web3Instance;
        this.account = account;
        await this.loadContracts();
    }
    
    async loadContracts() {
        if (!this.web3) {
            throw new Error('Web3 not initialized');
        }
        
        try {
            // Load PropertyRental contract
            this.contracts.propertyRental = new this.web3.eth.Contract(
                this.abis.propertyRental,
                this.contractAddresses.propertyRental
            );
            
            // Load PropertyNFT contract
            this.contracts.propertyNFT = new this.web3.eth.Contract(
                this.abis.propertyNFT,
                this.contractAddresses.propertyNFT
            );
            
            // Load EscrowService contract
            this.contracts.escrowService = new this.web3.eth.Contract(
                this.abis.escrowService,
                this.contractAddresses.escrowService
            );
            
            // Load PropertyAuction contract
            this.contracts.propertyAuction = new this.web3.eth.Contract(
                this.abis.propertyAuction,
                this.contractAddresses.propertyAuction
            );
            
            // Load PropertyInsurance contract
            this.contracts.propertyInsurance = new this.web3.eth.Contract(
                this.abis.propertyInsurance,
                this.contractAddresses.propertyInsurance
            );
            
            // Load PropertyManagement contract
            this.contracts.propertyManagement = new this.web3.eth.Contract(
                this.abis.propertyManagement,
                this.contractAddresses.propertyManagement
            );
            
            console.log('All contracts loaded successfully');
            
        } catch (error) {
            console.error('Error loading contracts:', error);
            throw error;
        }
    }
    
    // PropertyRental methods
    async createProperty(title, description, location, price, isForSale, isForRent, rentPricePerDay) {
        try {
            const priceInWei = this.web3.utils.toWei(price.toString(), 'ether');
            const rentPriceInWei = this.web3.utils.toWei(rentPricePerDay.toString(), 'ether');
            
            const result = await this.contracts.propertyRental.methods.createProperty(
                title,
                description,
                location,
                priceInWei,
                isForSale,
                isForRent,
                rentPriceInWei
            ).send({ from: this.account });
            
            return result;
        } catch (error) {
            console.error('Error creating property:', error);
            throw error;
        }
    }
    
    async getPropertyDetails(propertyId) {
        try {
            const result = await this.contracts.propertyRental.methods.getPropertyDetails(propertyId).call();
            return {
                id: result.id,
                owner: result.owner,
                title: result.title,
                description: result.description,
                location: result.location,
                price: this.web3.utils.fromWei(result.price, 'ether'),
                isForSale: result.isForSale,
                isForRent: result.isForRent,
                isActive: result.isActive,
                rentPricePerDay: this.web3.utils.fromWei(result.rentPricePerDay, 'ether'),
                createdAt: result.createdAt
            };
        } catch (error) {
            console.error('Error getting property details:', error);
            throw error;
        }
    }
    
    async getUserProperties(userAddress) {
        try {
            const result = await this.contracts.propertyRental.methods.getUserProperties(userAddress).call();
            return result;
        } catch (error) {
            console.error('Error getting user properties:', error);
            throw error;
        }
    }
    
    async rentProperty(propertyId, startDate, endDate, rentAmount) {
        try {
            const rentAmountInWei = this.web3.utils.toWei(rentAmount.toString(), 'ether');
            
            const result = await this.contracts.propertyRental.methods.rentProperty(
                propertyId,
                startDate,
                endDate
            ).send({ 
                from: this.account,
                value: rentAmountInWei
            });
            
            return result;
        } catch (error) {
            console.error('Error renting property:', error);
            throw error;
        }
    }
    
    async buyProperty(propertyId, purchasePrice) {
        try {
            const purchasePriceInWei = this.web3.utils.toWei(purchasePrice.toString(), 'ether');
            
            const result = await this.contracts.propertyRental.methods.buyProperty(propertyId).send({
                from: this.account,
                value: purchasePriceInWei
            });
            
            return result;
        } catch (error) {
            console.error('Error buying property:', error);
            throw error;
        }
    }
    
    async getTotalProperties() {
        try {
            const result = await this.contracts.propertyRental.methods.totalProperties().call();
            return result;
        } catch (error) {
            console.error('Error getting total properties:', error);
            throw error;
        }
    }
    
    // PropertyNFT methods
    async mintProperty(to, uri, metadata) {
        try {
            const result = await this.contracts.propertyNFT.methods.mintProperty(
                to,
                uri,
                metadata
            ).send({ from: this.account });
            
            return result;
        } catch (error) {
            console.error('Error minting property NFT:', error);
            throw error;
        }
    }
    
    async getPropertyMetadata(tokenId) {
        try {
            const result = await this.contracts.propertyNFT.methods.getPropertyMetadata(tokenId).call();
            return {
                title: result.title,
                description: result.description,
                location: result.location,
                price: this.web3.utils.fromWei(result.price, 'ether'),
                area: result.area,
                bedrooms: result.bedrooms,
                bathrooms: result.bathrooms,
                propertyType: result.propertyType,
                createdAt: result.createdAt
            };
        } catch (error) {
            console.error('Error getting property metadata:', error);
            throw error;
        }
    }
    
    // EscrowService methods
    async createEscrow(seller, propertyId, releaseDate, amount) {
        try {
            const amountInWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            const result = await this.contracts.escrowService.methods.createEscrow(
                seller,
                propertyId,
                releaseDate
            ).send({
                from: this.account,
                value: amountInWei
            });
            
            return result;
        } catch (error) {
            console.error('Error creating escrow:', error);
            throw error;
        }
    }
    
    async releaseEscrow(escrowId) {
        try {
            const result = await this.contracts.escrowService.methods.releaseEscrow(escrowId).send({
                from: this.account
            });
            
            return result;
        } catch (error) {
            console.error('Error releasing escrow:', error);
            throw error;
        }
    }
    
    // PropertyAuction methods
    async createAuction(propertyId, startingPrice, duration, minBidIncrement) {
        try {
            const startingPriceInWei = this.web3.utils.toWei(startingPrice.toString(), 'ether');
            const minBidIncrementInWei = this.web3.utils.toWei(minBidIncrement.toString(), 'ether');
            
            const result = await this.contracts.propertyAuction.methods.createAuction(
                propertyId,
                startingPriceInWei,
                duration,
                minBidIncrementInWei
            ).send({ from: this.account });
            
            return result;
        } catch (error) {
            console.error('Error creating auction:', error);
            throw error;
        }
    }
    
    async placeBid(auctionId, bidAmount) {
        try {
            const bidAmountInWei = this.web3.utils.toWei(bidAmount.toString(), 'ether');
            
            const result = await this.contracts.propertyAuction.methods.placeBid(auctionId).send({
                from: this.account,
                value: bidAmountInWei
            });
            
            return result;
        } catch (error) {
            console.error('Error placing bid:', error);
            throw error;
        }
    }
    
    // PropertyInsurance methods
    async createPolicy(propertyId, coverageAmount, duration, policyType, premium) {
        try {
            const premiumInWei = this.web3.utils.toWei(premium.toString(), 'ether');
            const coverageAmountInWei = this.web3.utils.toWei(coverageAmount.toString(), 'ether');
            
            const result = await this.contracts.propertyInsurance.methods.createPolicy(
                propertyId,
                coverageAmountInWei,
                duration,
                policyType
            ).send({
                from: this.account,
                value: premiumInWei
            });
            
            return result;
        } catch (error) {
            console.error('Error creating insurance policy:', error);
            throw error;
        }
    }
    
    // PropertyManagement methods
    async createManagedProperty(title, description, location, price, isForSale, isForRent, rentPricePerDay, maintenanceInterval) {
        try {
            const priceInWei = this.web3.utils.toWei(price.toString(), 'ether');
            const rentPriceInWei = this.web3.utils.toWei(rentPricePerDay.toString(), 'ether');
            
            const result = await this.contracts.propertyManagement.methods.createProperty(
                title,
                description,
                location,
                priceInWei,
                isForSale,
                isForRent,
                rentPriceInWei,
                maintenanceInterval
            ).send({ from: this.account });
            
            return result;
        } catch (error) {
            console.error('Error creating managed property:', error);
            throw error;
        }
    }
    
    // Utility methods
    async getContractBalance(contractName) {
        try {
            const balance = await this.web3.eth.getBalance(this.contractAddresses[contractName]);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Error getting contract balance:', error);
            throw error;
        }
    }
    
    // Get contract instance
    getContract(contractName) {
        return this.contracts[contractName];
    }
    
    // Get all contracts
    getAllContracts() {
        return this.contracts;
    }
}

// Initialize Contract Manager
const contractManager = new ContractManager();
