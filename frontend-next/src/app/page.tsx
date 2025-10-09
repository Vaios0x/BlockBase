'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import NeuralButton from '@/components/NeuralButton';
import AppKitWalletConnect from '@/components/AppKitWalletConnect';
import PropertiesList from '@/components/PropertiesList';
import AppKitDemo from '@/components/AppKitDemo';
import ConnectionOptions from '@/components/ConnectionOptions';
import BuilderRewardsStatus from '@/components/BuilderRewardsStatus';
import BuilderProfile from '@/components/BuilderProfile';
import TalentProtocolProfile from '@/components/TalentProtocolProfile';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full z-0">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
          zIndex: -1 
        }}
      />
    </div>
  )
});

export default function Home() {
  useEffect(() => {
    // Initialize the app when component mounts
    if (typeof window !== 'undefined' && (window as any).app) {
      console.log('BlockBase App initialized');
    }
  }, []);

  return (
    <>
      {/* Scripts */}
      <Script src="https://cdn.jsdelivr.net/npm/web3@1.8.0/dist/web3.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js" strategy="beforeInteractive" />
      <Script src="/js/web3.js" strategy="beforeInteractive" />
      <Script src="/js/contracts.js" strategy="afterInteractive" />
      <Script src="/js/app.js" strategy="afterInteractive" />

      {/* Neural Background */}
      <NeuralBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-building text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                BlockBase
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Inicio
              </a>
              <a href="#properties" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Propiedades
              </a>
              <a href="#auctions" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Subastas
              </a>
              <a href="#insurance" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Seguros
              </a>
              <a href="#management" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Gestión
              </a>
              <a href="#dashboard" className="text-white/80 hover:text-white transition-colors duration-300 font-medium px-3 py-2">
                Dashboard
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <AppKitWalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  BlockBase
                </span>
                <br />
                <span className="text-white">Marketplace de Real Estate</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                La plataforma blockchain más avanzada para rentar, vender y gestionar propiedades inmobiliarias con tecnología Web3.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 max-w-2xl">
              <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-cyan-400 mb-2">6</div>
                <div className="text-sm text-gray-400">Smart Contracts</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-sm text-gray-400">Descentralizado</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">AppKit</div>
                <div className="text-sm text-gray-400">Reown Integration</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <NeuralButton variant="primary" size="lg" neural={true} className="flex items-center justify-center gap-3 w-full sm:w-auto">
                <i className="fas fa-search"></i>
                Explorar Propiedades
              </NeuralButton>
              <NeuralButton variant="secondary" size="lg" className="flex items-center justify-center gap-3 w-full sm:w-auto">
                <i className="fas fa-plus"></i>
                Crear Propiedad
              </NeuralButton>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="p-8 max-w-md w-full rounded-2xl border shadow-lg bg-white/12 backdrop-blur-lg border-white/18 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="space-y-6">
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-home text-6xl text-white/80"></i>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Villa Moderna</h3>
                  <p className="text-gray-300">Madrid, España</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-cyan-400">2.5 ETH</span>
                    <span className="text-gray-400">/ mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="properties-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Propiedades Disponibles</h2>
            <p className="section-description">Descubre propiedades únicas en nuestro marketplace descentralizado</p>
          </div>
          
          <div className="filters glass">
            <div className="filter-group">
              <label>Filtrar por:</label>
              <select id="property-filter">
                <option value="all">Todas</option>
                <option value="sale">En Venta</option>
                <option value="rent">En Renta</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Ubicación:</label>
              <input type="text" id="location-filter" placeholder="Buscar ubicación..." />
            </div>
            <div className="filter-group">
              <label>Precio:</label>
              <input type="range" id="price-filter" min="0" max="10" step="0.1" />
              <span id="price-value">0 ETH</span>
            </div>
          </div>

          <PropertiesList />
        </div>
      </section>

      {/* Auctions Section */}
      <section id="auctions" className="auctions-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Subastas Activas</h2>
            <p className="section-description">Participa en subastas de propiedades exclusivas</p>
          </div>
          
          <div className="auctions-grid" id="auctions-grid">
            {/* Auctions will be loaded here */}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section id="insurance" className="insurance-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Seguros de Propiedades</h2>
            <p className="section-description">Protege tu inversión con nuestros seguros descentralizados</p>
          </div>
          
          <div className="insurance-cards">
            <div className="insurance-card glass">
              <div className="insurance-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Seguro Básico</h3>
              <p>Cobertura esencial para tu propiedad</p>
              <div className="insurance-price">0.1 ETH</div>
              <button className="btn-primary">Contratar</button>
            </div>
            
            <div className="insurance-card glass">
              <div className="insurance-icon">
                <i className="fas fa-shield-virus"></i>
              </div>
              <h3>Seguro Premium</h3>
              <p>Cobertura completa con beneficios adicionales</p>
              <div className="insurance-price">0.3 ETH</div>
              <button className="btn-primary">Contratar</button>
            </div>
            
            <div className="insurance-card glass">
              <div className="insurance-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>Seguro VIP</h3>
              <p>Máxima protección con servicios premium</p>
              <div className="insurance-price">0.5 ETH</div>
              <button className="btn-primary">Contratar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section id="management" className="management-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Gestión de Propiedades</h2>
            <p className="section-description">Herramientas avanzadas para gestionar tu portafolio inmobiliario</p>
          </div>
          
          <div className="management-tools">
            <div className="tool-card glass">
              <div className="tool-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Mantenimiento</h3>
              <p>Programa y gestiona el mantenimiento de tus propiedades</p>
              <button className="btn-primary">Gestionar</button>
            </div>
            
            <div className="tool-card glass">
              <div className="tool-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Inquilinos</h3>
              <p>Administra inquilinos y contratos de arrendamiento</p>
              <button className="btn-primary">Gestionar</button>
            </div>
            
            <div className="tool-card glass">
              <div className="tool-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Analytics</h3>
              <p>Analiza el rendimiento de tus inversiones</p>
              <button className="btn-primary">Ver Reportes</button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="dashboard-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mi Dashboard</h2>
            <p className="section-description">Gestiona todas tus propiedades y transacciones</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card glass">
              <h3>Mis Propiedades</h3>
              <div className="property-list" id="my-properties">
                {/* User properties will be loaded here */}
              </div>
            </div>
            
            <div className="dashboard-card glass">
              <h3>Transacciones Recientes</h3>
              <div className="transaction-list" id="recent-transactions">
                {/* Recent transactions will be loaded here */}
              </div>
            </div>
            
            <div className="dashboard-card glass">
              <h3>AppKit Demo</h3>
              <AppKitDemo />
            </div>
            
            <div className="dashboard-card glass">
              <h3>Opciones de Conexión</h3>
              <ConnectionOptions />
            </div>
            
            <div className="dashboard-card glass">
              <h3>Builder Profile</h3>
              <BuilderProfile />
            </div>
            
            <div className="dashboard-card glass">
              <h3>Builder Rewards Status</h3>
              <BuilderRewardsStatus />
            </div>
            
            <div className="dashboard-card glass">
              <h3>Talent Protocol Profile</h3>
              <TalentProtocolProfile />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>BlockBase</h3>
              <p>El marketplace de real estate más avanzado construido en blockchain.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-discord"></i></a>
                <a href="#"><i className="fab fa-github"></i></a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Contratos</h4>
              <ul>
                <li><a href="https://sepolia.basescan.org/address/0x7094f1eb1c49Cf89B793844CecE4baE655f3359b" target="_blank">PropertyRental</a></li>
                <li><a href="https://sepolia.basescan.org/address/0x51FBdDcD12704e4FCc28880E22b582362811cCdf" target="_blank">PropertyNFT</a></li>
                <li><a href="https://sepolia.basescan.org/address/0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4" target="_blank">EscrowService</a></li>
                <li><a href="https://sepolia.basescan.org/address/0x1b43c611F3709e2372a108E3424a7C0D89724e93" target="_blank">PropertyAuction</a></li>
                <li><a href="https://sepolia.basescan.org/address/0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff" target="_blank">PropertyInsurance</a></li>
                <li><a href="https://sepolia.basescan.org/address/0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6" target="_blank">PropertyManagement</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Recursos</h4>
              <ul>
                <li><a href="#">Documentación</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Guías</a></li>
                <li><a href="#">Soporte</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Red</h4>
              <p>Base Sepolia</p>
              <p>Chain ID: 84532</p>
              <p>Explorer: <a href="https://sepolia.basescan.org/" target="_blank">BaseScan</a></p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 BlockBase. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <div id="property-modal" className="modal">
        <div className="modal-content glass">
          <span className="close">&times;</span>
          <div id="modal-body">
            {/* Modal content will be loaded here */}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="loading-overlay" className="loading-overlay">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Procesando transacción...</p>
        </div>
    </div>

    </>
  );
}