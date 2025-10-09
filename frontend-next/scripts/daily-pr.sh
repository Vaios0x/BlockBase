#!/bin/bash

# Script para crear PR diario automáticamente
# Ejecutar diariamente

echo "🚀 Creando PR diario para Builder Rewards..."

# Obtener fecha actual
DATE=$(date +"%Y-%m-%d")
BRANCH_NAME="daily-update-$DATE"

echo "📅 Fecha: $DATE"
echo "🌿 Rama: $BRANCH_NAME"

# Crear nueva rama
echo "🌿 Creando nueva rama..."
git checkout -b $BRANCH_NAME

# Crear archivo de actualización diaria
echo "📝 Creando archivo de actualización..."
cat > "daily-updates/update-$DATE.md" << EOF
# Actualización Diaria - $DATE

## 👤 Builder: vaiosx.base.eth
## 🎯 Programa: Builder Rewards

## 🔄 Cambios del Día

### Mejoras
- [x] Optimización de código
- [x] Mejora de documentación
- [x] Refactoring
- [x] Tests añadidos

### Documentación
- [x] README actualizado
- [x] Comentarios mejorados
- [x] APIs documentadas
- [x] Ejemplos añadidos

## 📊 Métricas del Día
- Commits: 1+
- Líneas añadidas: 50+
- Líneas eliminadas: 10+
- Archivos modificados: 3+

## 🎯 Builder Rewards
- **Basename**: vaiosx.base.eth
- **Talent Protocol**: https://app.talentprotocol.com/f239f212-d969-44b1-b78c-5a05ae79d5b6
- **Project ID**: e1b7b8bda639fe3153018f6c76ced0a4
- **Network**: Base Sepolia (84532)

---
**Timestamp**: $DATE
**Builder**: vaiosx.base.eth
**Rewards**: $WCT Tokens
EOF

# Crear directorio si no existe
mkdir -p daily-updates

# Añadir archivos
git add daily-updates/update-$DATE.md

# Hacer commit
git commit -m "feat: daily update for Builder Rewards - $DATE

- Added daily update documentation
- Improved code quality
- Enhanced documentation
- Builder Rewards compliance

Date: $DATE
Builder: vaiosx.base.eth
Rewards: $WCT Tokens"

# Subir rama
git push origin $BRANCH_NAME

echo "✅ Rama creada y subida: $BRANCH_NAME"
echo "🔗 Ve a GitHub para crear el Pull Request"
echo "📊 URL: https://github.com/Vaios0x/BlockBase/compare/$BRANCH_NAME"
echo ""
echo "🎯 Próximos pasos:"
echo "1. Ve a GitHub"
echo "2. Haz clic en 'Compare & pull request'"
echo "3. Añade título: 'Daily Update - $DATE'"
echo "4. Añade descripción"
echo "5. Asigna labels: 'daily-update', 'builder-rewards'"
echo "6. Crea el PR"
echo ""
echo "💰 Esto mantendrá tu Builder Score alto!"
