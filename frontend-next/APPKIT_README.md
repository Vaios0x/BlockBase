# BlockBase - Reown AppKit Integration

## 🚀 Implementación Completa de Reown AppKit

Este proyecto ahora está completamente integrado con **Reown AppKit**, la solución más avanzada para conexión de wallets en Web3.

## 📦 Dependencias Instaladas

```json
{
  "@reown/appkit": "^1.x.x",
  "@reown/appkit-adapter-wagmi": "^1.x.x", 
  "wagmi": "^2.x.x",
  "viem": "^2.x.x",
  "@tanstack/react-query": "^5.x.x"
}
```

## 🔧 Configuración

### Project ID
- **Project ID**: `e1b7b8bda639fe3153018f6c76ced0a4`
- **Red**: Base Sepolia (Chain ID: 84532)
- **RPC**: https://sepolia.base.org

### Archivos de Configuración

#### `src/config/wagmi.ts`
Configuración principal de Wagmi con AppKit:
- Adaptador Wagmi configurado
- Red Base Sepolia
- Storage con cookies para SSR
- Project ID de Reown

#### `src/context/AppKitProvider.tsx`
Provider principal de AppKit:
- Configuración de QueryClient
- Metadatos de la aplicación
- Features habilitadas (analytics, socials, onramp)
- Soporte completo para SSR

## 🎯 Componentes Implementados

### 1. AppKitWalletConnect
- Botón de conexión usando `<appkit-button>`
- Información de wallet conectada
- Balance en tiempo real
- Botón de desconexión

### 2. PropertiesList
- Lista de propiedades usando hooks de Wagmi
- Integración con contratos inteligentes
- Funciones de crear y rentar propiedades
- Estados de carga y error

### 3. AppKitDemo
- Demostración de funcionalidades
- Información de conexión
- Balance y red actual
- Botones de acción

### 4. useContracts Hook
- Hooks personalizados para contratos
- Integración con PropertyRental
- Funciones de lectura y escritura
- Manejo de estados

## 🌟 Características de AppKit

### ✅ Autenticación
- **Email**: Deshabilitado
- **Socials**: Google, Twitter, Discord, GitHub
- **Wallets**: 600+ wallets soportados
- **One-Click Auth**: SIWE habilitado

### ✅ Funcionalidades
- **Analytics**: Habilitado
- **Onramp**: Habilitado para compra de crypto
- **Multi-chain**: Base Sepolia
- **Gas Sponsorship**: Disponible
- **Batch Transactions**: Soporte completo

### ✅ UX/UI
- **Modal personalizable**: Tema oscuro
- **Responsive**: Mobile-first
- **Accesibilidad**: ARIA labels
- **Loading states**: Estados de carga
- **Error handling**: Manejo de errores

## 🚀 Uso

### Conexión de Wallet
```tsx
import AppKitWalletConnect from '@/components/AppKitWalletConnect'

// En tu componente
<AppKitWalletConnect />
```

### Interacción con Contratos
```tsx
import { usePropertyRental } from '@/hooks/useContracts'

const { properties, createNewProperty, rentPropertyById } = usePropertyRental()
```

### Web Components
```tsx
// Botón de conexión
<appkit-button />

// Modal de configuración
<appkit-connect-button />
```

## 🔗 Smart Contracts

Todos los contratos están desplegados en Base Sepolia:

- **PropertyRental**: `0x7094f1eb1c49Cf89B793844CecE4baE655f3359b`
- **PropertyNFT**: `0x51FBdDcD12704e4FCc28880E22b582362811cCdf`
- **EscrowService**: `0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4`
- **PropertyAuction**: `0x1b43c611F3709e2372a108E3424a7C0D89724e93`
- **PropertyInsurance**: `0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff`
- **PropertyManagement**: `0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6`

## 🛠️ Desarrollo

### Comandos
```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

### Estructura de Archivos
```
src/
├── config/
│   └── wagmi.ts              # Configuración de Wagmi
├── context/
│   └── AppKitProvider.tsx    # Provider de AppKit
├── components/
│   ├── AppKitWalletConnect.tsx
│   ├── AppKitDemo.tsx
│   └── PropertiesList.tsx
├── hooks/
│   └── useContracts.ts       # Hooks para contratos
└── types/
    └── global.d.ts         # Tipos TypeScript
```

## 📱 PWA Features

El proyecto está configurado como PWA con:
- Service Worker
- Manifest
- Offline support
- Mobile optimization

## 🔒 Seguridad

- **Project ID**: Configurado correctamente
- **Network**: Base Sepolia (testnet)
- **Validation**: Validación de contratos
- **Error Handling**: Manejo robusto de errores

## 📊 Analytics

AppKit incluye analytics automáticos:
- Conexiones de wallet
- Transacciones
- Errores
- Performance

## 🎨 Theming

El tema está personalizado para BlockBase:
- Colores: Purple, Blue, Cyan
- Modo: Dark theme
- Responsive: Mobile-first
- Animaciones: Smooth transitions

## 🚀 Deploy

Para desplegar en producción:

1. Configurar variables de entorno
2. Build del proyecto
3. Deploy en Vercel/Netlify
4. Configurar dominio en Reown Dashboard

## 📚 Documentación

- [Reown AppKit Docs](https://docs.reown.com/appkit/next/core/installation)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)

## 🤝 Soporte

Para soporte técnico:
- Reown Discord
- GitHub Issues
- Documentación oficial

---

**BlockBase** - El marketplace de real estate más avanzado construido con Reown AppKit 🏠✨
