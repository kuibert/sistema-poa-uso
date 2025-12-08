# 🎓 Sistema de Gestión de POA - Universidad de Sonsonate

Sistema web para la gestión del Plan Operativo Anual (POA) de la Universidad de Sonsonate, permitiendo el registro, seguimiento y control de proyectos institucionales.

## 📋 Descripción del Proyecto

El Sistema de Gestión de POA permite a la universidad:
- Registrar proyectos con información estratégica completa
- Gestionar actividades con planificación mensual
- Dar seguimiento mediante diagramas Gantt
- Controlar presupuestos (costos fijos y variables)
- Registrar gastos y evidencias documentales
- Medir indicadores de logro (KPIs)
- Visualizar dashboards consolidados del portafolio

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v18+
- **Express.js** v4.18+
- **PostgreSQL** v14+
- **JWT** para autenticación
- **Multer** para upload de archivos

### Frontend
- **React** v18+
- **React Router** v6+
- **Axios** para peticiones HTTP
- **Vite** como bundler

## 👥 Equipo de Desarrollo

- **Integrante 1:** Backend Developer (Node.js + PostgreSQL)
- **Integrante 2:** Frontend Developer (React - Módulos principales)
- **Integrante 3:** Frontend Developer (React - Seguimiento y evidencias)

## 📁 Estructura del Proyecto

```
poa-system/
├── backend/              # API REST con Node.js + Express
├── frontend/             # Aplicación React
├── database/             # Scripts SQL
├── docs/                 # Documentación
├── PLAN_DE_TRABAJO.md    # División de tareas y sprints
├── ESTRUCTURA_PROYECTO.md # Arquitectura detallada
├── EJEMPLOS_CODIGO.md    # Código de inicio rápido
├── CHECKLIST_PROYECTO.md # Seguimiento de progreso
└── README.md             # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js v18 o superior
- PostgreSQL v14 o superior
- Git
- Editor de código (VS Code recomendado)

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd poa-system
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
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=development
```

Ejecutar script de base de datos:
```bash
psql -U postgres -d poa_db -f ../database/base_postgres.sql
```

Iniciar servidor:
```bash
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Iniciar aplicación:
```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`

## 📊 Base de Datos

### Tablas principales (10):
1. **usuario** - Usuarios del sistema
2. **proyecto** - Proyectos POA
3. **actividad** - Actividades de cada proyecto
4. **actividad_mes_plan** - Planificación mensual
5. **actividad_mes_seguimiento** - Seguimiento mensual (P/I/F)
6. **indicador_actividad** - Indicadores de logro (KPIs)
7. **costo_proyecto** - Costos fijos y variables
8. **gasto_actividad** - Gastos ejecutados
9. **evidencia_actividad** - Archivos de evidencia
10. **proyecto_usuario_rol** - Permisos (OWNER/EDITOR/VIEWER)

### Diagrama ER
Ver archivo `docs/ARQUITECTURA.md` para el diagrama completo.

## 🎯 Funcionalidades Principales

### 1. Dashboard (page0.html → Dashboard.jsx)
- KPIs del portafolio de proyectos
- Tabla de proyectos activos
- Actividades del mes consolidadas
- Indicadores de presupuesto y avance

### 2. Registro de Proyectos (page1.html → RegistroProyecto.jsx)
- Información estratégica (línea, objetivo, acción)
- Datos del proyecto
- Gestión de actividades con meses de ejecución
- Indicadores de logro por actividad
- Presupuesto (costos variables y fijos)

### 3. Seguimiento (page2.html → Seguimiento.jsx)
- Gantt mensual por actividad
- Estados: Pendiente (P), Iniciado (I), Finalizado (F)
- Cálculo automático de progreso
- Indicadores de cumplimiento

### 4. Gastos (gastos.html → Gastos.jsx)
- Registro de gastos por actividad
- Cálculo de disponible
- Historial de gastos

### 5. Evidencias (evidencias.html → Evidencias.jsx)
- Upload de archivos (actas, informes, fotos)
- Gestión de evidencias documentales
- Descarga de archivos

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:
- Login genera un token válido por 24 horas
- Token se envía en header `Authorization: Bearer <token>`
- Rutas protegidas requieren token válido

### Usuario de prueba:
```
Correo: admin@uso.edu.sv
Password: demo123
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Proyectos
- `GET /api/proyectos` - Listar proyectos
- `GET /api/proyectos/:id` - Obtener proyecto
- `POST /api/proyectos` - Crear proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

