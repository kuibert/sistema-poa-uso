# Sistema de Gestión POA
## Universidad de Sonsonate

Sistema completo de gestión de Plan Operativo Anual (POA) con frontend React y backend Node.js.

---

## 🚀 Inicio Rápido

### Iniciar Backend
```bash
cd backend
npm run dev
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

---

## 📦 Instalación

### 1. Instalar Node.js
- Descargar de: https://nodejs.org/
- Versión recomendada: 18 LTS o superior

### 2. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno

**Backend:**
```bash
cd backend
copy .env.example .env
# Editar .env con tus credenciales de base de datos
```

**Frontend:**
```bash
cd frontend
copy .env.example .env
```

### 4. Configurar base de datos

```bash
# Crear base de datos en PostgreSQL
psql -U postgres -f database/base_postgres.sql
```

---

## 📁 Estructura del Proyecto

```
POA DEVELOPMENT/
├── backend/          # API Node.js + Express + TypeScript
├── frontend/         # React + TypeScript + Vite
├── database/         # Scripts SQL
└── docs/             # Documentación y prototipos
```

---

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Base de datos:** PostgreSQL (puerto 5432)

---

## 📚 Documentación

- **Frontend:** Ver `frontend/README.md`
- **Backend:** Ver `backend/README.md`
- **Prototipos HTML:** Ver `docs/Sistema de Gestión de POA/`

---

## 🛠️ Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Multer (uploads)

---

## 👥 Equipo de Desarrollo

**Universidad de Sonsonate**  
Sistema de Gestión POA

---

**Última actualización:** Diciembre 2024

---

## 🔄 Guía de Actualización para el Equipo

Si estás descargando cambios recientes (especialmente relacionados con **seguridad**), sigue estos pasos:

1.  **Descargar Código**:
    ```bash
    git pull origin <tu-rama>
    ```

2.  **Actualizar Dependencias (Backend)**:
    ```bash
    cd backend
    npm install
    ```

3.  **Migración de Base de Datos**:
    *   Ejecuta el script para agregar contraseñas seguras automáticamente:
    ```bash
    # Desde carpeta backend/
    npx ts-node src/migrate_password.ts
    ```

4.  **Actualizar Frontend**:
    ```bash
    cd ../frontend
    npm install
    ```

5.  **Listo**: Reinicia tus servidores (`npm run dev`). La contraseña por defecto para usuarios existentes será `123456`.
