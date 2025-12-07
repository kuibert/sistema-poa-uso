# 🏗️ ESTRUCTURA DEL PROYECTO - SISTEMA POA

## 📁 Estructura de Carpetas Completa

```
poa-system/
│
├── backend/                          # Node.js + Express (Integrante 1)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Configuración PostgreSQL
│   │   │   └── env.js               # Variables de entorno
│   │   │
│   │   ├── controllers/             # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── usuarioController.js
│   │   │   ├── proyectoController.js
│   │   │   ├── actividadController.js
│   │   │   ├── indicadorController.js
│   │   │   ├── costoController.js
│   │   │   ├── gastoController.js
│   │   │   ├── evidenciaController.js
│   │   │   └── dashboardController.js
│   │   │
│   │   ├── models/                  # Modelos de datos (opcional con Sequelize)
│   │   │   ├── Usuario.js
│   │   │   ├── Proyecto.js
│   │   │   ├── Actividad.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/                  # Definición de rutas
│   │   │   ├── authRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   ├── proyectoRoutes.js
│   │   │   ├── actividadRoutes.js
│   │   │   ├── indicadorRoutes.js
│   │   │   ├── costoRoutes.js
│   │   │   ├── gastoRoutes.js
│   │   │   ├── evidenciaRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   │
│   │   ├── middlewares/             # Middlewares personalizados
│   │   │   ├── authMiddleware.js    # Verificar JWT
│   │   │   ├── errorHandler.js      # Manejo de errores
│   │   │   ├── uploadMiddleware.js  # Upload de archivos
│   │   │   └── validationMiddleware.js
│   │   │
│   │   ├── utils/                   # Utilidades
│   │   │   ├── jwt.js               # Generación de tokens
│   │   │   ├── validators.js        # Validaciones
│   │   │   └── calculations.js      # Cálculos de KPIs
│   │   │
│   │   └── app.js                   # Configuración de Express
│   │
│   ├── uploads/                     # Archivos subidos (evidencias)
│   ├── .env                         # Variables de entorno (NO subir a Git)
│   ├── .env.example                 # Ejemplo de variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                    # Punto de entrada
│   └── README.md
│
├── frontend/                        # React (Integrantes 2 y 3)
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                  # Imágenes, iconos, etc.
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │       └── global.css
│   │   │
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Alert.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   │
│   │   │   ├── dashboard/           # Componentes del Dashboard
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── ProyectosTable.jsx
│   │   │   │   └── ActividadesMesTable.jsx
│   │   │   │
│   │   │   ├── proyecto/            # Componentes de Proyectos
│   │   │   │   ├── ProyectoForm.jsx
│   │   │   │   ├── ActividadBlock.jsx
│   │   │   │   ├── MesesCheckbox.jsx
│   │   │   │   ├── IndicadorForm.jsx
│   │   │   │   └── CostosTable.jsx
│   │   │   │
│   │   │   ├── seguimiento/         # Componentes de Seguimiento
│   │   │   │   ├── GanttMensual.jsx
│   │   │   │   ├── ActividadCard.jsx
│   │   │   │   └── ProgressBar.jsx
│   │   │   │
│   │   │   ├── gastos/              # Componentes de Gastos
│   │   │   │   ├── GastoForm.jsx
│   │   │   │   └── GastosTable.jsx
│   │   │   │
│   │   │   └── evidencias/          # Componentes de Evidencias
│   │   │       ├── EvidenciaUpload.jsx
│   │   │       └── EvidenciasTable.jsx
│   │   │
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx        # page0.html
│   │   │   ├── RegistroProyecto.jsx # page1.html
│   │   │   ├── Seguimiento.jsx      # page2.html
│   │   │   ├── Gastos.jsx           # gastos.html
│   │   │   ├── Evidencias.jsx       # evidencias.html
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/                 # Context API para estado global
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProyectoContext.jsx
│   │   │
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProyectos.js
│   │   │   └── useActividades.js
│   │   │
│   │   ├── services/                # Llamadas a API
│   │   │   ├── api.js               # Configuración de Axios
│   │   │   ├── authService.js
│   │   │   ├── proyectoService.js
│   │   │   ├── actividadService.js
│   │   │   ├── gastoService.js
│   │   │   ├── evidenciaService.js
│   │   │   └── dashboardService.js
│   │   │
│   │   ├── utils/                   # Utilidades
│   │   │   ├── formatters.js        # Formateo de fechas, moneda
│   │   │   ├── validators.js        # Validaciones de formularios
│   │   │   └── constants.js         # Constantes
│   │   │
│   │   ├── App.jsx                  # Componente principal
│   │   ├── main.jsx                 # Punto de entrada
│   │   └── routes.jsx               # Configuración de rutas
│   │
│   ├── .env                         # Variables de entorno
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── database/                        # Scripts de base de datos
│   ├── base_postgres.sql           # Script principal (ya existe)
│   ├── seeds.sql                   # Datos de prueba
│   └── migrations/                 # Migraciones (opcional)
│
├── docs/                           # Documentación
│   ├── API.md                      # Documentación de endpoints
│   ├── ARQUITECTURA.md             # Diagrama de arquitectura
│   └── MANUAL_USUARIO.md           # Manual de usuario
│
├── .gitignore                      # Archivos a ignorar en Git
├── README.md                       # Documentación principal
└── docker-compose.yml              # Docker (opcional)
```

