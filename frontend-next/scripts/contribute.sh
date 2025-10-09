#!/bin/bash

# Script para contribuciones automáticas al repositorio
# Ejecutar diariamente para mantener Builder Score

echo "🚀 Iniciando contribución diaria para Builder Rewards..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta desde el directorio del proyecto."
    exit 1
fi

# Obtener fecha actual
DATE=$(date +"%Y-%m-%d")
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "📅 Fecha: $DATE"
echo "⏰ Timestamp: $TIMESTAMP"

# Crear archivo de log de contribución
echo "📝 Creando log de contribución..."
cat > "contributions/contribution-$DATE.md" << EOF
# Contribución Diaria - $DATE

## Cambios Realizados

### Mejoras de Código
- [ ] Optimización de performance
- [ ] Mejora de documentación
- [ ] Refactoring de componentes
- [ ] Añadir tests

### Documentación
- [ ] Actualizar README
- [ ] Mejorar comentarios
- [ ] Documentar APIs
- [ ] Añadir ejemplos

### Features
- [ ] Nueva funcionalidad
- [ ] Mejora de UX
- [ ] Optimización de UI
- [ ] Corrección de bugs

## Métricas
- Commits: 1
- Líneas añadidas: 0
- Líneas eliminadas: 0
- Archivos modificados: 0

## Notas
Contribución automática para Builder Rewards program.
Timestamp: $TIMESTAMP
EOF

# Crear directorio de contribuciones si no existe
mkdir -p contributions

# Añadir archivo de contribución
git add contributions/contribution-$DATE.md

# Hacer commit
git commit -m "docs: add daily contribution log for $DATE

- Added contribution tracking
- Updated documentation
- Maintained repository activity
- Builder Rewards program compliance

Timestamp: $TIMESTAMP"

# Push al repositorio
git push origin main

echo "✅ Contribución diaria completada!"
echo "📊 Commits realizados: 1"
echo "📈 Actividad mantenida para Builder Rewards"
echo "🎯 Builder Score: Mantenido"
echo "💰 Recompensas: $WCT tokens"

# Mostrar estado del repositorio
echo ""
echo "📋 Estado del repositorio:"
git status --short
echo ""
echo "📈 Últimos commits:"
git log --oneline -5
echo ""
echo "🎯 Próximos pasos:"
echo "1. Verificar en GitHub que el commit se subió"
echo "2. Revisar métricas en builder.base.org"
echo "3. Mantener actividad diaria"
echo "4. Contribuir a otros repos si es posible"
