# 🔗 Guía de Contribuciones a Repositorios Externos

## 🎯 **ESTRATEGIA PARA TOP 5**

Contribuir a repositorios de WalletConnect/Reown, Base y Web3 es **CRÍTICO** para estar en Top 5 del Builder Rewards program.

### 📊 **IMPACTO EN BUILDER SCORE**

**Contribuciones Externas (30% del score):**
- ✅ Commits en repositorios públicos
- ✅ Pull requests aceptados
- ✅ Issues resueltos
- ✅ Stars y forks recibidos

## 🚀 **REPOSITORIOS PRIORITARIOS**

### **1. WALLETCONNECT/REOWN (MÁXIMO IMPACTO)**

#### **Repositorios Principales:**
- **AppKit**: [github.com/WalletConnect/appkit](https://github.com/WalletConnect/appkit)
- **Docs**: [github.com/WalletConnect/docs](https://github.com/WalletConnect/docs)
- **Monorepo**: [github.com/WalletConnect/walletconnect-monorepo](https://github.com/WalletConnect/walletconnect-monorepo)

#### **Tipos de Contribuciones:**
- **Documentación**: Mejorar ejemplos, corregir errores
- **Ejemplos**: Añadir casos de uso con tu Project ID
- **Tests**: Añadir tests para casos edge
- **Issues**: Reportar bugs, sugerir mejoras

### **2. BASE ECOSYSTEM (ALTO IMPACTO)**

#### **Repositorios Principales:**
- **Base Docs**: [github.com/base-org/docs](https://github.com/base-org/docs)
- **Base Examples**: [github.com/base-org/examples](https://github.com/base-org/examples)
- **Base SDK**: [github.com/base-org/base-sdk](https://github.com/base-org/base-sdk)

#### **Tipos de Contribuciones:**
- **Ejemplos**: Añadir ejemplos con tus contratos
- **Documentación**: Mejorar guías de desarrollo
- **SDK**: Añadir funcionalidades útiles
- **Tests**: Mejorar cobertura de tests

### **3. WEB3 ECOSYSTEM (MEDIO IMPACTO)**

#### **Repositorios Principales:**
- **Web3.js**: [github.com/web3/web3.js](https://github.com/web3/web3.js)
- **Ethers.js**: [github.com/ethers-io/ethers.js](https://github.com/ethers-io/ethers.js)
- **Wagmi**: [github.com/wagmi-dev/wagmi](https://github.com/wagmi-dev/wagmi)

#### **Tipos de Contribuciones:**
- **Documentación**: Mejorar ejemplos
- **Ejemplos**: Añadir casos de uso
- **Tests**: Añadir tests de integración
- **Issues**: Reportar bugs, sugerir mejoras

## 🎯 **ESTRATEGIA DE CONTRIBUCIONES**

### **SEMANA 1: WALLETCONNECT/REOWN**
```bash
# Contribuir a AppKit
bash scripts/contribute-external.sh
# Seleccionar: 1. walletconnect-docs
```

**Objetivos:**
- 3 PRs a WalletConnect
- 10+ commits
- 5+ issues resueltos
- 2+ stars recibidos

### **SEMANA 2: BASE ECOSYSTEM**
```bash
# Contribuir a Base
bash scripts/contribute-external.sh
# Seleccionar: 2. base-docs
```

**Objetivos:**
- 3 PRs a Base
- 10+ commits
- 5+ issues resueltos
- 2+ stars recibidos

### **SEMANA 3: WEB3 ECOSYSTEM**
```bash
# Contribuir a Web3
bash scripts/contribute-external.sh
# Seleccionar: 3. web3-js
```

**Objetivos:**
- 3 PRs a Web3
- 10+ commits
- 5+ issues resueltos
- 2+ stars recibidos

## 📝 **TIPOS DE CONTRIBUCIONES**

### **1. DOCUMENTACIÓN (Más fácil)**
- Corregir errores tipográficos
- Mejorar ejemplos
- Añadir casos de uso
- Traducir documentación

### **2. EJEMPLOS (Medio)**
- Añadir ejemplos con tu Project ID
- Crear casos de uso reales
- Mejorar ejemplos existentes
- Añadir ejemplos de integración

### **3. TESTS (Avanzado)**
- Añadir tests de integración
- Mejorar cobertura
- Corregir tests fallidos
- Añadir casos edge

### **4. CÓDIGO (Experto)**
- Añadir funcionalidades
- Optimizar performance
- Corregir bugs
- Mejorar arquitectura

## 🚀 **PROCESO PASO A PASO**

### **PASO 1: FORK DEL REPOSITORIO**
```bash
# En GitHub, hacer fork del repositorio
# Luego clonar tu fork
git clone https://github.com/Vaios0x/repo-name.git
```

### **PASO 2: CREAR RAMA**
```bash
git checkout -b contribution-from-vaiosx-$(date +%Y%m%d)
```

### **PASO 3: HACER CAMBIOS**
```bash
# Editar archivos
# Añadir contribución
# Hacer commit
git add .
git commit -m "feat: add contribution from vaiosx.base.eth

Builder: vaiosx.base.eth
Date: $(date +"%Y-%m-%d")
Rewards: $WCT Tokens"
```

### **PASO 4: SUBIR RAMA**
```bash
git push origin contribution-from-vaiosx-$(date +%Y%m%d)
```

### **PASO 5: CREAR PR**
- Ve a GitHub
- Haz clic en "Compare & pull request"
- Añade título y descripción
- Asigna labels
- Crea el PR

## 📊 **MÉTRICAS OBJETIVO**

### **SEMANAL:**
- **PRs**: 3+ a repositorios externos
- **Commits**: 30+ en repositorios externos
- **Issues**: 10+ resueltos
- **Stars**: 5+ recibidos

### **MENSUAL:**
- **PRs**: 12+ a repositorios externos
- **Commits**: 120+ en repositorios externos
- **Issues**: 40+ resueltos
- **Stars**: 20+ recibidos

## 🎯 **REPOSITORIOS ESPECÍFICOS**

### **WALLETCONNECT APPKIT**
```bash
# Clonar repositorio
git clone https://github.com/WalletConnect/appkit.git
cd appkit

# Crear rama
git checkout -b vaiosx-contribution-$(date +%Y%m%d)

# Añadir ejemplo con tu Project ID
cat > examples/vaiosx-example.md << EOF
# Ejemplo de vaiosx.base.eth

## Project ID: e1b7b8bda639fe3153018f6c76ced0a4
## Basename: vaiosx.base.eth
## Network: Base Sepolia

\`\`\`typescript
import { createAppKit } from '@reown/appkit/react'

const appKit = createAppKit({
  projectId: 'e1b7b8bda639fe3153018f6c76ced0a4',
  networks: [baseSepolia],
  defaultNetwork: baseSepolia
})
\`\`\`
EOF

# Hacer commit
git add examples/vaiosx-example.md
git commit -m "docs: add example from vaiosx.base.eth

Builder: vaiosx.base.eth
Project ID: e1b7b8bda639fe3153018f6c76ced0a4
Rewards: $WCT Tokens"

# Subir rama
git push origin vaiosx-contribution-$(date +%Y%m%d)
```

### **BASE DOCS**
```bash
# Clonar repositorio
git clone https://github.com/base-org/docs.git
cd docs

# Crear rama
git checkout -b vaiosx-contribution-$(date +%Y%m%d)

# Añadir ejemplo con tus contratos
cat > examples/blockbase-example.md << EOF
# BlockBase Real Estate Marketplace

## Contratos Desplegados en Base Sepolia

- PropertyRental: 0x7094f1eb1c49Cf89B793844CecE4baE655f3359b
- PropertyNFT: 0x51FBdDcD12704e4FCc28880E22b582362811cCdf
- EscrowService: 0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4

## Builder: vaiosx.base.eth
## Network: Base Sepolia (84532)
EOF

# Hacer commit
git add examples/blockbase-example.md
git commit -m "docs: add BlockBase example from vaiosx.base.eth

Builder: vaiosx.base.eth
Contracts: 6 deployed on Base Sepolia
Rewards: $WCT Tokens"

# Subir rama
git push origin vaiosx-contribution-$(date +%Y%m%d)
```

## 🏆 **BENEFICIOS PARA TOP 5**

### **VISIBILIDAD:**
- ✅ Tu nombre aparece en repositorios populares
- ✅ Otros builders te ven
- ✅ Networking automático
- ✅ Reconocimiento de la comunidad

### **CRÉDITO:**
- ✅ Commits públicos verificables
- ✅ Contribuciones trackeadas
- ✅ Impacto medible
- ✅ Reputación construida

### **REWARDS:**
- ✅ Builder Score alto
- ✅ Top 5 garantizado
- ✅ $WCT tokens máximos
- ✅ Tier 1 asegurado

## 🎯 **RESUMEN PARA TOP 5**

**CONTRIBUCIONES SEMANALES:**
- ✅ 3 PRs a repositorios externos
- ✅ 30+ commits en repositorios externos
- ✅ 10+ issues resueltos
- ✅ 5+ stars recibidos

**CONTRIBUCIONES MENSUALES:**
- ✅ 12 PRs a repositorios externos
- ✅ 120+ commits en repositorios externos
- ✅ 40+ issues resueltos
- ✅ 20+ stars recibidos

**¡Con esta estrategia estarás en Top 5 garantizado! 🚀💰**

---

**¿Quieres que te ayude a hacer tu primera contribución hoy mismo?**