---

## 🔧 CONFIGURACIÓN INICIAL

### Backend (Integrante 1)

#### 1. Inicializar proyecto:
```bash
cd backend
npm init -y
```

#### 2. Instalar dependencias:
```bash
npm install express pg dotenv cors jsonwebtoken bcryptjs multer
npm install --save-dev nodemon
```

#### 3. Crear `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=poa_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=development
```

#### 4. Configurar `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

### Frontend (Integrantes 2 y 3)

#### 1. Crear proyecto con Vite:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

#### 2. Instalar dependencias:
```bash
npm install react-router-dom axios
npm install --save-dev @vitejs/plugin-react
```

#### 3. Crear `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Configurar `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

---

## 📋 CHECKLIST DE TAREAS TÉCNICAS

### Integrante 1 (Backend) - Semana 1

- [ ] Crear estructura de carpetas del backend
- [ ] Configurar Express básico en `server.js`
- [ ] Configurar conexión a PostgreSQL en `config/database.js`
- [ ] Ejecutar `base_postgres.sql` en PostgreSQL
- [ ] Crear middleware de autenticación JWT
- [ ] Implementar endpoint POST `/api/auth/login`
- [ ] Implementar endpoint POST `/api/auth/register`
- [ ] Probar endpoints con Postman
- [ ] Configurar CORS para permitir peticiones desde React
- [ ] Crear `.gitignore` (incluir `node_modules/`, `.env`, `uploads/`)

### Integrante 2 (Frontend) - Semana 1

- [ ] Crear estructura de carpetas del frontend
- [ ] Configurar React Router
- [ ] Crear componente `Layout` con Header
- [ ] Crear página `Login.jsx`
- [ ] Configurar Axios en `services/api.js`
- [ ] Crear `AuthContext` para manejo de sesión
- [ ] Implementar login funcional (conectar con backend)
- [ ] Crear rutas protegidas
- [ ] Aplicar estilos base (convertir CSS de page0.html)
- [ ] Crear componentes reutilizables: Button, Input, Table

### Integrante 3 (Frontend) - Semana 1

- [ ] Familiarizarse con estructura del proyecto
- [ ] Crear componentes comunes: Modal, Loader, Alert
- [ ] Convertir estilos de page2.html a CSS modular
- [ ] Crear componente `Sidebar` para navegación
- [ ] Crear página `NotFound.jsx`
- [ ] Configurar rutas en `routes.jsx`
- [ ] Crear utilidades en `utils/formatters.js` (formateo de fechas, moneda)
- [ ] Crear constantes en `utils/constants.js` (meses, estados)
- [ ] Documentar componentes creados
- [ ] Ayudar en testing de login

