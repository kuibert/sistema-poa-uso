# Sistema de Gestión POA
## Universidad de Sonsonate

Sistema integral para la gestión, seguimiento y control del Plan Operativo Anual (POA).

---

## 🚀 Inicio Rápido (Desarrollo)

Si ya tienes todo configurado, simplemente ejecuta:

1. **Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

---

## 📦 Configuración para Nuevos Desarrolladores

### 1. Requisitos Previos
- **Node.js**: v18 LTS o superior.
- **PostgreSQL**: Instalado y corriendo.

### 2. Instalación de Dependencias
Ejecuta en la raíz del proyecto:
```powershell
# Instalar en backend
cd backend
npm install

# Instalar en frontend
cd ../frontend
npm install
```

### 3. Variables de Entorno
Copia los archivos de ejemplo y configura tus credenciales:

**Backend (`backend/.env`):**
```powershell
cd backend
cp .env.example .env
# 💡 Configura DATABASE_URL y las credenciales de DB_USER, DB_PASSWORD, etc.
```

### 4. Base de Datos (Flujo Prisma)
Ya no necesitas ejecutar scripts SQL manuales. Prisma se encarga de todo:

```powershell
cd backend
# Sincroniza la estructura de la base de datos
npx prisma migrate dev
```

---

## 📁 Estructura del Proyecto

```
sistema-poa-uso/
├── backend/          # API REST (Node.js + Express + TypeScript)
│   ├── prisma/       # Esquema y migraciones de Base de Datos
│   ├── src/          # Código fuente (Rutas, Servicios, Controllers)
│   └── scripts/      # Utilidades de mantenimiento
├── frontend/         # Interfaz de Usuario (React + Vite + TypeScript)
├── database/         # Datos de semilla y notas de usuarios
└── README.md         # Guía principal
```

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, TypeScript, Vite, CSS Vanilla (Premium Design).
- **Backend API**: Node.js, Express, TypeScript.
- **ORM / Database**: Prisma (Migraciones), PostgreSQL (pg pool para queries).
- **Autenticación**: JWT (JSON Web Tokens) con Cookies.

---

## � Notas para el Equipo
- **Ramas**: Los cambios más recientes se encuentran usualmente en la rama `devmelvin`.
- **Base de Datos**: Si haces cambios al esquema, edita `backend/prisma/schema.prisma` y ejecuta `npx prisma migrate dev`.
- **Usuarios de Prueba**: Revisa `database/usuarios` para ver credenciales de login disponibles.

---

**Universidad de Sonsonate**  
*Facultad de Ingeniería / Sistema de Gestión POA*  
Última actualización: Enero 2026
