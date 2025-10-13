# 📚 API Reference - BlockBase

## 🏗️ Smart Contracts

### PropertyRental Contract
**Address**: `0x7094f1eb1c49Cf89B793844CecE4baE655f3359b`  
**Network**: Base Sepolia (Chain ID: 84532)

#### Functions

##### `createProperty(string name, string description, uint256 price)`
Crea una nueva propiedad en el marketplace.

**Parameters:**
- `name` (string): Nombre de la propiedad
- `description` (string): Descripción detallada
- `price` (uint256): Precio en wei (1 ETH = 10^18 wei)

**Returns:** `uint256` - ID de la propiedad creada

**Events:**
```solidity
event PropertyCreated(uint256 indexed propertyId, address indexed owner, string name, uint256 price);
```

##### `rentProperty(uint256 propertyId, uint256 rentDuration)`
Renta una propiedad por un período específico.

**Parameters:**
- `propertyId` (uint256): ID de la propiedad
- `rentDuration` (uint256): Duración del alquiler en segundos

**Returns:** `bool` - true si el alquiler fue exitoso

**Events:**
```solidity
event PropertyRented(uint256 indexed propertyId, address indexed renter, uint256 rentDuration, uint256 totalCost);
```

##### `getProperty(uint256 propertyId)`
Obtiene información de una propiedad específica.

**Returns:**
```solidity
struct Property {
    string name;
    string description;
    uint256 price;
    address owner;
    bool isRented;
    bool isActive;
    uint256 createdAt;
}
```

### PropertyNFT Contract
**Address**: `0x51FBdDcD12704e4FCc28880E22b582362811cCdf`

#### Functions

##### `mintPropertyNFT(uint256 propertyId, string tokenURI)`
Convierte una propiedad en NFT.

**Parameters:**
- `propertyId` (uint256): ID de la propiedad
- `tokenURI` (string): URI de metadatos del NFT

**Returns:** `uint256` - Token ID del NFT

### EscrowService Contract
**Address**: `0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4`

#### Functions

##### `createEscrow(uint256 propertyId, uint256 amount)`
Crea un escrow para una transacción.

**Parameters:**
- `propertyId` (uint256): ID de la propiedad
- `amount` (uint256): Cantidad en wei

**Returns:** `uint256` - ID del escrow

## 🔌 Frontend API

### Hooks

#### `usePropertyRental()`
Hook para interactuar con el contrato PropertyRental.

```typescript
const {
  properties,
  loadingProperties,
  createNewProperty,
  rentPropertyById,
  isCreatingProperty,
  isRentingProperty
} = usePropertyRental()
```

**Returns:**
- `properties`: Array de propiedades disponibles
- `loadingProperties`: Estado de carga
- `createNewProperty(name, description, price)`: Crear propiedad
- `rentPropertyById(id, price)`: Rentar propiedad
- `isCreatingProperty`: Estado de creación
- `isRentingProperty`: Estado de alquiler

#### `useWalletConnection()`
Hook para manejo de conexión de wallet.

```typescript
const {
  isConnecting,
  error,
  connect,
  clearError
} = useWalletConnection()
```

#### `useErrorHandler(options)`
Hook para manejo centralizado de errores.

```typescript
const {
  error,
  hasError,
  handleError,
  clearError,
  retry,
  reset
} = useErrorHandler({
  onError: (error) => console.error(error),
  maxRetries: 3
})
```

#### `useLocalStorage(key, initialValue)`
Hook para persistencia en localStorage.

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', 'default')
```

#### `useApi(options)`
Hook para peticiones HTTP con retry automático.

```typescript
const {
  data,
  loading,
  error,
  execute,
  reset
} = useApi({
  retryCount: 3,
  timeout: 10000
})
```

### Components

#### `<AppKitWalletConnect />`
Componente para conexión de wallet con AppKit.

**Props:**
- `className?`: Clases CSS adicionales
- `variant?`: 'primary' | 'secondary'
- `size?`: 'sm' | 'md' | 'lg'

#### `<PropertiesList />`
Componente para mostrar lista de propiedades.

**Features:**
- Lista paginada de propiedades
- Filtros por estado y precio
- Estados de carga y error
- Accesibilidad completa

#### `<LoadingSpinner />`
Componente de carga reutilizable.

**Props:**
- `size?`: 'sm' | 'md' | 'lg' | 'xl'
- `variant?`: 'primary' | 'secondary' | 'accent'
- `text?`: Texto a mostrar
- `showText?`: Mostrar texto

#### `<Toast />`
Sistema de notificaciones.

**Props:**
- `message`: Mensaje a mostrar
- `type?`: 'success' | 'error' | 'warning' | 'info'
- `duration?`: Duración en ms
- `position?`: Posición en pantalla

#### `<Modal />`
Modal reutilizable.

**Props:**
- `isOpen`: Estado de apertura
- `onClose`: Función de cierre
- `title?`: Título del modal
- `size?`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `loading?`: Estado de carga

## 🌐 Network Configuration

### Base Sepolia
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH

### Contract Addresses
```typescript
const CONTRACTS = {
  PropertyRental: '0x7094f1eb1c49Cf89B793844CecE4baE655f3359b',
  PropertyNFT: '0x51FBdDcD12704e4FCc28880E22b582362811cCdf',
  EscrowService: '0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4',
  PropertyAuction: '0x1b43c611F3709e2372a108E3424a7C0D89724e93',
  PropertyInsurance: '0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff',
  PropertyManagement: '0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6'
}
```

## 🔧 Development

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Tests
pnpm test

# Type check
pnpm type-check
```

### Variables de Entorno

```env
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
```

## 📱 PWA Features

### Service Worker
- Cache inteligente de recursos
- Estrategias Cache First y Network First
- Notificaciones push
- Offline support

### Manifest
- Instalación como app
- Shortcuts de navegación
- Screenshots para stores
- Iconos adaptativos

## 🔒 Security

### Headers de Seguridad
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy configurado

### Validaciones
- Sanitización de inputs
- Validación de tipos TypeScript
- Linting automático
- Security audit en CI/CD