### Actividades
- `GET /api/actividades` - Listar actividades
- `GET /api/proyectos/:id/actividades` - Actividades de un proyecto
- `POST /api/actividades` - Crear actividad
- `PUT /api/actividades/:id` - Actualizar actividad

### Dashboard
- `GET /api/dashboard/portafolio` - KPIs del portafolio
- `GET /api/dashboard/proyectos` - Resumen de proyectos
- `GET /api/dashboard/actividades-mes` - Actividades del mes

Ver documentación completa en `docs/API.md`

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Deploy

### Backend (Heroku, Railway, Render)
1. Configurar variables de entorno
2. Conectar base de datos PostgreSQL
3. Deploy desde Git

### Frontend (Vercel, Netlify)
1. Configurar variable `VITE_API_URL`
2. Build: `npm run build`
3. Deploy carpeta `dist/`

## 📚 Documentación

- **PLAN_DE_TRABAJO.md** - División de tareas y plan de 4 sprints
- **GUIA_MIGRACION_HTML_A_REACT.md** - Cómo migrar los 5 HTML a React
- **EJEMPLOS_CODIGO.md** - Código backend para Salvador
- **EJEMPLOS_MIGRACION_HTML_REACT.md** - Ejemplos React para Gabi
- **backend/README.md** - Instrucciones para Salvador
- **frontend/README.md** - Instrucciones para Gabi

## 🚀 Inicio Rápido para el Equipo

### Salvador (Backend):
1. `cd backend`
2. `npm install`
3. Copiar `.env.example` a `.env` y configurar
4. Crear BD: `psql -U postgres -d poa_db -f ../database/base_postgres.sql`
5. `npm run dev`
6. Leer `EJEMPLOS_CODIGO.md`

### Gabi (Frontend):
1. `cd frontend`
2. `npm install`
3. Copiar `.env.example` a `.env`
4. `npm run dev`
5. Leer `GUIA_MIGRACION_HTML_A_REACT.md`

### Convención de commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación

## 🐛 Reporte de Bugs

Si encuentras un bug:
1. Verificar que no esté ya reportado en Issues
2. Crear nuevo Issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

## 📞 Contacto

**Universidad de Sonsonate**  
Proyecto académico - Sistema de Gestión POA

**Equipo de desarrollo:**
- Integrante 1: [correo]
- Integrante 2: [correo]
- Integrante 3: [correo]

## 📄 Licencia

Este proyecto es de uso académico para la Universidad de Sonsonate.

---

## 🎯 Roadmap

### Sprint 1 (Semana 1-2) ✅
- [x] Configuración inicial
- [x] Backend base
- [x] Frontend base
- [x] Login funcional

### Sprint 2 (Semana 2-3) 🔄
- [ ] APIs de Proyectos y Actividades
- [ ] Dashboard funcional
- [ ] Formulario de proyectos (50%)

### Sprint 3 (Semana 3-4) ⏳
- [ ] Todas las APIs
- [ ] Formulario completo
- [ ] Seguimiento con Gantt
- [ ] Gastos y evidencias

### Sprint 4 (Semana 5-6) ⏳
- [ ] Refinamiento
- [ ] Testing
- [ ] Documentación
- [ ] Deploy

---

## 🌟 Características Destacadas

- ✅ Interfaz moderna con tema azul profesional
- ✅ Responsive design (móvil y desktop)
- ✅ Gantt mensual interactivo
- ✅ Cálculo automático de KPIs
- ✅ Upload de archivos
- ✅ Exportación e impresión
- ✅ Control de permisos por proyecto

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** En desarrollo 🚧

---

**¡Éxito en el desarrollo del proyecto!** 🚀
