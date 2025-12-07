# 🎓 Sistema de Gestión de POA - Universidad de Sonsonate

## 📁 Estructura del Proyecto

```
POA DEVELOPMENT/
├── backend/                 # API Node.js + Express (Salvador)
│   ├── src/
│   │   ├── config/         # Configuración BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Rutas API
│   │   ├── middlewares/    # Middlewares
│   │   └── utils/          # Utilidades
│   ├── uploads/            # Archivos subidos
│   ├── server.js
│   └── package.json
│
├── frontend/               # React + Vite (Gabi + Moris)
│   ├── src/
│   │   ├── assets/        # Estilos e imágenes
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Llamadas API
│   │   ├── context/       # Context API
│   │   └── utils/         # Utilidades
│   ├── index.html
│   └── package.json
│
├── database/              # Scripts SQL
│   └── base_postgres.sql
│
├── Sistema de Gestión de POA/  # Prototipos HTML originales
│   ├── page0.html         # Dashboard
│   ├── page1.html         # Registro Proyecto
│   ├── page2.html         # Seguimiento
│   ├── gastos.html        # Gastos
│   └── evidencias.html    # Evidencias
│
├── PLAN_DE_TRABAJO.md
├── GUIA_MIGRACION_HTML_A_REACT.md
├── EJEMPLOS_CODIGO.md
├── INSTRUCCIONES_EQUIPO.md
└── README_PROYECTO.md (este archivo)
```

## 🚀 Inicio Rápido

### Backend (Salvador)
```bash
cd backend
npm install
copy .env.example .env
# Configurar .env con credenciales PostgreSQL
npm run dev
```

### Frontend (Gabi + Moris)
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## 👥 División de Trabajo

- **Salvador:** Backend completo (Node.js + PostgreSQL)
- **Gabi:** Frontend - Dashboard y Registro de Proyectos
- **Moris:** Frontend - Seguimiento, Gastos y Evidencias

## 📋 Archivos HTML a Migrar a React

1. `page0.html` → `Dashboard.jsx` (Gabi)
2. `page1.html` → `RegistroProyecto.jsx` (Gabi)
3. `page2.html` → `Seguimiento.jsx` (Moris)
4. `gastos.html` → `Gastos.jsx` (Moris)
5. `evidencias.html` → `Evidencias.jsx` (Moris)

## 📚 Documentación

- **INSTRUCCIONES_EQUIPO.md** - Instrucciones para Salvador y Gabi
- **PLAN_DE_TRABAJO.md** - Plan completo de 4 sprints
- **GUIA_MIGRACION_HTML_A_REACT.md** - Cómo migrar cada HTML
- **EJEMPLOS_CODIGO.md** - Código listo para usar

## 🎯 Objetivo

Crear un sistema web completo para gestionar el Plan Operativo Anual (POA) de la Universidad de Sonsonate con:
- 5 páginas funcionales
- Backend con APIs REST
- Base de datos PostgreSQL
- Frontend en React

**Duración:** 4-6 semanas  
**Stack:** React + Node.js + Express + PostgreSQL
