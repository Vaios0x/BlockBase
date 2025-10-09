# 🌿 Guía Simple de Git para Builder Rewards

## 📋 **¿QUÉ SON LAS RAMAS Y PRs?**

### 🌿 **Rama (Branch)**
- Es como una **copia** de tu código
- Te permite hacer cambios **sin afectar** el código principal
- Es como tener **múltiples versiones** de tu proyecto

### 🔄 **Pull Request (PR)**
- Es como **proponer cambios** a tu código
- GitHub te permite **revisar** los cambios antes de aplicarlos
- Es como **sugerir mejoras** a tu propio proyecto

## 🚀 **PROCESO SIMPLE**

### **PASO 1: Crear Rama**
```bash
# Crear nueva rama
git checkout -b mi-nueva-feature

# Hacer cambios (editar archivos)
# Luego hacer commit
git add .
git commit -m "feat: añadir nueva funcionalidad"

# Subir la rama
git push origin mi-nueva-feature
```

### **PASO 2: Crear PR en GitHub**
1. Ve a tu repositorio en GitHub
2. Verás un botón **"Compare & pull request"**
3. Haz clic
4. Añade título y descripción
5. Crea el PR

### **PASO 3: Mergear el PR**
1. Revisa los cambios
2. Haz clic en **"Merge pull request"**
3. Confirma

## 🎯 **EJEMPLOS PRÁCTICOS**

### **Ejemplo 1: Añadir Documentación**
```bash
# Crear rama
git checkout -b docs/mejorar-readme

# Editar README.md
# Hacer commit
git add README.md
git commit -m "docs: mejorar README con más información"

# Subir rama
git push origin docs/mejorar-readme

# Crear PR en GitHub
```

### **Ejemplo 2: Añadir Nueva Feature**
```bash
# Crear rama
git checkout -b feature/nuevo-componente

# Crear nuevo archivo
# Hacer commit
git add .
git commit -m "feat: añadir nuevo componente"

# Subir rama
git push origin feature/nuevo-componente

# Crear PR en GitHub
```

### **Ejemplo 3: Corregir Bug**
```bash
# Crear rama
git checkout -b fix/corregir-error

# Corregir el error
# Hacer commit
git add .
git commit -m "fix: corregir error en componente"

# Subir rama
git push origin fix/corregir-error

# Crear PR en GitHub
```

## 📅 **CRONOGRAMA SEMANAL**

### **Lunes: Documentación**
- Crear rama: `docs/actualizar-documentacion`
- Mejorar README
- Añadir comentarios
- Crear PR

### **Martes: Features**
- Crear rama: `feature/nueva-funcionalidad`
- Añadir nueva feature
- Crear PR

### **Miércoles: Mejoras**
- Crear rama: `improvement/mejorar-ui`
- Mejorar interfaz
- Crear PR

### **Jueves: Tests**
- Crear rama: `test/añadir-tests`
- Añadir tests
- Crear PR

### **Viernes: Optimización**
- Crear rama: `optimization/mejorar-performance`
- Optimizar código
- Crear PR

## 🤖 **SCRIPTS AUTOMÁTICOS**

### **Script Diario**
```bash
# Ejecutar diariamente
bash scripts/daily-pr.sh
```

### **Script Semanal**
```bash
# Ejecutar semanalmente
bash scripts/weekly-pr.sh
```

## 🎯 **BENEFICIOS PARA BUILDER REWARDS**

### **Commits Regulares**
- ✅ 1 commit por día
- ✅ Mensajes descriptivos
- ✅ Cambios significativos

### **Pull Requests**
- ✅ 1 PR por semana
- ✅ Descripciones claras
- ✅ Labels apropiados

### **Actividad Visible**
- ✅ GitHub detecta actividad
- ✅ Builder Score aumenta
- ✅ Recompensas $WCT

## 📊 **MÉTRICAS QUE TRACKING**

### **Commits**
- Frecuencia: Diaria
- Calidad: Mensajes descriptivos
- Tamaño: Cambios significativos

### **Pull Requests**
- Cantidad: 1 por semana
- Calidad: Descripciones claras
- Reviews: Auto-merge

### **Issues**
- Crear: 2-3 por semana
- Resolver: 1-2 por semana
- Etiquetar: builder-rewards

## 🚀 **COMANDOS ÚTILES**

### **Crear Rama**
```bash
git checkout -b nombre-de-rama
```

### **Ver Ramas**
```bash
git branch
```

### **Cambiar Rama**
```bash
git checkout main
```

### **Eliminar Rama**
```bash
git branch -d nombre-de-rama
```

## 💡 **TIPS IMPORTANTES**

### **Nombres de Ramas**
- `feature/nombre` - Para nuevas features
- `fix/nombre` - Para correcciones
- `docs/nombre` - Para documentación
- `test/nombre` - Para tests

### **Mensajes de Commit**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formato
- `refactor:` - Refactoring

### **Labels de PR**
- `feature` - Nueva funcionalidad
- `bugfix` - Corrección
- `documentation` - Documentación
- `builder-rewards` - Para el programa

## 🎯 **RESULTADO ESPERADO**

Con esta estrategia:
- ✅ **Builder Score ≥ 40**
- ✅ **Top 100 semanal**
- ✅ **$WCT tokens**
- ✅ **Tier 1/2**

---

**¡Recuerda: Es más fácil de lo que parece! Solo crea ramas, haz cambios, y crea PRs. 🚀**
