# 🏠 BlockBase - Real Estate Marketplace

Un marketplace completo de bienes raíces construido en blockchain con 6 smart contracts desplegados en Base Sepolia.

## 🚀 Características

### 📋 Smart Contracts Desplegados

1. **🏠 PropertyRental** - `0x7094f1eb1c49Cf89B793844CecE4baE655f3359b`
   - Contrato principal para rentar y vender propiedades
   - Funciones: crear, actualizar, rentar y comprar propiedades
   - Comisión de plataforma: 2%

2. **🎨 PropertyNFT** - `0x51FBdDcD12704e4FCc28880E22b582362811cCdf`
   - NFTs para representar propiedades
   - Metadatos completos de propiedades
   - Funciones: mintear, actualizar metadatos

3. **🔒 EscrowService** - `0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4`
   - Servicio de custodia para transacciones seguras
   - Funciones: crear escrow, liberar fondos, resolver disputas
   - Comisión de escrow: 1%

4. **🔨 PropertyAuction** - `0x1b43c611F3709e2372a108E3424a7C0D89724e93`
   - Sistema de subastas para propiedades
   - Funciones: crear subastas, pujar, finalizar subastas
   - Comisión de subasta: 2%

5. **🛡️ PropertyInsurance** - `0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff`
   - Sistema de seguros para propiedades
   - Funciones: crear pólizas, presentar reclamos, aprobar/rechazar
   - Comisión de seguro: 5%

6. **🏢 PropertyManagement** - `0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6`
   - Gestión completa de propiedades
   - Funciones: mantenimiento, inquilinos, gestión
   - Comisión de gestión: 3%

## 🌐 Información de Red

- **Red**: Base Sepolia
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org/
- **RPC URL**: https://sepolia.base.org

## 🔗 Enlaces de los Contratos

- [PropertyRental](https://sepolia.basescan.org/address/0x7094f1eb1c49Cf89B793844CecE4baE655f3359b)
- [PropertyNFT](https://sepolia.basescan.org/address/0x51FBdDcD12704e4FCc28880E22b582362811cCdf)
- [EscrowService](https://sepolia.basescan.org/address/0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4)
- [PropertyAuction](https://sepolia.basescan.org/address/0x1b43c611F3709e2372a108E3424a7C0D89724e93)
- [PropertyInsurance](https://sepolia.basescan.org/address/0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff)
- [PropertyManagement](https://sepolia.basescan.org/address/0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6)

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- npm o pnpm
- Hardhat
- Cuenta en Base Sepolia con ETH para gas

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Vaios0x/BlockBase.git
cd BlockBase

# Instalar dependencias con pnpm
pnpm install

# Compilar contratos
pnpm run compile
```

### Despliegue

```bash
# Desplegar todos los contratos
pnpm run deploy:all

# Desplegar contratos individuales
pnpm run deploy:rental
pnpm run deploy:nft
pnpm run deploy:escrow
pnpm run deploy:auction
pnpm run deploy:insurance
pnpm run deploy:management
```

### Configuración

1. Crear archivo `.env` con tu private key:
```
PRIVATE_KEY=tu_private_key_aqui
```

2. Asegúrate de tener ETH en Base Sepolia para gas fees

## 📁 Estructura del Proyecto

```
BlockBase/
├── contracts/                 # Smart contracts
│   ├── PropertyRental.sol     # Contrato principal
│   ├── PropertyNFT.sol        # NFTs de propiedades
│   ├── EscrowService.sol      # Servicio de custodia
│   ├── PropertyAuction.sol   # Sistema de subastas
│   ├── PropertyInsurance.sol # Sistema de seguros
│   └── PropertyManagement.sol # Gestión de propiedades
├── scripts/                   # Scripts de despliegue
│   ├── deploy-all.js         # Desplegar todos
│   ├── deploy-rental.js      # Desplegar PropertyRental
│   ├── deploy-nft.js         # Desplegar PropertyNFT
│   ├── deploy-escrow.js      # Desplegar EscrowService
│   ├── deploy-auction.js     # Desplegar PropertyAuction
│   ├── deploy-insurance.js   # Desplegar PropertyInsurance
│   └── deploy-management.js  # Desplegar PropertyManagement
├── hardhat.config.js         # Configuración de Hardhat
├── package.json              # Dependencias del proyecto
└── README.md                 # Este archivo
```

## 🔧 Funcionalidades Principales

### PropertyRental
- ✅ Crear propiedades
- ✅ Actualizar propiedades
- ✅ Rentar propiedades
- ✅ Comprar propiedades
- ✅ Gestión de comisiones

### PropertyNFT
- ✅ Mintear NFTs de propiedades
- ✅ Metadatos completos
- ✅ Transferir propiedad
- ✅ Actualizar metadatos

### EscrowService
- ✅ Crear escrow
- ✅ Liberar fondos
- ✅ Resolver disputas
- ✅ Gestión segura de transacciones

### PropertyAuction
- ✅ Crear subastas
- ✅ Sistema de pujas
- ✅ Finalizar subastas
- ✅ Gestión de ganadores

### PropertyInsurance
- ✅ Crear pólizas
- ✅ Presentar reclamos
- ✅ Aprobar/rechazar reclamos
- ✅ Gestión de seguros

### PropertyManagement
- ✅ Programar mantenimiento
- ✅ Gestión de inquilinos
- ✅ Seguimiento de propiedades
- ✅ Gestión completa

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test
```

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- GitHub: [@Vaios0x](https://github.com/Vaios0x)
- Proyecto: [BlockBase](https://github.com/Vaios0x/BlockBase)

---

**Desarrollado con ❤️ para la comunidad blockchain**