---

## 🔗 ENDPOINTS DE API (Contrato Backend-Frontend)

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Proyectos
- `GET /api/proyectos` - Listar proyectos (con filtros)
- `GET /api/proyectos/:id` - Obtener proyecto completo
- `POST /api/proyectos` - Crear proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

### Actividades
- `GET /api/actividades` - Listar actividades
- `GET /api/actividades/:id` - Obtener actividad
- `POST /api/actividades` - Crear actividad
- `PUT /api/actividades/:id` - Actualizar actividad
- `DELETE /api/actividades/:id` - Eliminar actividad
- `GET /api/proyectos/:id/actividades` - Actividades de un proyecto

### Planificación Mensual
- `GET /api/actividades/:id/planificacion` - Obtener meses planificados
- `POST /api/actividades/:id/planificacion` - Guardar meses planificados

### Seguimiento Mensual
- `GET /api/actividades/:id/seguimiento` - Obtener estados mensuales
- `PUT /api/actividades/:id/seguimiento` - Actualizar estados mensuales

### Indicadores
- `GET /api/actividades/:id/indicadores` - Obtener indicadores
- `POST /api/indicadores` - Crear indicador
- `PUT /api/indicadores/:id` - Actualizar indicador

### Costos
- `GET /api/proyectos/:id/costos` - Obtener costos del proyecto
- `POST /api/costos` - Crear costo
- `PUT /api/costos/:id` - Actualizar costo
- `DELETE /api/costos/:id` - Eliminar costo

### Gastos
- `GET /api/actividades/:id/gastos` - Obtener gastos de actividad
- `POST /api/gastos` - Registrar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Evidencias
- `GET /api/actividades/:id/evidencias` - Obtener evidencias
- `POST /api/evidencias` - Subir evidencia (multipart/form-data)
- `GET /api/evidencias/:id/download` - Descargar archivo
- `DELETE /api/evidencias/:id` - Eliminar evidencia

### Dashboard
- `GET /api/dashboard/portafolio` - KPIs del portafolio
- `GET /api/dashboard/proyectos` - Resumen de proyectos
- `GET /api/dashboard/actividades-mes` - Actividades del mes actual

---

## 🎨 GUÍA DE ESTILOS (CSS)

### Variables CSS a usar:
```css
:root {
  --banner-azul: #002b5c;
  --fondo-azul: #0b2447;
  --tarjeta-azul: #142d52;
  --texto-claro: #e9edf3;
  --texto-sec: #bfc7d1;
  --verde-hoja: #3fa65b;
  --borde: rgba(255,255,255,0.08);
  --estado-P: #a93226;
  --estado-I: #a5673f;
  --estado-F: #2ecc71;
}
```

### Componentes a mantener:
- Botones con border-radius: 999px
- Cards con border-radius: 14px
- Dividers con gradiente verde
- Tablas con hover effects
- Estados con pills de colores

---

## 📦 DEPENDENCIAS RECOMENDADAS

### Backend:
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5-lts.1",
  "express-validator": "^7.0.1"
}
```

### Frontend:
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2"
}
```

### Opcionales (si hay tiempo):
- **Backend:** `sequelize` (ORM), `helmet` (seguridad), `morgan` (logs)
- **Frontend:** `react-query` (cache), `formik` (formularios), `chart.js` (gráficos)

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Para cada funcionalidad:
1. ✅ Código funciona sin errores
2. ✅ Validaciones implementadas
3. ✅ Manejo de errores apropiado
4. ✅ Responsive (móvil y desktop)
5. ✅ Comentarios en código complejo
6. ✅ Probado manualmente
7. ✅ Integrado con backend/frontend

---

**¡Éxito en el desarrollo!** 🚀
