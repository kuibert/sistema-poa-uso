# 📊 Sistema de Gestión POA - Universidad de Sonsonate

Sistema web para la gestión de Planes Operativos Anuales (POA) con seguimiento de proyectos, actividades, indicadores, gastos y evidencias.

## 🚀 Stack Tecnológico

- **Backend:** Node.js + TypeScript + Express + PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Base de datos:** PostgreSQL 15+
- **Autenticación:** JWT

---

## 📁 Estructura del Proyecto

```
sistema-poa-uso/
├── backend/                    # Backend TypeScript
│   ├── src/
│   │   ├── config.ts          # Configuración
│   │   ├── db.ts              # Pool PostgreSQL
│   │   ├── server.ts          # Servidor Express
│   │   ├── middleware/        # Auth + ErrorHandler
│   │   ├── routes/            # Rutas REST
│   │   ├── services/          # Lógica de negocio
│   │   └── types/             # Interfaces TypeScript
│   ├── uploads/               # Archivos subidos
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── main.tsx           # Entrada
│   │   ├── App.tsx            # Rutas
│   │   ├── pages/             # Páginas (pendiente)
│   │   ├── components/        # Componentes (pendiente)
│   │   ├── services/          # API Client
│   │   └── types/             # Interfaces TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── database/                   # Scripts SQL
│   └── base_postgres.sql      # Schema inicial
│
├── GUIA_INSTALACION_GABI.md   # Guía para Gaby
└── README.md                   # Este archivo
```

---

## 🔧 Instalación

### Requisitos Previos

- Node.js 18+ (LTS)
- PostgreSQL 15+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/kuibert/sistema-poa-uso.git
cd sistema-poa-uso
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=poa_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_jwt
NODE_ENV=development
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos
createdb poa_db

# Ejecutar script
psql -U postgres -d poa_db -f database/base_postgres.sql
```

### 4. Configurar Frontend

```bash
cd frontend
npm install
```

### 5. Iniciar Servidores

**Backend:**
```bash
cd backend
npm run dev
# Corre en http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Corre en http://localhost:3000
```

---

## 📡 API Endpoints

### Autenticación
- `POST /auth/login` - Login
- `GET /auth/me` - Usuario actual

### Proyectos
- `GET /api/proyectos/dashboard?anio=2026` - Dashboard
- `GET /api/proyectos?anio=2026` - Lista proyectos
- `POST /api/proyectos` - Crear proyecto
- `GET /api/proyectos/:id` - Detalle proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto

### Actividades
- `POST /api/proyectos/:id/actividades` - Crear actividad
- `PUT /api/actividades/:id` - Actualizar actividad
- `PUT /api/proyectos/actividades/:id/plan-mensual` - Planificación mensual

### Seguimiento
- `GET /api/proyectos/:id/seguimiento` - Seguimiento proyecto
- `PUT /api/proyectos/actividades/:id/seguimiento-mensual` - Actualizar seguimiento

### Gastos
- `GET /api/actividades/:id/gastos` - Listar gastos
- `POST /api/actividades/:id/gastos` - Crear gasto
- `PUT /api/gastos/:id` - Actualizar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Evidencias
- `GET /api/actividades/:id/evidencias` - Listar evidencias
- `POST /api/actividades/:id/evidencias` - Subir evidencia
- `DELETE /api/evidencias/:id` - Eliminar evidencia

---

## 👥 Equipo de Desarrollo

### Salvador - Backend Developer
**Responsabilidad:** Backend TypeScript completo

**Estado:** ✅ Completado
- [x] Configuración TypeScript
- [x] 18 endpoints REST
- [x] Autenticación JWT
- [x] Services de negocio
- [x] Middleware de auth y errores

### Carlos - Frontend Developer (Parte 1)
**Responsabilidad:** Services + Páginas principales

**Estado:** ✅ Completado
- [x] Services (apiClient, authApi, poaApi)
- [x] Componentes comunes (Modal, Button, Input)
- [x] Login
- [x] Dashboard POA
- [x] Proyecto POA (crear/editar)
- [x] MainLayout
- [x] Componentes de proyecto (MesesCheckbox, ActividadBlock)
- [x] Gestión de indicadores
- [x] Resumen de costos

### Gaby - Frontend Developer (Parte 2)
**Responsabilidad:** Páginas de seguimiento

**Tareas:** Ver `GUIA_INSTALACION_GABI.md`
- [ ] Página Seguimiento (4 archivos)
- [ ] Página Gastos (3 archivos)
- [ ] Página Evidencias (3 archivos)

---

## 📊 Progreso del Proyecto

| Módulo | Estado | Progreso |
|--------|--------|----------|
| **Backend** | ✅ Completo | 100% |
| **Frontend - Config** | ✅ Completo | 100% |
| **Frontend - Services** | ✅ Completo | 100% |
| **Frontend - Páginas** | ✅ Completo | 80% |
| **Frontend - Componentes** | ✅ Completo | 80% |

**Progreso Total:** 80%

---

## 🗂️ Base de Datos

### Tablas Principales

- `usuario` - Usuarios del sistema
- `proyecto` - Proyectos POA
- `actividad` - Actividades de proyectos
- `actividad_mes_plan` - Planificación mensual
- `actividad_mes_seguimiento` - Seguimiento mensual
- `indicador_actividad` - Indicadores de logro
- `costo_proyecto` - Costos del proyecto
- `gasto_actividad` - Gastos por actividad
- `evidencia_actividad` - Evidencias documentales
- `proyecto_usuario_rol` - Permisos por proyecto

---

## 🔐 Roles y Permisos

- **ADMIN** - Acceso total al sistema
- **USUARIO** - Acceso según permisos de proyecto

### Roles por Proyecto
- **OWNER** - Creador del proyecto, control total
- **EDITOR** - Puede editar seguimiento, gastos, evidencias
- **VIEWER** - Solo lectura

---

## 🚀 Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Compilar TypeScript
npm start        # Producción
```

### Frontend
```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 📝 Convenciones de Código

### TypeScript
- Usar interfaces para tipos
- Nombres en PascalCase para interfaces
- Nombres en camelCase para variables/funciones

### Git
- Commits en español
- Formato: `tipo: descripción`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`

### Branches
- `main` - Producción
- `develop` - Desarrollo
- `feature/nombre` - Nuevas funcionalidades

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar PostgreSQL
psql -U postgres -c "SELECT version();"

# Verificar .env
cat backend/.env

# Reinstalar dependencias
cd backend && rm -rf node_modules && npm install
```

### Frontend no compila
```bash
# Verificar Node.js
node --version  # Debe ser 18+

# Limpiar cache
cd frontend && rm -rf node_modules .vite && npm install
```

### Error de conexión a BD
```bash
# Verificar que PostgreSQL esté corriendo
# Windows: Servicios > postgresql-x64-15
# Linux: sudo systemctl status postgresql
```

---

## 📚 Documentación Adicional

- **Backend:** Ver `backend/src/` para código TypeScript
- **Frontend:** Ver `frontend/src/` para código React
- **API:** Ver endpoints en `backend/src/routes/`
- **Guía Gaby:** Ver `GUIA_INSTALACION_GABI.md`

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto es privado y pertenece a la Universidad de Sonsonate.

---

## 📞 Contacto

**Universidad de Sonsonate**
- Email: info@uso.edu.sv
- Web: https://uso.edu.sv

---

**Última actualización:** Diciembre 2024
**Versión:** 2.0.0 (TypeScript)
