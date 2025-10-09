#!/bin/bash

# Script SÚPER SIMPLE para crear PR automáticamente
# Solo ejecutar y seguir las instrucciones

echo "🚀 Creando PR automático para Builder Rewards..."

# Obtener fecha
DATE=$(date +"%Y-%m-%d")
BRANCH_NAME="update-$DATE"

echo "📅 Fecha: $DATE"
echo "🌿 Creando rama: $BRANCH_NAME"

# Crear rama
git checkout -b $BRANCH_NAME

# Crear archivo simple
echo "📝 Creando archivo de actualización..."
cat > "updates/update-$DATE.txt" << EOF
Actualización automática - $DATE
Builder: vaiosx.base.eth
Programa: Builder Rewards
Timestamp: $(date)
EOF

# Crear directorio
mkdir -p updates

# Añadir y commit
git add updates/update-$DATE.txt
git commit -m "feat: daily update for Builder Rewards - $DATE

Builder: vaiosx.base.eth
Date: $DATE
Rewards: $WCT Tokens"

# Subir rama
git push origin $BRANCH_NAME

echo ""
echo "✅ ¡LISTO! Ahora sigue estos pasos:"
echo ""
echo "1. 🌐 Ve a: https://github.com/Vaios0x/BlockBase"
echo "2. 🔍 Busca el botón 'Compare & pull request'"
echo "3. 📝 Añade título: 'Daily Update - $DATE'"
echo "4. 📄 Añade descripción: 'Daily update for Builder Rewards'"
echo "5. 🏷️ Añade labels: 'builder-rewards', 'daily-update'"
echo "6. ✅ Haz clic en 'Create pull request'"
echo ""
echo "🎯 ¡Eso es todo! GitHub hará el resto automáticamente."
echo "💰 Esto mantendrá tu Builder Score alto para $WCT tokens!"
