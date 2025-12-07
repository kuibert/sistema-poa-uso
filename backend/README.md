# Backend - Sistema POA

## 🚀 Inicio Rápido (Salvador)

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env` y configura tus credenciales:
```bash
copy .env.example .env
```

Edita `.env` con tus datos de PostgreSQL.

### 3. Crear base de datos
```bash
psql -U postgres
CREATE DATABASE poa_db;
\q
psql -U postgres -d poa_db -f ../database/base_postgres.sql
```

### 4. Iniciar servidor
```bash
npm run dev
```

El servidor estará en: http://localhost:5000

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── config/          # Configuraciones (BD, etc)
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middlewares/     # Middlewares personalizados
│   └── utils/           # Utilidades
├── uploads/             # Archivos subidos
├── server.js            # Punto de entrada
└── package.json
```

## 📋 Tareas Pendientes

- [ ] Implementar autenticación (authController.js)
- [ ] Crear CRUD de usuarios
- [ ] Crear CRUD de proyectos
- [ ] Crear CRUD de actividades
- [ ] Implementar upload de archivos
- [ ] Crear endpoints de dashboard

Ver `PLAN_DE_TRABAJO.md` para más detalles.
