
# 🩺 VeteLoHace - Guía de Instalación para Windows

## 🚀 INSTALACIÓN PASO A PASO

### **1. Requisitos previos**
- Node.js 18 o superior ([Descargar aquí](https://nodejs.org/))
- npm (viene con Node.js)

### **2. Descargar y extraer**
- Descarga el archivo `.zip` del proyecto
- Extrae la carpeta en tu ubicación preferida

### **3. Abrir terminal**
```cmd
# Navega a la carpeta del proyecto
cd C:\ruta\a\tu\proyecto\vetelohace-SOLUCIONADO
```

### **4. Instalar dependencias**
```cmd
# Instalar con solución de conflictos
npm install --legacy-peer-deps
```

### **5. Configurar base de datos**
```cmd
# Un solo comando que hace todo:
npm run setup
```

**Este comando hace:**
- ✅ Genera el cliente de Prisma
- ✅ Crea la base de datos SQLite
- ✅ Carga datos de prueba

### **6. Iniciar la aplicación**
```cmd
npm run dev
```

### **7. Abrir en navegador**
Abre: **http://localhost:3000**

---

## 🎯 COMANDOS RESUMIDOS

```cmd
cd C:\ruta\a\tu\proyecto\vetelohace-SOLUCIONADO
npm install --legacy-peer-deps
npm run setup
npm run dev
```

---

## ✨ ¿QUÉ PUEDES HACER?

### **Datos de prueba incluidos:**
- 👨‍⚕️ **Usuario**: `admin@vetelohace.com` / Contraseña: `123456`
- 🏥 **Clínica**: "Clínica VeteLoHace"
- 👥 **3 clientes** con sus mascotas
- 📋 **Consultas médicas** de ejemplo

### **Funciones disponibles:**
- ✅ Login/Registro de usuarios
- ✅ Gestión de clientes y mascotas
- ✅ Grabadora de voz con transcripción
- ✅ Generación automática de reportes
- ✅ Dashboard completo
- ✅ Calendario de citas

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### **Error: "prisma generate"**
```cmd
npx prisma generate
npx prisma db push
```

### **Error: "MODULE_NOT_FOUND"**
```cmd
npm install --legacy-peer-deps
```

### **Error: Puerto ocupado**
```cmd
npm run dev -- -p 3001
```

### **Limpiar instalación**
```cmd
rmdir /s node_modules
del package-lock.json
npm install --legacy-peer-deps
npm run setup
```

---

## 🔧 COMANDOS ÚTILES

```cmd
# Ver base de datos visualmente
npm run db:studio

# Reiniciar base de datos
npx prisma db push --force-reset
npm run db:seed

# Generar nuevo cliente Prisma
npm run db:generate
```

---

## 📞 ¿PROBLEMAS?

Si tienes errores:
1. **Verifica Node.js**: `node --version` (debe ser 18+)
2. **Limpia caché**: `npm cache clean --force`
3. **Reinstala dependencias**: Sigue la sección "Limpiar instalación"

---

## 🎉 ¡LISTO PARA USAR!

Una vez que veas:
```
✓ Ready on http://localhost:3000
✓ Compiled successfully
```

**¡Tu sistema veterinario VeteLoHace está funcionando!** 🐾

---

### **Características principales:**
- 🎤 **Grabación de voz** para dictar consultas
- 🤖 **IA para transcripción** automática
- 📊 **Reportes profesionales** generados automáticamente
- 📱 **Interfaz moderna** y fácil de usar
- 💾 **Base de datos SQLite** (sin configuración compleja)

**¡Disfruta tu nueva herramienta veterinaria!** ✨
