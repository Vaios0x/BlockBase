// Simplified Main Application Logic
class BlockBaseApp {
    constructor() {
        this.web3Manager = null;
        this.contractManager = null;
        this.properties = [];
        this.auctions = [];
        this.userProperties = [];
        this.currentFilter = 'all';
        this.currentLocation = '';
        this.currentPrice = 0;
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    async setupApp() {
        try {
            // Initialize managers
            this.web3Manager = web3Manager;
            this.contractManager = contractManager;
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup navigation
            this.setupNavigation();
            
            console.log('BlockBase App initialized successfully');
            
        } catch (error) {
            console.error('Error setting up app:', error);
        }
    }
    
    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });
        
        // Connect wallet button
        const connectButton = document.getElementById('connect-wallet');
        if (connectButton) {
            connectButton.addEventListener('click', () => {
                this.web3Manager.connectWallet();
            });
        }
        
        // Disconnect wallet button
        const disconnectButton = document.getElementById('disconnect-wallet');
        if (disconnectButton) {
            disconnectButton.addEventListener('click', () => {
                this.web3Manager.disconnectWallet();
            });
        }
        
        // Explore properties button
        const exploreButton = document.getElementById('explore-properties');
        if (exploreButton) {
            exploreButton.addEventListener('click', () => {
                this.navigateToSection('properties');
            });
        }
        
        // Create property button
        const createButton = document.getElementById('create-property');
        if (createButton) {
            createButton.addEventListener('click', () => {
                this.showCreatePropertyModal();
            });
        }
        
        // Filter controls
        const propertyFilter = document.getElementById('property-filter');
        if (propertyFilter) {
            propertyFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterProperties();
            });
        }
        
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) {
            locationFilter.addEventListener('input', (e) => {
                this.currentLocation = e.target.value;
                this.filterProperties();
            });
        }
        
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('input', (e) => {
                this.currentPrice = parseFloat(e.target.value);
                document.getElementById('price-value').textContent = `${this.currentPrice} ETH`;
                this.filterProperties();
            });
        }
        
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileNav();
            });
        }
        
        // Modal close
        const modal = document.getElementById('property-modal');
        if (modal) {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal();
                });
            }
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    setupNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile nav if open
        this.closeMobileNav();
    }
    
    toggleMobileNav() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    }
    
    closeMobileNav() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
    
    async loadInitialData() {
        try {
            // Load properties
            await this.loadProperties();
            
            // Load auctions
            await this.loadAuctions();
            
            // Load user data if connected
            if (this.web3Manager.isWalletConnected()) {
                await this.loadUserData();
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }
    
    async loadProperties() {
        try {
            // For demo purposes, create sample properties
            this.properties = [
                {
                    id: 1,
                    title: 'Villa Moderna en Madrid',
                    description: 'Hermosa villa moderna con 4 habitaciones, 3 baños y piscina privada.',
                    location: 'Madrid, España',
                    price: '2.5',
                    rentPricePerDay: '0.1',
                    isForSale: true,
                    isForRent: true,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
                    bedrooms: 4,
                    bathrooms: 3,
                    area: 250
                },
                {
                    id: 2,
                    title: 'Apartamento de Lujo en Barcelona',
                    description: 'Apartamento de lujo en el centro de Barcelona con vistas al mar.',
                    location: 'Barcelona, España',
                    price: '1.8',
                    rentPricePerDay: '0.08',
                    isForSale: true,
                    isForRent: true,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
                    bedrooms: 3,
                    bathrooms: 2,
                    area: 180
                },
                {
                    id: 3,
                    title: 'Casa Tradicional en Sevilla',
                    description: 'Casa tradicional andaluza con patio y jardín privado.',
                    location: 'Sevilla, España',
                    price: '1.2',
                    rentPricePerDay: '0.05',
                    isForSale: true,
                    isForRent: true,
                    isActive: true,
                    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400',
                    bedrooms: 3,
                    bathrooms: 2,
                    area: 150
                }
            ];
            
            this.renderProperties();
            
        } catch (error) {
            console.error('Error loading properties:', error);
        }
    }
    
    async loadAuctions() {
        try {
            // For demo purposes, create sample auctions
            this.auctions = [
                {
                    id: 1,
                    propertyId: 1,
                    title: 'Subasta: Villa Moderna',
                    currentBid: '2.8',
                    endTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
                    bidders: 5
                },
                {
                    id: 2,
                    propertyId: 2,
                    title: 'Subasta: Apartamento Barcelona',
                    currentBid: '2.1',
                    endTime: Date.now() + (48 * 60 * 60 * 1000), // 48 hours from now
                    bidders: 3
                }
            ];
            
            this.renderAuctions();
            
        } catch (error) {
            console.error('Error loading auctions:', error);
        }
    }
    
    async loadUserData() {
        try {
            if (!this.web3Manager.isWalletConnected()) {
                return;
            }
            
            const userAddress = this.web3Manager.getCurrentAccount();
            
            // Load user properties
            if (this.contractManager && this.contractManager.contracts.propertyRental) {
                const userPropertyIds = await this.contractManager.getUserProperties(userAddress);
                this.userProperties = [];
                
                for (const propertyId of userPropertyIds) {
                    try {
                        const property = await this.contractManager.getPropertyDetails(propertyId);
                        this.userProperties.push(property);
                    } catch (error) {
                        console.error(`Error loading property ${propertyId}:`, error);
                    }
                }
            }
            
            this.renderUserData();
            
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    renderProperties() {
        const propertiesGrid = document.getElementById('properties-grid');
        if (!propertiesGrid) return;
        
        const filteredProperties = this.getFilteredProperties();
        
        propertiesGrid.innerHTML = filteredProperties.map(property => `
            <div class="property-item" onclick="app.showPropertyModal(${property.id})">
                <div class="property-item-image">
                    <i class="fas fa-home"></i>
                </div>
                <div class="property-item-content">
                    <h3 class="property-item-title">${property.title}</h3>
                    <p class="property-item-location">${property.location}</p>
                    <div class="property-item-price">${property.price} ETH</div>
                    <div class="property-item-actions">
                        ${property.isForSale ? '<button class="btn-small primary" onclick="event.stopPropagation(); app.buyProperty(' + property.id + ')">Comprar</button>' : ''}
                        ${property.isForRent ? '<button class="btn-small secondary" onclick="event.stopPropagation(); app.rentProperty(' + property.id + ')">Rentar</button>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderAuctions() {
        const auctionsGrid = document.getElementById('auctions-grid');
        if (!auctionsGrid) return;
        
        auctionsGrid.innerHTML = this.auctions.map(auction => `
            <div class="auction-item">
                <div class="auction-header">
                    <h3 class="auction-title">${auction.title}</h3>
                    <span class="auction-time">${this.formatTimeRemaining(auction.endTime)}</span>
                </div>
                <div class="auction-price">${auction.currentBid} ETH</div>
                <div class="auction-bid">
                    <input type="number" placeholder="Tu puja" step="0.01" min="${auction.currentBid}">
                    <button class="btn-primary" onclick="app.placeBid(${auction.id}, this.previousElementSibling.value)">Pujar</button>
                </div>
                <p>${auction.bidders} pujadores</p>
            </div>
        `).join('');
    }
    
    renderUserData() {
        // Render user properties
        const myProperties = document.getElementById('my-properties');
        if (myProperties) {
            myProperties.innerHTML = this.userProperties.map(property => `
                <div class="property-item-small">
                    <div class="property-info">
                        <h4>${property.title}</h4>
                        <p>${property.location}</p>
                        <span class="property-price">${property.price} ETH</span>
                    </div>
                    <div class="property-actions">
                        <button class="btn-small primary" onclick="app.editProperty(${property.id})">Editar</button>
                        <button class="btn-small secondary" onclick="app.togglePropertyStatus(${property.id})">${property.isActive ? 'Desactivar' : 'Activar'}</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Update statistics
        const totalProperties = document.getElementById('total-properties');
        if (totalProperties) {
            totalProperties.textContent = this.userProperties.length;
        }
    }
    
    getFilteredProperties() {
        return this.properties.filter(property => {
            // Filter by type
            if (this.currentFilter === 'sale' && !property.isForSale) return false;
            if (this.currentFilter === 'rent' && !property.isForRent) return false;
            
            // Filter by location
            if (this.currentLocation && !property.location.toLowerCase().includes(this.currentLocation.toLowerCase())) {
                return false;
            }
            
            // Filter by price
            if (this.currentPrice > 0 && parseFloat(property.price) > this.currentPrice) {
                return false;
            }
            
            return true;
        });
    }
    
    filterProperties() {
        this.renderProperties();
    }
    
    formatTimeRemaining(endTime) {
        const now = Date.now();
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            return 'Finalizada';
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    showPropertyModal(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;
        
        const modal = document.getElementById('property-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <div class="property-modal-content">
                    <div class="property-modal-image">
                        <i class="fas fa-home"></i>
                    </div>
                    <div class="property-modal-info">
                        <h2>${property.title}</h2>
                        <p class="property-location">${property.location}</p>
                        <p class="property-description">${property.description}</p>
                        <div class="property-details">
                            <div class="detail-item">
                                <i class="fas fa-bed"></i>
                                <span>${property.bedrooms} habitaciones</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-bath"></i>
                                <span>${property.bathrooms} baños</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${property.area} m²</span>
                            </div>
                        </div>
                        <div class="property-price-section">
                            <div class="price-item">
                                <span class="price-label">Precio de venta:</span>
                                <span class="price-value">${property.price} ETH</span>
                            </div>
                            <div class="price-item">
                                <span class="price-label">Precio de renta:</span>
                                <span class="price-value">${property.rentPricePerDay} ETH/día</span>
                            </div>
                        </div>
                        <div class="property-actions">
                            ${property.isForSale ? '<button class="btn-primary" onclick="app.buyProperty(' + property.id + ')">Comprar</button>' : ''}
                            ${property.isForRent ? '<button class="btn-secondary" onclick="app.rentProperty(' + property.id + ')">Rentar</button>' : ''}
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }
    
    showCreatePropertyModal() {
        const modal = document.getElementById('property-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <div class="create-property-form">
                    <h2>Crear Nueva Propiedad</h2>
                    <form id="create-property-form">
                        <div class="form-group">
                            <label for="property-title">Título</label>
                            <input type="text" id="property-title" required>
                        </div>
                        <div class="form-group">
                            <label for="property-description">Descripción</label>
                            <textarea id="property-description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="property-location">Ubicación</label>
                            <input type="text" id="property-location" required>
                        </div>
                        <div class="form-group">
                            <label for="property-price">Precio (ETH)</label>
                            <input type="number" id="property-price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="rent-price">Precio de renta por día (ETH)</label>
                            <input type="number" id="rent-price" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="is-for-sale"> En venta
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="is-for-rent"> En renta
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
                            <button type="submit" class="btn-primary">Crear Propiedad</button>
                        </div>
                    </form>
                </div>
            `;
            
            modal.style.display = 'block';
            
            // Setup form submission
            const form = document.getElementById('create-property-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleCreateProperty();
                });
            }
        }
    }
    
    async handleCreateProperty() {
        try {
            if (!this.web3Manager.isWalletConnected()) {
                this.web3Manager.showError('Por favor, conecta tu wallet primero');
                return;
            }
            
            const title = document.getElementById('property-title').value;
            const description = document.getElementById('property-description').value;
            const location = document.getElementById('property-location').value;
            const price = document.getElementById('property-price').value;
            const rentPrice = document.getElementById('rent-price').value;
            const isForSale = document.getElementById('is-for-sale').checked;
            const isForRent = document.getElementById('is-for-rent').checked;
            
            if (!title || !description || !location || !price) {
                this.web3Manager.showError('Por favor, completa todos los campos requeridos');
                return;
            }
            
            if (!isForSale && !isForRent) {
                this.web3Manager.showError('La propiedad debe estar en venta o en renta');
                return;
            }
            
            this.web3Manager.showLoading('Creando propiedad...');
            
            // Initialize contract manager if needed
            if (!this.contractManager.web3) {
                await this.contractManager.initialize(
                    this.web3Manager.getWeb3(),
                    this.web3Manager.getCurrentAccount()
                );
            }
            
            const result = await this.contractManager.createProperty(
                title,
                description,
                location,
                price,
                isForSale,
                isForRent,
                rentPrice || '0'
            );
            
            this.web3Manager.hideLoading();
            this.web3Manager.showSuccess('Propiedad creada exitosamente');
            
            this.closeModal();
            await this.loadProperties();
            
        } catch (error) {
            this.web3Manager.hideLoading();
            this.web3Manager.showError('Error creando propiedad: ' + error.message);
        }
    }
    
    async buyProperty(propertyId) {
        try {
            if (!this.web3Manager.isWalletConnected()) {
                this.web3Manager.showError('Por favor, conecta tu wallet primero');
                return;
            }
            
            const property = this.properties.find(p => p.id === propertyId);
            if (!property) {
                this.web3Manager.showError('Propiedad no encontrada');
                return;
            }
            
            if (!property.isForSale) {
                this.web3Manager.showError('Esta propiedad no está en venta');
                return;
            }
            
            const confirmed = confirm(`¿Estás seguro de que quieres comprar "${property.title}" por ${property.price} ETH?`);
            if (!confirmed) return;
            
            this.web3Manager.showLoading('Procesando compra...');
            
            // Initialize contract manager if needed
            if (!this.contractManager.web3) {
                await this.contractManager.initialize(
                    this.web3Manager.getWeb3(),
                    this.web3Manager.getCurrentAccount()
                );
            }
            
            const result = await this.contractManager.buyProperty(propertyId, property.price);
            
            this.web3Manager.hideLoading();
            this.web3Manager.showSuccess('Propiedad comprada exitosamente');
            
            await this.loadProperties();
            
        } catch (error) {
            this.web3Manager.hideLoading();
            this.web3Manager.showError('Error comprando propiedad: ' + error.message);
        }
    }
    
    async rentProperty(propertyId) {
        try {
            if (!this.web3Manager.isWalletConnected()) {
                this.web3Manager.showError('Por favor, conecta tu wallet primero');
                return;
            }
            
            const property = this.properties.find(p => p.id === propertyId);
            if (!property) {
                this.web3Manager.showError('Propiedad no encontrada');
                return;
            }
            
            if (!property.isForRent) {
                this.web3Manager.showError('Esta propiedad no está en renta');
                return;
            }
            
            // For demo purposes, we'll use a simple prompt
            const days = prompt('¿Cuántos días quieres rentar?', '7');
            if (!days || isNaN(days) || days <= 0) {
                this.web3Manager.showError('Por favor, ingresa un número válido de días');
                return;
            }
            
            const totalRent = parseFloat(property.rentPricePerDay) * parseInt(days);
            const confirmed = confirm(`¿Estás seguro de que quieres rentar "${property.title}" por ${days} días (${totalRent} ETH total)?`);
            if (!confirmed) return;
            
            this.web3Manager.showLoading('Procesando renta...');
            
            // Initialize contract manager if needed
            if (!this.contractManager.web3) {
                await this.contractManager.initialize(
                    this.web3Manager.getWeb3(),
                    this.web3Manager.getCurrentAccount()
                );
            }
            
            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + (parseInt(days) * 24 * 60 * 60);
            
            const result = await this.contractManager.rentProperty(
                propertyId,
                startDate,
                endDate,
                totalRent
            );
            
            this.web3Manager.hideLoading();
            this.web3Manager.showSuccess('Propiedad rentada exitosamente');
            
            await this.loadProperties();
            
        } catch (error) {
            this.web3Manager.hideLoading();
            this.web3Manager.showError('Error rentando propiedad: ' + error.message);
        }
    }
    
    async placeBid(auctionId, bidAmount) {
        try {
            if (!this.web3Manager.isWalletConnected()) {
                this.web3Manager.showError('Por favor, conecta tu wallet primero');
                return;
            }
            
            if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
                this.web3Manager.showError('Por favor, ingresa una puja válida');
                return;
            }
            
            const confirmed = confirm(`¿Estás seguro de que quieres pujar ${bidAmount} ETH?`);
            if (!confirmed) return;
            
            this.web3Manager.showLoading('Enviando puja...');
            
            // Initialize contract manager if needed
            if (!this.contractManager.web3) {
                await this.contractManager.initialize(
                    this.web3Manager.getWeb3(),
                    this.web3Manager.getCurrentAccount()
                );
            }
            
            const result = await this.contractManager.placeBid(auctionId, bidAmount);
            
            this.web3Manager.hideLoading();
            this.web3Manager.showSuccess('Puja enviada exitosamente');
            
            await this.loadAuctions();
            
        } catch (error) {
            this.web3Manager.hideLoading();
            this.web3Manager.showError('Error enviando puja: ' + error.message);
        }
    }
    
    closeModal() {
        const modal = document.getElementById('property-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Additional utility methods
    async refreshData() {
        await this.loadInitialData();
    }
    
    async connectWallet() {
        await this.web3Manager.connectWallet();
        if (this.web3Manager.isWalletConnected()) {
            await this.loadUserData();
        }
    }
}

// Initialize the app
const app = new BlockBaseApp();

// Make app globally available
window.app = app;