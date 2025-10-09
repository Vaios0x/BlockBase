# 🔧 Variables de Entorno - BlockBase

## 📋 Configuración Completa de Variables de Entorno

### 🚀 **Variables Principales Requeridas**

#### **1. Reown AppKit Configuration**
```bash
# Obtén tu Project ID desde: https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=YOUR_PROJECT_ID_HERE
```

#### **2. Base Network Configuration**
```bash
# Base Sepolia RPC URL (Testnet)
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Base Mainnet RPC URL (Production)
NEXT_PUBLIC_BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Chain ID for Base Sepolia
NEXT_PUBLIC_CHAIN_ID=84532

# Chain ID for Base Mainnet
NEXT_PUBLIC_MAINNET_CHAIN_ID=8453
```

#### **3. Smart Contract Addresses**
```bash
# Property Rental Contract
NEXT_PUBLIC_PROPERTY_RENTAL_ADDRESS=0x7094f1eb1c49Cf89B793844CecE4baE655f3359b

# Property NFT Contract
NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=0x51FBdDcD12704e4FCc28880E22b582362811cCdf

# Escrow Service Contract
NEXT_PUBLIC_ESCROW_SERVICE_ADDRESS=0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4

# Property Auction Contract
NEXT_PUBLIC_PROPERTY_AUCTION_ADDRESS=0x1b43c611F3709e2372a108E3424a7C0D89724e93

# Property Insurance Contract
NEXT_PUBLIC_PROPERTY_INSURANCE_ADDRESS=0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff

# Property Management Contract
NEXT_PUBLIC_PROPERTY_MANAGEMENT_ADDRESS=0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6
```

### ⚙️ **Variables de Configuración**

#### **4. API Configuration**
```bash
# Base API URL
NEXT_PUBLIC_API_BASE_URL=https://api.blockbase.com

# API Timeout (milliseconds)
NEXT_PUBLIC_API_TIMEOUT=30000

# API Retry Attempts
NEXT_PUBLIC_API_RETRIES=3
```

#### **5. Gas Configuration**
```bash
# Default Gas Limit
NEXT_PUBLIC_DEFAULT_GAS_LIMIT=300000

# Default Gas Price (in wei)
NEXT_PUBLIC_DEFAULT_GAS_PRICE=20000000000
```

#### **6. Business Logic Configuration**
```bash
# Maximum Property Price (in ETH)
NEXT_PUBLIC_MAX_PROPERTY_PRICE=10

# Minimum Rental Days
NEXT_PUBLIC_MIN_RENTAL_DAYS=1

# Maximum Rental Days
NEXT_PUBLIC_MAX_RENTAL_DAYS=365

# Platform Commission (percentage)
NEXT_PUBLIC_PLATFORM_COMMISSION=2
```

### 🎨 **Variables de UI**

#### **7. UI Configuration**
```bash
# Theme Configuration
NEXT_PUBLIC_THEME=dark

# Primary Color
NEXT_PUBLIC_PRIMARY_COLOR=#6366f1

# Secondary Color
NEXT_PUBLIC_SECONDARY_COLOR=#8b5cf6

# Accent Color
NEXT_PUBLIC_ACCENT_COLOR=#06b6d4

# Glass Opacity
NEXT_PUBLIC_GLASS_OPACITY=0.05

# Blur Intensity
NEXT_PUBLIC_BLUR_INTENSITY=20
```

#### **8. Feature Flags**
```bash
# Enable NFT Features
NEXT_PUBLIC_ENABLE_NFTS=true

# Enable Auction Features
NEXT_PUBLIC_ENABLE_AUCTIONS=true

# Enable Insurance Features
NEXT_PUBLIC_ENABLE_INSURANCE=true

# Enable Management Features
NEXT_PUBLIC_ENABLE_MANAGEMENT=true

# Enable Escrow Features
NEXT_PUBLIC_ENABLE_ESCROW=true
```

### 🔧 **Variables de Desarrollo**

#### **9. Development Configuration**
```bash
# Development Mode
NODE_ENV=development

# Debug Mode
NEXT_PUBLIC_DEBUG=false

# Log Level
NEXT_PUBLIC_LOG_LEVEL=info
```

#### **10. Security Configuration**
```bash
# Enable Security Headers
NEXT_PUBLIC_ENABLE_SECURITY_HEADERS=true

# Content Security Policy
NEXT_PUBLIC_CSP_POLICY=default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

### 📊 **Variables de Analytics**

#### **11. Analytics Configuration**
```bash
# Google Analytics ID (optional)
NEXT_PUBLIC_GA_ID=

# Mixpanel Token (optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=
```

### 🌐 **Variables de Servicios Externos**

#### **12. External Services**
```bash
# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Pinata API Key (for IPFS)
PINATA_API_KEY=

# Pinata Secret Key
PINATA_SECRET_KEY=
```

### 📧 **Variables de Email**

#### **13. Email Configuration**
```bash
# SMTP Host
SMTP_HOST=

# SMTP Port
SMTP_PORT=587

# SMTP User
SMTP_USER=

# SMTP Password
SMTP_PASSWORD=

# From Email
SMTP_FROM_EMAIL=noreply@blockbase.com
```

### 🗄️ **Variables de Base de Datos**

#### **14. Database Configuration**
```bash
# Database URL
DATABASE_URL=

# Redis URL (for caching)
REDIS_URL=
```

### 📈 **Variables de Monitoreo**

#### **15. Monitoring & Logging**
```bash
# Sentry DSN (for error tracking)
SENTRY_DSN=

# LogRocket App ID (for session replay)
LOGROCKET_APP_ID=
```

### 🚀 **Variables de Despliegue**

#### **16. Deployment Configuration**
```bash
# Vercel Deployment URL
VERCEL_URL=

# Custom Domain
NEXT_PUBLIC_DOMAIN=blockbase.com
```

### 📱 **Variables de Redes Sociales**

#### **17. Social Media Configuration**
```bash
# Twitter Handle
NEXT_PUBLIC_TWITTER_HANDLE=@BlockBase

# Discord Server ID
NEXT_PUBLIC_DISCORD_SERVER_ID=

# GitHub Repository
NEXT_PUBLIC_GITHUB_REPO=https://github.com/Vaios0x/BlockBase
```

### ⚖️ **Variables Legales**

#### **18. Legal & Compliance**
```bash
# Terms of Service URL
NEXT_PUBLIC_TERMS_URL=https://blockbase.com/terms

# Privacy Policy URL
NEXT_PUBLIC_PRIVACY_URL=https://blockbase.com/privacy

# Cookie Policy URL
NEXT_PUBLIC_COOKIE_URL=https://blockbase.com/cookies
```

## 🚀 **Configuración Rápida**

### **Para Desarrollo Local:**
1. Copia `env.example` a `.env.local`
2. Configura `NEXT_PUBLIC_PROJECT_ID` con tu Project ID de Reown
3. Las demás variables ya están configuradas con valores por defecto

### **Para Producción:**
1. Configura todas las variables en tu plataforma de despliegue
2. Asegúrate de usar las direcciones de contratos de mainnet
3. Configura las URLs de API de producción

## 📝 **Notas Importantes**

- **NEXT_PUBLIC_**: Variables que se exponen al cliente
- **Sin prefijo**: Variables solo del servidor
- **Reown Project ID**: Obtén uno desde [https://cloud.reown.com](https://cloud.reown.com)
- **Contratos**: Las direcciones están desplegadas en Base Sepolia
- **Seguridad**: Nunca commitees archivos `.env` con datos sensibles
